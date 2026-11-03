const applicationPrefix = 'seller-application:v1:';

const applicationFields = [
  'contactName',
  'contactEmail',
  'phoneNumber',
  'residence',
  'sellingCategories',
  'intendedProducts',
  'facebookUrl',
  'youtubeUrl',
  'twitterUrl',
  'latitude',
  'longitude',
];

export function serializeSellerApplicationDetails(details) {
  const application = Object.fromEntries(
    applicationFields
      .filter((field) => Object.hasOwn(details, field))
      .map((field) => [field, details[field]]),
  );
  return `${applicationPrefix}${JSON.stringify(application)}`;
}

export function parseSellerApplicationDetails(notes) {
  if (typeof notes !== 'string' || !notes.startsWith(applicationPrefix)) return null;

  try {
    const application = JSON.parse(notes.slice(applicationPrefix.length));
    if (!application || typeof application !== 'object' || Array.isArray(application)) return null;
    return Object.fromEntries(
      applicationFields
        .filter((field) => Object.hasOwn(application, field))
        .map((field) => [field, application[field]]),
    );
  } catch {
    return null;
  }
}
