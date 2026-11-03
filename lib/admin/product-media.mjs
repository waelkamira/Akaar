export async function replaceProductMedia(database, productId, images) {
  await database.productMedia.deleteMany({ where: { productId } });
  if (!images.length) return;

  await database.productMedia.createMany({
    data: images.map((storageKey, sortOrder) => ({
      productId,
      storageKey,
      mediaType: 'IMAGE',
      sortOrder,
      isPrimary: sortOrder === 0,
    })),
  });
}
