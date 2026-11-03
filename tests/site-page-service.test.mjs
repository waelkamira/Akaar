import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createManagedSitePage,
  deleteManagedSitePage,
  updateManagedSitePage,
} from '../lib/site/service.mjs';

test('creates a normalized site page using validated fields', async () => {
  let received;
  const page = { slug: 'privacy-policy', title: 'Privacy', content: 'Terms' };
  const result = await createManagedSitePage({
    slug: ' privacy-policy ',
    title: ' Privacy ',
    content: ' Terms ',
    ignored: true,
  }, {
    async create(input) {
      received = input;
      return page;
    },
  });

  assert.deepEqual(result, { status: 'created', page });
  assert.deepEqual(received, { slug: 'privacy-policy', title: 'Privacy', content: 'Terms' });
});

test('rejects invalid create fields without calling persistence', async () => {
  let called = false;
  const result = await createManagedSitePage({
    slug: 'Not a valid slug',
    title: 'Title',
    content: 'Content',
  }, {
    async create() {
      called = true;
    },
  });

  assert.deepEqual(result, { status: 'invalid' });
  assert.equal(called, false);
});

test('maps duplicate slugs to a conflict and propagates other persistence errors', async () => {
  assert.deepEqual(await createManagedSitePage({
    slug: 'privacy',
    title: 'Privacy',
    content: 'Terms',
  }, {
    async create() {
      throw Object.assign(new Error('duplicate'), { code: 'P2002' });
    },
  }), { status: 'conflict' });

  const failure = new Error('database unavailable');
  await assert.rejects(createManagedSitePage({
    slug: 'privacy',
    title: 'Privacy',
    content: 'Terms',
  }, {
    async create() {
      throw failure;
    },
  }), failure);
});

test('validates update input before persistence and handles missing rows', async () => {
  let received;
  const updatedPage = { slug: 'privacy', title: 'Updated', content: 'Updated terms' };
  const result = await updateManagedSitePage('privacy', {
    title: ' Updated ',
    content: ' Updated terms ',
  }, {
    async update(slug, input) {
      received = { slug, ...input };
      return updatedPage;
    },
  });

  assert.deepEqual(result, { status: 'updated', page: updatedPage });
  assert.deepEqual(received, { slug: 'privacy', title: 'Updated', content: 'Updated terms' });
  assert.deepEqual(await updateManagedSitePage('privacy', {}, {
    async update() {
      throw new Error('must not persist invalid data');
    },
  }), { status: 'invalid-fields' });
  assert.deepEqual(await updateManagedSitePage('privacy', {
    title: 'Valid',
    content: 'Valid',
  }, {
    async update() {
      throw Object.assign(new Error('not found'), { code: 'P2025' });
    },
  }), { status: 'not-found' });
});

test('validates delete slugs and distinguishes missing pages', async () => {
  let called = false;
  assert.deepEqual(await deleteManagedSitePage('../private', {
    async delete() {
      called = true;
      return true;
    },
  }), { status: 'invalid-slug' });
  assert.equal(called, false);

  assert.deepEqual(await deleteManagedSitePage('privacy', {
    async delete() {
      return false;
    },
  }), { status: 'not-found' });
  assert.deepEqual(await deleteManagedSitePage('privacy', {
    async delete() {
      return true;
    },
  }), { status: 'deleted' });
});
