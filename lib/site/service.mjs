import { isValidSitePageSlug, parseSitePageFields } from './validation.mjs';

function hasPrismaCode(error, code) {
  return error !== null && typeof error === 'object' && 'code' in error && error.code === code;
}

export async function createManagedSitePage(input, repository) {
  const fields = parseSitePageFields(input, true);
  if (!fields) return { status: 'invalid' };

  try {
    const page = await repository.create(fields);
    return { status: 'created', page };
  } catch (error) {
    if (hasPrismaCode(error, 'P2002')) return { status: 'conflict' };
    throw error;
  }
}

export async function updateManagedSitePage(slug, input, repository) {
  if (!isValidSitePageSlug(slug)) return { status: 'invalid-slug' };
  const fields = parseSitePageFields(input);
  if (!fields) return { status: 'invalid-fields' };

  try {
    const page = await repository.update(slug, fields);
    return { status: 'updated', page };
  } catch (error) {
    if (hasPrismaCode(error, 'P2025')) return { status: 'not-found' };
    throw error;
  }
}

export async function deleteManagedSitePage(slug, repository) {
  if (!isValidSitePageSlug(slug)) return { status: 'invalid-slug' };
  const deleted = await repository.delete(slug);
  return deleted ? { status: 'deleted' } : { status: 'not-found' };
}
