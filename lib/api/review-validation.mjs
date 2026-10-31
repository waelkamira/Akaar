export function parseReviewSubmission(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const { targetType, targetId, rating, comment } = value;
  if (
    (targetType !== 'product' && targetType !== 'store') ||
    typeof targetId !== 'string' ||
    !targetId.trim() ||
    targetId.trim().length > 128 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    (comment !== undefined && comment !== null && typeof comment !== 'string')
  ) {
    return null;
  }

  const trimmedComment = typeof comment === 'string' ? comment.trim() : '';
  if (trimmedComment.length > 1000) return null;

  return {
    targetType,
    targetId: targetId.trim(),
    rating,
    comment: trimmedComment || null,
  };
}
