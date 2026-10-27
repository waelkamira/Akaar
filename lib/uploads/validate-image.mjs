// Keep the file plus multipart overhead below Vercel Functions' 4.5 MiB request-body limit.
export const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

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
    return 'يجب ألا يتجاوز حجم الصورة 4 ميغابايت.';
  }
  return null;
}

export function safeImageFileName(name) {
  const base = typeof name === 'string' ? name.split(/[\\/]/).pop() : '';
  const safe = (base || 'image').replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 100);
  return safe || 'image';
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export async function validateImageContent(file) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    return 'ملف الصورة مطلوب.';
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const isJpeg = file.type === 'image/jpeg' &&
      bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = file.type === 'image/png' &&
      bytes.length >= PNG_SIGNATURE.length && PNG_SIGNATURE.every((byte, index) => bytes[index] === byte);
    const isWebp = file.type === 'image/webp' &&
      bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
      String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
    const isAvif = file.type === 'image/avif' &&
      bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(4, 8)) === 'ftyp' &&
      ['avif', 'avis'].includes(String.fromCharCode(...bytes.slice(8, 12)));

    if (isJpeg || isPng || isWebp || isAvif) return null;
    return 'محتوى الملف لا يطابق نوع الصورة المعلن.';
  } catch {
    return 'تعذر التحقق من محتوى الصورة.';
  }
}

export const MAX_UPLOAD_REQUEST_SIZE = MAX_IMAGE_SIZE + 256 * 1024;

export function isUploadRequestTooLarge(request) {
  const rawLength = request?.headers?.get?.('content-length');
  if (rawLength == null) return false;
  if (typeof rawLength !== 'string' || !/^\d+$/.test(rawLength)) return true;

  const length = Number(rawLength);
  return !Number.isSafeInteger(length) || length < 0 || length > MAX_UPLOAD_REQUEST_SIZE;
}
