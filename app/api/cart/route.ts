import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { resolveCart, applyCartCookie } from '@/lib/cart/guest-session';

const eligibility = { isActive: true, isDeleted: false, approvalStatus: 'APPROVED', category: { isActive: true }, seller: { status: 'ACTIVE', isVerified: true } };
const productSelect = { id: true, title: true, images: true, basePrice: true, stockQuantity: true, isActive: true, isDeleted: true, approvalStatus: true, seller: { select: { status: true, isVerified: true, storeName: true } } };
async function cartContext(request: Request) {
  const user = await getAuthenticatedUser();
  return resolveCart(request, user?.id || null);
}
async function loadItems(cartId) {
  const cart = await prisma.cart.findUnique({ where: { id: cartId }, select: { items: { orderBy: { updatedAt: 'desc' }, select: { id: true, quantity: true, product: { select: productSelect } } } } });
  return (cart?.items || []).filter(({ product }) => product.isActive && !product.isDeleted && product.approvalStatus === 'APPROVED' && product.seller?.status === 'ACTIVE' && product.seller.isVerified);
}
export async function GET(request: Request) {
  try {
    const ctx = await cartContext(request);
    const items = await loadItems(ctx.cartId);
    return applyCartCookie(NextResponse.json({ items, cartCount: items.reduce((sum, item) => sum + item.quantity, 0) }), ctx);
  } catch (error) { console.error('Unable to load cart:', error); return NextResponse.json({ error: 'تعذر تحميل السلة.' }, { status: 500 }); }
}
export async function POST(request: Request) {
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات المنتج غير صالحة.' }, { status: 400 });
  const productId = typeof parsed.value.productId === 'string' ? parsed.value.productId.trim() : '';
  const quantity = parsed.value.quantity === undefined ? 1 : parsed.value.quantity;
  if (!productId || productId.length > 128 || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) return NextResponse.json({ error: 'تحقق من المنتج والكمية.' }, { status: 400 });
  let ctx;
  try {
    ctx = await cartContext(request);
    const product = await prisma.product.findFirst({ where: { id: productId, ...eligibility }, select: { id: true, stockQuantity: true } });
    if (!product || product.stockQuantity === null || product.stockQuantity < 1) return applyCartCookie(NextResponse.json({ error: 'المنتج غير متاح حاليًا.' }, { status: 404 }), ctx);
    const item = await prisma.$transaction(async tx => {
      const current = await tx.cartItem.findUnique({ where: { cartId_productId: { cartId: ctx.cartId, productId } }, select: { quantity: true } });
      const nextQuantity = (current?.quantity || 0) + quantity;
      if (nextQuantity > product.stockQuantity) throw new Error('CART_STOCK_LIMIT');
      return tx.cartItem.upsert({ where: { cartId_productId: { cartId: ctx.cartId, productId } }, create: { cartId: ctx.cartId, productId, quantity }, update: { quantity: nextQuantity }, select: { id: true, quantity: true } });
    });
    return applyCartCookie(NextResponse.json({ item, message: 'تمت إضافة المنتج إلى السلة.' }, { status: 201 }), ctx);
  } catch (error) {
    if (error instanceof Error && error.message === 'CART_STOCK_LIMIT') return ctx ? applyCartCookie(NextResponse.json({ error: 'الكمية المطلوبة تتجاوز المخزون المتاح.' }, { status: 409 }), ctx) : NextResponse.json({ error: 'الكمية المطلوبة تتجاوز المخزون المتاح.' }, { status: 409 });
    console.error('Unable to add product to cart:', error); return NextResponse.json({ error: 'تعذرت إضافة المنتج إلى السلة.' }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value) || typeof parsed.value.productId !== 'string' || !parsed.value.productId.trim() || !Number.isInteger(parsed.value.quantity) || parsed.value.quantity < 1 || parsed.value.quantity > 100) return NextResponse.json({ error: 'المنتج أو الكمية غير صالحين.' }, { status: 400 });
  try {
    const ctx = await cartContext(request);
    const item = await prisma.cartItem.findFirst({ where: { cartId: ctx.cartId, productId: parsed.value.productId }, select: { id: true, product: { select: { stockQuantity: true, isActive: true, isDeleted: true, approvalStatus: true, category: { select: { isActive: true } }, seller: { select: { status: true, isVerified: true } } } } } });
    if (!item || !item.product.isActive || item.product.isDeleted || item.product.approvalStatus !== 'APPROVED' || !item.product.category.isActive || item.product.seller?.status !== 'ACTIVE' || !item.product.seller.isVerified || item.product.stockQuantity === null || parsed.value.quantity > item.product.stockQuantity) return applyCartCookie(NextResponse.json({ error: 'المنتج أو الكمية المطلوبة غير متاحين.' }, { status: 409 }), ctx);
    const updated = await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: parsed.value.quantity }, select: { id: true, quantity: true } });
    return applyCartCookie(NextResponse.json({ item: updated }), ctx);
  } catch (error) { console.error('Unable to update cart item:', error); return NextResponse.json({ error: 'تعذر تحديث الكمية.' }, { status: 500 }); }
}
export async function DELETE(request: Request) {
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value) || typeof parsed.value.productId !== 'string' || !parsed.value.productId.trim()) return NextResponse.json({ error: 'معرف المنتج غير صالح.' }, { status: 400 });
  try {
    const ctx = await cartContext(request);
    await prisma.cartItem.deleteMany({ where: { cartId: ctx.cartId, productId: parsed.value.productId } });
    return applyCartCookie(NextResponse.json({ removed: true }), ctx);
  } catch (error) { console.error('Unable to remove cart item:', error); return NextResponse.json({ error: 'تعذر حذف المنتج من السلة.' }, { status: 500 }); }
}
