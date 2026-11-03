const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSitePageSlug(slug) {
  return typeof slug === 'string' && slug.length <= 64 && slugPattern.test(slug);
}

export function parseSitePageFields(input, includeSlug = false) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;

  const slug = typeof input.slug === 'string' ? input.slug.trim() : '';
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const content = typeof input.content === 'string' ? input.content.trim() : '';
  if ((includeSlug && !isValidSitePageSlug(slug)) ||
    !title || title.length > 160 || !content || content.length > 20_000) {
    return null;
  }

  return includeSlug ? { slug, title, content } : { title, content };
}
