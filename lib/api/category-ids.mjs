import { parsePositiveInteger } from './validation.mjs';

export function parseCategoryIds(value, maxCategories = 24) {
  return [...new Set(
    String(value || '')
      .split(',')
      .slice(0, maxCategories * 4)
      .map((item) => parsePositiveInteger(item, null))
      .filter((id) => id !== null),
  )].slice(0, maxCategories);
}
