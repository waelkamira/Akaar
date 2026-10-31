const EXCLUDED_PREFIXES = [
  '/admin',
  '/api',
  '/cart',
  '/favorite',
  '/login',
  '/newsletter',
  '/orders',
  '/profile',
  '/register',
  '/seller',
];

export function normalizeAnalyticsPath(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return null;
  if (EXCLUDED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return null;

  return path
    .split('/')
    .map((segment) => {
      if (/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(segment)) return ':id';
      if (/^[A-Za-z0-9_-]{20,}$/.test(segment) || segment.includes('@')) return ':id';
      return segment;
    })
    .join('/');
}
