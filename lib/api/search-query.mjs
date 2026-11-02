import { sanitizeDetailsFilters, sanitizeSearchText } from './search-filters.mjs';

const CATEGORY_SEARCH_TERM_IDS = {
  car: 2,
  cars: 2,
  automobile: 2,
  automobiles: 2,
  vehicle: 2,
  vehicles: 2,
};
// Always end each sort with a unique key so paginated results do not drift
// when multiple products share the same price, sales count, or creation time.
export const SORT_ORDERS = {
  cheapest: [{ basePrice: { sort: 'asc', nulls: 'last' } }, { createdAt: 'desc' }, { id: 'asc' }],
  best_sellers: [{ salesCount: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }],
  newest: [{ createdAt: 'desc' }, { id: 'asc' }],
};

export function getSortOrder(sortKey) {
  return SORT_ORDERS[sortKey] || SORT_ORDERS.newest;
}

export function validPositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function getQueryTerms(query) {
  return query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
}

export function textConditions(terms, language = '') {
  return terms.map((term) => {
    const categoryId = CATEGORY_SEARCH_TERM_IDS[term.toLowerCase()];

    return {
      OR: [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { categoryName: { contains: term, mode: 'insensitive' } },
        { userName: { contains: term, mode: 'insensitive' } },
        ...(language ? [{ translations: { some: { language, title: { contains: term, mode: 'insensitive' } } } }] : []),
        ...(categoryId ? [{ categoryId }] : []),
      ],
    };
  });
}

function addDetailsFilters(where, details = {}) {
  for (const [key, value] of sanitizeDetailsFilters(details)) {
    where.AND.push({
      details: {
        path: [key],
        equals: value,
      },
    });
  }
}
export function buildWhere({ categoryId, filters }) {
  const where = {
    isDeleted: false,
    isActive: true,
    approvalStatus: 'APPROVED',
    category: { isActive: true },
    OR: [
      { sellerId: null },
      { seller: { is: { status: 'ACTIVE', isVerified: true } } },
    ],
    AND: [],
  };

  const selectedCategoryId = validPositiveInteger(
    categoryId ?? filters.categoryId,
    null,
  );
  if (selectedCategoryId) {
    where.AND.push({ categoryId: selectedCategoryId });
  }

  const categoryName = sanitizeSearchText(filters.categoryName);
  if (categoryName) {
    where.AND.push({
      categoryName: { equals: categoryName, mode: 'insensitive' },
    });
  }

  const price = {};
  const min = filters.priceMin === '' ? null : Number(filters.priceMin);
  const max = filters.priceMax === '' ? null : Number(filters.priceMax);
  if (Number.isFinite(min) && min >= 0) price.gte = Math.floor(min);
  if (Number.isFinite(max) && max >= 0) price.lte = Math.floor(max);
  if (Object.keys(price).length) where.AND.push({ basePrice: price });

  const city = sanitizeSearchText(filters.city);
  const town = sanitizeSearchText(filters.town);
  const adType = sanitizeSearchText(filters.adType);
  const vendorId = sanitizeSearchText(filters.vendorId);
  if (city) where.AND.push({ city });
  if (town) where.AND.push({ town });
  if (adType) where.AND.push({ adCategory: adType });
  if (vendorId) where.AND.push({ userId: vendorId });

  if (filters.brand) {
    const brand = sanitizeSearchText(filters.brand);
    if (brand) {
      where.AND.push({
        OR: [
          { details: { path: ['brand'], string_contains: brand } },
          { details: { path: ['Brand'], string_contains: brand } },
        ],
      });
    }
  }

  if (filters.subCategory) {
    const subCategory = sanitizeSearchText(filters.subCategory);
    if (subCategory) {
      where.AND.push({
        OR: [
          { details: { path: ['subCategory'], string_contains: subCategory } },
          { details: { path: ['subcategory'], string_contains: subCategory } },
        ],
      });
    }
  }

  addDetailsFilters(where, filters.details);

  if (!where.AND.length) delete where.AND;
  return where;
}
