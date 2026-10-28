import { z } from 'zod';

const imageUrlSchema = z.string().trim().min(1).max(2048).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}, 'Each image must be an HTTP or HTTPS URL.');

const attributesSchema = z.record(
  z.string().trim().min(1).max(80),
  z.union([z.string().max(200), z.number().finite(), z.boolean()]),
).default({});

export const propertyInputSchema = z.object({
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().max(12_000).nullable().optional(),
  price: z.string()
    .regex(/^\d{1,14}(?:\.\d{1,2})?$/)
    .refine((value) => Number(value) > 0, 'Price must be greater than zero.'),
  currency: z.string().trim().regex(/^[A-Za-z]{3}$/).transform((value) => value.toUpperCase()).default('USD'),
  location: z.string().trim().min(2).max(240),
  country: z.string().trim().max(100).nullable().optional(),
  city: z.string().trim().max(120).nullable().optional(),
  images: z.array(imageUrlSchema).max(20).default([]),
  status: z.enum(['AVAILABLE', 'SOLD', 'RENTED']).default('AVAILABLE'),
  type: z.enum(['APARTMENT', 'VILLA', 'LAND']).default('APARTMENT'),
  attributes: attributesSchema,
  isPublished: z.boolean().default(true),
});

export const propertyPatchSchema = propertyInputSchema.partial();

export const propertySearchSchema = z.object({
  q: z.string().trim().max(120).default(''),
  minPrice: z.string().regex(/^\d{1,14}(?:\.\d{1,2})?$/).optional(),
  maxPrice: z.string().regex(/^\d{1,14}(?:\.\d{1,2})?$/).optional(),
  type: z.enum(['APARTMENT', 'VILLA', 'LAND']).optional(),
  status: z.enum(['AVAILABLE', 'SOLD', 'RENTED']).default('AVAILABLE'),
  country: z.string().trim().min(1).max(100).optional(),
  city: z.string().trim().min(1).max(120).optional(),
  location: z.string().trim().min(1).max(120).optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
}).refine(
  (filters) => filters.minPrice === undefined || filters.maxPrice === undefined
    || Number(filters.minPrice) <= Number(filters.maxPrice),
  { message: 'minPrice must not exceed maxPrice.', path: ['minPrice'] },
);

export type PropertyInput = z.infer<typeof propertyInputSchema>;
export type PropertyPatch = z.infer<typeof propertyPatchSchema>;
