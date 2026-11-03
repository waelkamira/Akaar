import test from 'node:test';
import assert from 'node:assert/strict';
import { recordDailyPageView } from '../lib/analytics/service.mjs';

test('records page views against the UTC calendar day', async () => {
  const input = new Date('2026-11-02T23:59:59.999-05:00');
  let received;
  const repository = {
    async incrementDailyVisit(value) {
      received = value;
      return true;
    },
  };

  const recorded = await recordDailyPageView('/pages/terms', repository, input);

  assert.equal(recorded, true);
  assert.equal(received.path, '/pages/terms');
  assert.equal(received.day.toISOString(), '2026-11-03T00:00:00.000Z');
  assert.notEqual(received.day, input);
});

test('preserves the repository result when analytics storage is unavailable', async () => {
  const recorded = await recordDailyPageView('/pages/terms', {
    async incrementDailyVisit() {
      return false;
    },
  }, new Date('2026-11-02T12:00:00.000Z'));

  assert.equal(recorded, false);
});

test('propagates repository failures to the route boundary', async () => {
  const failure = new Error('database unavailable');

  await assert.rejects(
    recordDailyPageView('/pages/terms', {
      async incrementDailyVisit() {
        throw failure;
      },
    }),
    failure,
  );
});
