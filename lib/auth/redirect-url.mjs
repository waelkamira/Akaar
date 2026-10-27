/**
 * Resolve a NextAuth redirect target without allowing external or prefix-lookalike
 * origins. Relative paths and absolute URLs on the configured origin are allowed.
 */
export function resolveSafeRedirectUrl(url, baseUrl) {
  if (typeof baseUrl !== 'string' || !baseUrl.trim()) return '/';

  try {
    const base = new URL(baseUrl);
    const target = new URL(typeof url === 'string' ? url : '', base);
    return target.origin === base.origin ? target.toString() : base.toString();
  } catch {
    return baseUrl;
  }
}
