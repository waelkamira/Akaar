const MAX_IMAGE_URL_LENGTH = 2048;
const MAX_PRODUCT_LINK_LENGTH = 2000;

function isBoundedString(value, maxLength) {
  return typeof value === 'string' &&
    value.length > 0 &&
    value.length <= maxLength &&
    !/[\u0000-\u001f\u007f\\]/.test(value) &&
    value === value.trim();
}

function parseHttpUrl(value) {
  try {
    const url = new URL(value);
    if (
      (url.protocol !== 'https:' && url.protocol !== 'http:') ||
      !url.hostname ||
      url.username ||
      url.password
    ) return null;
    return url;
  } catch {
    return null;
  }
}

export function isValidProductImageUrl(value) {
  if (!isBoundedString(value, MAX_IMAGE_URL_LENGTH)) return false;

  if (value.startsWith('/')) {
    return !value.startsWith('//');
  }

  return Boolean(parseHttpUrl(value));
}

export function areValidProductImageUrls(images) {
  return Array.isArray(images) &&
    images.length <= 20 &&
    images.every(isValidProductImageUrl);
}

export function isValidProductLink(value) {
  if (value === null || value === '') return true;
  if (!isBoundedString(value, MAX_PRODUCT_LINK_LENGTH)) return false;
  return Boolean(parseHttpUrl(value));
}
