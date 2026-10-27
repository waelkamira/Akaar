export function parsePositiveInteger(value, fallback, max = Number.MAX_SAFE_INTEGER) {
  const raw = String(value ?? '').trim();
  if (!/^\\d+$/.test(raw)) return fallback;

  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}

export function getPagination(searchParams, { defaultPage = 1, defaultLimit = 20, maxLimit = 50 } = {}) {
  const requestedPage = parsePositiveInteger(searchParams.get('page'), defaultPage);
  const limit = parsePositiveInteger(searchParams.get('limit'), defaultLimit, maxLimit);

  // Keep Prisma's skip offset within Number.MAX_SAFE_INTEGER even when a
  // syntactically valid page number is extremely large.
  const maxPage = Math.floor(Number.MAX_SAFE_INTEGER / limit) + 1;
  const page = Math.min(requestedPage, maxPage);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function parseOptionalNumber(value, { integer = false, min = 0 } = {}) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || (integer && !Number.isInteger(parsed))) return null;
  return parsed;
}

export function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
