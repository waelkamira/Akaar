import { createHash } from 'node:crypto';

export function favoriteCacheKey(userId, page, limit) {
  const hash = createHash('md5')
    .update(`${userId}-${page}-${limit}`)
    .digest('hex');
  return `fav_${hash}`;
}
