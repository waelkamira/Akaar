import { canDeleteProduct } from './product-delete-access.mjs';

export async function deleteProductAction({
  productId,
  authenticatedUser,
  prisma,
  now = () => new Date(),
}) {
  if (!authenticatedUser) {
    return { status: 401, body: { error: 'يجب تسجيل الدخول' } };
  }

  if (typeof productId !== 'string' || !productId.trim() || productId.length > 128) {
    return { status: 400, body: { error: 'معرف المنتج غير صالح' } };
  }

  try {
    const product = await prisma.product.findFirst({
      where: { id: productId, isDeleted: false },
      select: { id: true, userId: true },
    });

    if (!product || !canDeleteProduct(authenticatedUser, product)) {
      return {
        status: 404,
        body: { error: 'المنتج غير موجود أو لا تملك صلاحية حذفه' },
      };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isDeleted: true, deletedAt: now() },
    });

    return { status: 200, body: { message: 'تم حذف الإعلان بنجاح' } };
  } catch {
    return { status: 500, body: { error: 'Internal Server Error' } };
  }
}
