const VALID_DETAIL_KEY = /^[\w-]{1,80}$/;

export function sanitizeDetailsFilters(details, maxEntries = 30) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) return [];

  return Object.entries(details)
    .slice(0, maxEntries)
    .filter(([key, value]) =>
      typeof key === 'string' &&
      VALID_DETAIL_KEY.test(key) &&
      (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') &&
      value !== ''
    )
    .map(([key, value]) => [key, String(value).trim()])
    .filter(([, value]) => value.length > 0 && value.length <= 200);
}

export function sanitizeSearchText(value, maxLength = 120) {
  if (typeof value !== 'string' || !Number.isSafeInteger(maxLength) || maxLength < 1) return '';
  return value.trim().slice(0, maxLength);
}
