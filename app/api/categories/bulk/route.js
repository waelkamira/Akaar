import { NextResponse } from 'next/server';
import { mockProducts } from '../../../../lib/mockData';

export const revalidate = 3600;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const requestedIds = (searchParams.get('categories') || '')
    .split(',')
    .map((value) => Number.parseInt(value, 10))
    .filter(Number.isInteger);

  const categoryIds = requestedIds.length ? requestedIds : Object.keys(mockProducts).map(Number);
  const counts = {};
  const data = Object.fromEntries(
    categoryIds.map((categoryId) => {
      const products = mockProducts[categoryId] || [];
      counts[categoryId] = products.length;
      return [
        categoryId,
        products.slice(0, 2).map((product) => {
          const preview = { ...product };
          delete preview.category;
          return preview;
        }),
      ];
    }),
  );

  return NextResponse.json(
    { data, counts, source: 'mock-database' },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    },
  );
}
