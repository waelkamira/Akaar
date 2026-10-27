export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

export function validateImageFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    return 'ملف الصورة مطلوب.';
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WebP أو AVIF.';
  }
  if (!Number.isInteger(file.size) || file.size < 1 || file.size > MAX_IMAGE_SIZE) {
    return 'يجب ألا يتجاوز حجم الصورة 10 ميغابايت.';
  }
  return null;
}

export function safeImageFileName(name) {
  const base = typeof name === 'string' ? name.split(/[\\/]/).pop() : '';
  const safe = (base || 'image').replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 100);
  return safe || 'image';
}
