import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/db/prisma';

export const GUEST_CART_COOKIE = 'akaar_guest_cart';
const SESSION_DAYS = 30;

function cookieToken(cookieHeader = '') {
  const entry = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(GUEST_CART_COOKIE + '='));
  if (!entry) return null;
  try { return decodeURIComponent(entry.slice(GUEST_CART_COOKIE.length + 1)); } catch { return null; }
}

export function guestCartCookie(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${GUEST_CART_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}

export function clearGuestCartCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${GUEST_CART_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export async function resolveCart(request, userId = null) {
  const token = cookieToken(request.headers.get('cookie') || '');
  if (userId) {
    const userCart = await prisma.cart.upsert({
      where: { userId }, create: { userId }, update: {}, select: { id: true },
    });
    if (token) {
      const guest = await prisma.guestSession.findUnique({
        where: { token }, select: { id: true, expiresAt: true, cart: { select: { id: true, items: { select: { productId: true, quantity: true } } } } },
      });
      if (guest && guest.expiresAt > new Date()) {
        await prisma.$transaction(async (tx) => {
          for (const line of guest.cart?.items || []) {
            const product = await tx.product.findFirst({
              where: { id: line.productId, isActive: true, isDeleted: false, approvalStatus: 'APPROVED', category: { isActive: true }, seller: { status: 'ACTIVE', isVerified: true } },
              select: { stockQuantity: true },
            });
            if (!product || !product.stockQuantity || product.stockQuantity < 1) continue;
            const existing = await tx.cartItem.findUnique({
              where: { cartId_productId: { cartId: userCart.id, productId: line.productId } },
              select: { quantity: true },
            });
            const quantity = Math.min((existing?.quantity || 0) + line.quantity, product.stockQuantity);
            if (quantity > 0) await tx.cartItem.upsert({
              where: { cartId_productId: { cartId: userCart.id, productId: line.productId } },
              create: { cartId: userCart.id, productId: line.productId, quantity },
              update: { quantity },
            });
          }
          await tx.guestSession.delete({ where: { id: guest.id } });
        });
      } else if (guest) {
        await prisma.guestSession.deleteMany({ where: { id: guest.id } });
      }
    }
    return { cartId: userCart.id, setCookie: null, clearCookie: Boolean(token) };
  }

  if (token) {
    const session = await prisma.guestSession.findUnique({
      where: { token }, select: { id: true, expiresAt: true, cart: { select: { id: true } } },
    });
    if (session && session.expiresAt > new Date()) {
      const cart = session.cart || await prisma.cart.create({ data: { guestSessionId: session.id }, select: { id: true } });
      return { cartId: cart.id, setCookie: null, clearCookie: false };
    }
    if (session) await prisma.guestSession.deleteMany({ where: { id: session.id } });
  }

  const freshToken = randomBytes(32).toString('hex');
  const session = await prisma.guestSession.create({
    data: { token: freshToken, expiresAt: new Date(Date.now() + SESSION_DAYS * 86400000), cart: { create: {} } },
    select: { cart: { select: { id: true } } },
  });
  return { cartId: session.cart.id, setCookie: guestCartCookie(freshToken), clearCookie: false };
}

export function applyCartCookie(response, context) {
  if (context?.setCookie) response.headers.append('Set-Cookie', context.setCookie);
  if (context?.clearCookie) response.headers.append('Set-Cookie', clearGuestCartCookie());
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
