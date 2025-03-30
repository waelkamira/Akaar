// Mock data for search filters

import cities from '../components/lists/Cities';
import categories from '../components/Categories/categories';
export const filterOptions = {
  categories: categories,
  static: {
    cities: cities,
  },
  dynamic: {},
};

// Helper function to get label from ID
export function getLabelFromId(categoryId, fieldName, valueId) {
  if (!categoryId || !fieldName || !valueId) return '';

  const category = filterOptions.dynamic[categoryId];
  if (!category) return '';

  const field = category[fieldName];
  if (!field || !Array.isArray(field)) return '';

  const option = field.find((opt) => opt.id === valueId);
  return option ? option.name : '';
}

// Helper function to get static field label
export function getStaticFieldLabel(fieldName, valueId) {
  if (!fieldName || !valueId) return '';

  const field = filterOptions.static[fieldName];
  if (!field || !Array.isArray(field)) return '';

  const option = field.find((opt) => opt.id === valueId);
  return option ? option.name : '';
}
