/**
 * @typedef {'GUEST' | 'CUSTOMER' | 'SELLER' | 'ADMIN'} UserRole
 * @typedef {'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED'} SellerStatus
 * @typedef {'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'} OrderStatus
 */

export const USER_ROLES = /** @type {const} */ ({
  GUEST: 'GUEST',
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
});

export const ORDER_STATUSES = /** @type {const} */ ({
  PENDING: 'PENDING',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
});
