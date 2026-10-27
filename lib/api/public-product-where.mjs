/**
 * Public catalog visibility constraints supported by the legacy products table.
 * The deployed schema has isDeleted but does not have isActive or a category FK.
 */
export function publicProductWhere(extraWhere = {}) {
  return {
    ...extraWhere,
    isDeleted: false,
  };
}
