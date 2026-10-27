export function canDeleteProduct(user, product) {
  if (!user?.id || !product?.id || !product?.userId) return false;
  return user.role === 'ADMIN' || user.id === product.userId;
}
