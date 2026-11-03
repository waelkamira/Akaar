import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSellerApplicationDetails,
  serializeSellerApplicationDetails,
} from '../lib/seller/application.mjs';

test('seller application details round-trip through verification notes', () => {
  const details = {
    contactName: 'Akaar seller',
    contactEmail: 'seller@example.com',
    phoneNumber: '+963900000000',
    residence: 'Damascus',
    sellingCategories: 'Home goods',
    intendedProducts: 'Handmade home goods from local suppliers.',
    facebookUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    latitude: 33.5,
    longitude: 36.3,
    ignored: 'not persisted',
  };

  assert.deepEqual(parseSellerApplicationDetails(serializeSellerApplicationDetails(details)), {
    contactName: details.contactName,
    contactEmail: details.contactEmail,
    phoneNumber: details.phoneNumber,
    residence: details.residence,
    sellingCategories: details.sellingCategories,
    intendedProducts: details.intendedProducts,
    facebookUrl: details.facebookUrl,
    youtubeUrl: details.youtubeUrl,
    twitterUrl: details.twitterUrl,
    latitude: details.latitude,
    longitude: details.longitude,
  });
});

test('seller application detail parser rejects unrelated and malformed reviewer notes', () => {
  assert.equal(parseSellerApplicationDetails(null), null);
  assert.equal(parseSellerApplicationDetails('Reviewer notes'), null);
  assert.equal(parseSellerApplicationDetails('seller-application:v1:{'), null);
  assert.equal(parseSellerApplicationDetails('seller-application:v1:[]'), null);
});
