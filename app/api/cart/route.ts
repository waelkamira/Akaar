import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/db/prisma';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { isPlainObject } from '@/lib/api/validation.mjs';

async function getUserCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    select: { id: true },
  });
}

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لعرض سلتك.' }, { status: 401 });
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        items: {
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true, quantity: true,
            product: { select: { id: true, title: true, images: true, basePrice: true, stockQuantity: true, isActive: true, isDeleted: true, approvalStatus: true, seller: { select: { status: true, isVerified: true, storeName: true } } } },
          },
        },
      },
    });
    const items = (cart?.items || []).filter(item =>
      item.product.isActive && !item.product.isDeleted &&
      item.product.approvalStatus === 'APPROVED' &&
      item.product.seller?.status === 'ACTIVE' && item.product.seller.isVerified
    );
    return NextResponse.json({ items, cartCount: items.reduce((sum, item) => sum + item.quantity, 0) }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Unable to load cart:', error);
    return NextResponse.json({ error: 'تعذر تحميل السلة.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لإضافة منتج إلى السلة.' }, { status: 401 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) return NextResponse.json({ error: 'بيانات المنتج غير صالحة.' }, { status: 400 });
  const productId = typeof parsed.value.productId === 'string' ? parsed.value.productId.trim() : '';
  const quantity = parsed.value.quantity === undefined ? 1 : parsed.value.quantity;
  if (!productId || productId.length > 128 || !Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > 100) {
    return NextResponse.json({ error: 'تحقق من المنتج والكمية.' }, { status: 400 });
  }
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true, isDeleted: false, approvalStatus: 'APPROVED', category: { isActive: true }, seller: { status: 'ACTIVE', isVerified: true } },
      select: { id: true, stockQuantity: true },
    });
    if (!product || product.stockQuantity === null || product.stockQuantity < 1) return NextResponse.json({ error: 'المنتج غير متاح حاليًا.' }, { status: 404 });
    const cart = await getUserCart(user.id);
    const result = await prisma.$transaction(async tx => {
      const current = await tx.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId } }, select: { quantity: true } });
      const nextQuantity = (current?.quantity || 0) + (quantity as number);
      if (nextQuantity > product.stockQuantity!) throw new Error('CART_STOCK_LIMIT');
      return tx.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        create: { cartId: cart.id, productId, quantity: quantity as number },
        update: { quantity: nextQuantity },
        select: { id: true, quantity: true },
      });
    });
    return NextResponse.json({ item: result, message: 'تمت إضافة المنتج إلى السلة.' }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'CART_STOCK_LIMIT') return NextResponse.json({ error: 'الكمية المطلوبة تتجاوز المخزون المتاح.' }, { status: 409 });
    console.error('Unable to add product to cart:', error);
    return NextResponse.json({ error: 'تعذرت إضافة المنتج إلى السلة.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لتعديل السلة.' }, { status: 401 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value) || typeof parsed.value.productId !== 'string' || !Number.isInteger(parsed.value.quantity) || (parsed.value.quantity as number) < 1 || (parsed.value.quantity as number) > 100) {
    return NextResponse.json({ error: 'المنتج أو الكمية غير صالحين.' }, { status: 400 });
  }
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (!cart) return NextResponse.json({ error: 'السلة فارغة.' }, { status: 404 });
    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: parsed.value.productId },
      select: { id: true, product: { select: { stockQuantity: true, isActive: true, isDeleted: true, approvalStatus: true } } },
    });
    if (!item || !item.product.isActive || item.product.isDeleted || item.product.approvalStatus !== 'APPROVED' || item.product.stockQuantity === null || (parsed.value.quantity as number) > item.product.stockQuantity) {
      return NextResponse.json({ error: 'المنتج أو الكمية المطلوبة غير متاحين.' }, { status: 409 });
    }
    const updated = await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: parsed.value.quantity as number }, select: { id: true, quantity: true } });
    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error('Unable to update cart item:', error);
    return NextResponse.json({ error: 'تعذر تحديث الكمية.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'سجّل الدخول لتعديل السلة.' }, { status: 401 });
  const parsed = await readJsonBody(request, 8 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value) || typeof parsed.value.productId !== 'string' || !parsed.value.productId.trim()) return NextResponse.json({ error: 'معرف المنتج غير صالح.' }, { status: 400 });
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (!cart) return NextResponse.json({ removed: true });
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: parsed.value.productId } });
    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error('Unable to remove cart item:', error);
    return NextResponse.json({ error: 'تعذر حذف المنتج من السلة.' }, { status: 500 });
  }
}
