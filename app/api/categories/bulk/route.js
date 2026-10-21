import { NextResponse } from 'next/server';
import { mockProducts } from '../../../../lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const requestedIds = (searchParams.get('categories') || '')
    .split(',')
    .map((value) => Number.parseInt(value, 10))
    .filter(Number.isInteger);

  const categoryIds = requestedIds.length ? requestedIds : Object.keys(mockProducts).map(Number);
  const data = Object.fromEntries(
    categoryIds.map((categoryId) => [categoryId, mockProducts[categoryId] || []])
  );

  return NextResponse.json({ data, source: 'mock-database' }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
