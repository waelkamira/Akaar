/**
 * Shared visibility constraints for public catalog reads.
 *
 * Keep these predicates centralized so public endpoints cannot accidentally
 * expose inactive, soft-deleted, or category-hidden products.
 */
export function publicProductWhere(extraWhere = {}) {
  return {
    ...extraWhere,
    isDeleted: false,
    isActive: true,
    approvalStatus: 'APPROVED',
    category: { isActive: true },
    OR: [
      { sellerId: null },
      { seller: { is: { status: 'ACTIVE', isVerified: true } } },
    ],
  };
}
