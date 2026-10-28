/**
 * Derive persisted category fields only from a category record loaded by the server.
 * Client-provided category names are display input, not an authoritative category mapping.
 */
export function getCanonicalCategoryFields(category) {
  if (
    !category ||
    !Number.isSafeInteger(category.id) ||
    category.id < 1 ||
    typeof category.name !== 'string' ||
    !category.name.trim()
  ) {
    return null;
  }

  return {
    categoryId: category.id,
    categoryName: category.name.trim(),
  };
}
