export function getSiteUrl() {
  const configuredUrl = process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (!configuredUrl) {
    throw new Error('APP_URL or NEXTAUTH_URL must be configured for public URLs.');
  }

  const siteUrl = new URL(configuredUrl);
  if (siteUrl.protocol !== 'http:' && siteUrl.protocol !== 'https:') {
    throw new Error('The public site URL must use HTTP or HTTPS.');
  }

  return siteUrl.origin;
}
