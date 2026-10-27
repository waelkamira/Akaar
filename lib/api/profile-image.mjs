const MAX_PROFILE_IMAGE_LENGTH = 2048;

export function isValidProfileImage(value) {
  if (value === null) return true;
  if (typeof value !== 'string') return false;

  const candidate = value.trim();
  if (!candidate || candidate.length > MAX_PROFILE_IMAGE_LENGTH) return false;
  if (/[\u0000-\u001f\u007f\\]/.test(candidate)) return false;

  // Allow same-origin static paths, but reject protocol-relative external URLs.
  if (candidate.startsWith('/')) {
    return !candidate.startsWith('//');
  }

  try {
    const url = new URL(candidate);
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
