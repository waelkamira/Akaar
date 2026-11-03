import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getControlPanelAdmin } from '@/lib/auth/require-auth';
import { isPlainObject } from '@/lib/api/validation.mjs';
import { readJsonBody } from '@/lib/api/read-json-body.mjs';
import { prisma } from '@/lib/db/prisma';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const codePattern = /^[A-Z0-9_-]{2,40}$/;

function readName(value: unknown, maxLength = 100) {
  if (typeof value !== 'string') return null;
  const name = value.trim();
  return name && name.length <= maxLength ? name : null;
}

function readCode(value: unknown) {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  return codePattern.test(code) ? code : null;
}

function readCountries(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 250) return null;
  const countries = value.map((country) => typeof country === 'string' ? country.trim().toUpperCase() : '');
  if (countries.some((country) => !/^[A-Z]{2}$/.test(country))) return null;
  return [...new Set(countries)];
}

function readCost(value: unknown) {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 && amount <= 1_000_000_000 ? amount : null;
}

function errorResponse(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return NextResponse.json({ error: 'يوجد سجل آخر يستخدم الرمز نفسه.' }, { status: 409 });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    return NextResponse.json({ error: 'السجل المطلوب غير موجود.' }, { status: 404 });
  }
  console.error('Unable to manage shipping configuration:', error);
  return NextResponse.json({ error: 'تعذر حفظ إعدادات الشحن.' }, { status: 500 });
}

export async function GET() {
  const admin = await getControlPanelAdmin('control_panel.shipping.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الشحن مطلوبة.' }, { status: 403 });

  try {
    const [carriers, zones, countries, currencies] = await Promise.all([
      prisma.shippingCarrier.findMany({
        orderBy: { name: 'asc' },
        include: { services: { orderBy: { name: 'asc' } } },
      }),
      prisma.shippingZone.findMany({
        orderBy: { name: 'asc' },
        include: { rates: { orderBy: [{ currency: 'asc' }, { serviceCode: 'asc' }] } },
      }),
      prisma.country.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: { code: true, name: true },
      }),
      prisma.currency.findMany({
        where: { isActive: true },
        orderBy: { code: 'asc' },
        select: { code: true, name: true },
      }),
    ]);
    return NextResponse.json({ carriers, zones, countries, currencies });
  } catch (error) {
    console.error('Unable to load shipping configuration:', error);
    return NextResponse.json({ error: 'تعذر تحميل إعدادات الشحن.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.shipping.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الشحن مطلوبة.' }, { status: 403 });
  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value)) {
    return NextResponse.json({ error: 'بيانات إعداد الشحن غير صالحة.' }, { status: 400 });
  }

  const body = parsed.value;
  try {
    if (body.type === 'carrier') {
      const name = readName(body.name);
      const code = readCode(body.code);
      let website: string | null = null;
      if (body.website !== undefined && body.website !== '') {
        if (typeof body.website !== 'string') return NextResponse.json({ error: 'رابط شركة الشحن غير صالح.' }, { status: 400 });
        try {
          const parsedUrl = new URL(body.website);
          if (parsedUrl.protocol !== 'https:') throw new Error('HTTPS_REQUIRED');
          website = parsedUrl.toString();
        } catch {
          return NextResponse.json({ error: 'استخدم رابط HTTPS صحيحًا لشركة الشحن.' }, { status: 400 });
        }
      }
      if (!name || !code) return NextResponse.json({ error: 'اسم ورمز شركة الشحن مطلوبان.' }, { status: 400 });
      const carrier = await prisma.shippingCarrier.create({ data: { name, code, website } });
      return NextResponse.json({ carrier }, { status: 201 });
    }

    if (body.type === 'service') {
      const carrierId = body.carrierId;
      const name = readName(body.name);
      const code = readCode(body.code);
      if (typeof carrierId !== 'string' || !uuidPattern.test(carrierId) || !name || !code) {
        return NextResponse.json({ error: 'شركة الشحن واسم الخدمة ورمزها مطلوبة.' }, { status: 400 });
      }
      const carrier = await prisma.shippingCarrier.findFirst({ where: { id: carrierId, isActive: true }, select: { id: true } });
      if (!carrier) return NextResponse.json({ error: 'شركة الشحن غير مفعّلة.' }, { status: 400 });
      const duplicateCode = await prisma.shippingService.findFirst({ where: { code, isActive: true }, select: { id: true } });
      if (duplicateCode) return NextResponse.json({ error: 'رمز الخدمة مستخدم لدى ناقل آخر؛ يجب أن يكون فريدًا لإعداد الأسعار.' }, { status: 409 });
      const service = await prisma.shippingService.create({ data: { carrierId, name, code } });
      return NextResponse.json({ service }, { status: 201 });
    }

    if (body.type === 'zone') {
      const name = readName(body.name);
      const countries = readCountries(body.countries);
      if (!name || !countries) return NextResponse.json({ error: 'اسم المنطقة وبلد واحد على الأقل مطلوبان.' }, { status: 400 });
      const activeCountries = await prisma.country.findMany({
        where: { code: { in: countries }, isActive: true },
        select: { code: true },
      });
      if (activeCountries.length !== countries.length) {
        return NextResponse.json({ error: 'تتضمن المنطقة بلدًا غير مفعّل.' }, { status: 400 });
      }
      const overlappingZone = await prisma.shippingZone.findFirst({
        where: { isActive: true, countries: { hasSome: countries } },
        select: { name: true },
      });
      if (overlappingZone) {
        return NextResponse.json({ error: `تتداخل البلدان مع منطقة الشحن «${overlappingZone.name}».` }, { status: 409 });
      }
      const zone = await prisma.shippingZone.create({ data: { name, countries } });
      return NextResponse.json({ zone }, { status: 201 });
    }

    if (body.type === 'rate') {
      const zoneId = body.zoneId;
      const serviceCode = readCode(body.serviceCode);
      const currency = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : '';
      const baseCost = readCost(body.baseCost);
      const perKgCost = readCost(body.perKgCost);
      if (typeof zoneId !== 'string' || !uuidPattern.test(zoneId)
        || !serviceCode
        || !/^[A-Z]{3}$/.test(currency)
        || baseCost === null
        || perKgCost === null) {
        return NextResponse.json({ error: 'المنطقة والخدمة والعملة وتكاليف الشحن مطلوبة.' }, { status: 400 });
      }
      const [zone, service, currencyRecord, existingRate] = await Promise.all([
        prisma.shippingZone.findFirst({ where: { id: zoneId, isActive: true }, select: { id: true } }),
        prisma.shippingService.findFirst({
          where: { code: serviceCode, isActive: true, carrier: { isActive: true } },
          select: { id: true },
        }),
        prisma.currency.findFirst({ where: { code: currency, isActive: true }, select: { code: true } }),
        prisma.shippingRate.findFirst({ where: { zoneId, serviceCode, currency }, select: { id: true } }),
      ]);
      if (!zone || !service || !currencyRecord) {
        return NextResponse.json({ error: 'المنطقة أو الخدمة أو العملة غير مفعّلة.' }, { status: 400 });
      }
      if (existingRate) return NextResponse.json({ error: 'يوجد سعر مسجل لهذه الخدمة والعملة في المنطقة.' }, { status: 409 });
      const rate = await prisma.shippingRate.create({
        data: { zoneId, serviceCode, currency, baseCost: new Prisma.Decimal(baseCost), perKgCost: new Prisma.Decimal(perKgCost) },
      });
      return NextResponse.json({ rate }, { status: 201 });
    }

    return NextResponse.json({ error: 'نوع إعداد الشحن غير معروف.' }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  const admin = await getControlPanelAdmin('control_panel.shipping.manage');
  if (!admin) return NextResponse.json({ error: 'صلاحية إدارة الشحن مطلوبة.' }, { status: 403 });
  const parsed = await readJsonBody(request, 32 * 1024);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  if (!isPlainObject(parsed.value) || typeof parsed.value.id !== 'string' || !uuidPattern.test(parsed.value.id)) {
    return NextResponse.json({ error: 'معرف إعداد الشحن غير صالح.' }, { status: 400 });
  }

  const { type, id } = parsed.value;
  const data = parsed.value;
  try {
    if (type === 'carrier') {
      const update: { name?: string; isActive?: boolean; website?: string | null } = {};
      if (data.name !== undefined) {
        const name = readName(data.name);
        if (!name) return NextResponse.json({ error: 'اسم شركة الشحن غير صالح.' }, { status: 400 });
        update.name = name;
      }
      if (typeof data.isActive === 'boolean') update.isActive = data.isActive;
      if (data.website !== undefined) {
        if (data.website === null || data.website === '') update.website = null;
        else if (typeof data.website === 'string') {
          try {
            const website = new URL(data.website);
            if (website.protocol !== 'https:') throw new Error('HTTPS_REQUIRED');
            update.website = website.toString();
          } catch {
            return NextResponse.json({ error: 'استخدم رابط HTTPS صحيحًا لشركة الشحن.' }, { status: 400 });
          }
        } else return NextResponse.json({ error: 'رابط شركة الشحن غير صالح.' }, { status: 400 });
      }
      if (!Object.keys(update).length) return NextResponse.json({ error: 'لا توجد تغييرات صالحة.' }, { status: 400 });
      return NextResponse.json({ carrier: await prisma.shippingCarrier.update({ where: { id }, data: update }) });
    }

    if (type === 'service') {
      const update: { name?: string; code?: string; isActive?: boolean } = {};
      if (data.name !== undefined) {
        const name = readName(data.name);
        if (!name) return NextResponse.json({ error: 'اسم خدمة الشحن غير صالح.' }, { status: 400 });
        update.name = name;
      }
      if (data.code !== undefined) {
        const code = readCode(data.code);
        if (!code) return NextResponse.json({ error: 'رمز خدمة الشحن غير صالح.' }, { status: 400 });
        const duplicate = await prisma.shippingService.findFirst({ where: { id: { not: id }, code, isActive: true }, select: { id: true } });
        if (duplicate) return NextResponse.json({ error: 'رمز الخدمة مستخدم لدى ناقل آخر.' }, { status: 409 });
        update.code = code;
      }
      if (typeof data.isActive === 'boolean') update.isActive = data.isActive;
      if (!Object.keys(update).length) return NextResponse.json({ error: 'لا توجد تغييرات صالحة.' }, { status: 400 });
      return NextResponse.json({ service: await prisma.shippingService.update({ where: { id }, data: update }) });
    }

    if (type === 'zone') {
      const update: { name?: string; countries?: string[]; isActive?: boolean } = {};
      if (data.name !== undefined) {
        const name = readName(data.name);
        if (!name) return NextResponse.json({ error: 'اسم المنطقة غير صالح.' }, { status: 400 });
        update.name = name;
      }
      if (data.countries !== undefined) {
        const countries = readCountries(data.countries);
        if (!countries) return NextResponse.json({ error: 'قائمة بلدان المنطقة غير صالحة.' }, { status: 400 });
        const [activeCountries, overlaps] = await Promise.all([
          prisma.country.findMany({ where: { code: { in: countries }, isActive: true }, select: { code: true } }),
          prisma.shippingZone.findFirst({
            where: { id: { not: id }, isActive: true, countries: { hasSome: countries } },
            select: { name: true },
          }),
        ]);
        if (activeCountries.length !== countries.length) return NextResponse.json({ error: 'تتضمن المنطقة بلدًا غير مفعّل.' }, { status: 400 });
        if (overlaps) return NextResponse.json({ error: `تتداخل البلدان مع منطقة الشحن «${overlaps.name}».` }, { status: 409 });
        update.countries = countries;
      }
      if (typeof data.isActive === 'boolean') update.isActive = data.isActive;
      if (!Object.keys(update).length) return NextResponse.json({ error: 'لا توجد تغييرات صالحة.' }, { status: 400 });
      return NextResponse.json({ zone: await prisma.shippingZone.update({ where: { id }, data: update }) });
    }

    if (type === 'rate') {
      const update: { serviceCode?: string; currency?: string; baseCost?: Prisma.Decimal; perKgCost?: Prisma.Decimal } = {};
      if (data.serviceCode !== undefined) {
        const serviceCode = readCode(data.serviceCode);
        if (!serviceCode) return NextResponse.json({ error: 'رمز خدمة الشحن غير صالح.' }, { status: 400 });
        const service = await prisma.shippingService.findFirst({
          where: { code: serviceCode, isActive: true, carrier: { isActive: true } },
          select: { id: true },
        });
        if (!service) return NextResponse.json({ error: 'خدمة الشحن غير مفعّلة.' }, { status: 400 });
        update.serviceCode = serviceCode;
      }
      if (data.currency !== undefined) {
        const currency = typeof data.currency === 'string' ? data.currency.trim().toUpperCase() : '';
        const activeCurrency = /^[A-Z]{3}$/.test(currency)
          ? await prisma.currency.findFirst({ where: { code: currency, isActive: true }, select: { code: true } })
          : null;
        if (!activeCurrency) return NextResponse.json({ error: 'العملة غير مفعّلة.' }, { status: 400 });
        update.currency = currency;
      }
      if (data.baseCost !== undefined) {
        const cost = readCost(data.baseCost);
        if (cost === null) return NextResponse.json({ error: 'تكلفة الشحن الأساسية غير صالحة.' }, { status: 400 });
        update.baseCost = new Prisma.Decimal(cost);
      }
      if (data.perKgCost !== undefined) {
        const cost = readCost(data.perKgCost);
        if (cost === null) return NextResponse.json({ error: 'تكلفة الكيلوغرام غير صالحة.' }, { status: 400 });
        update.perKgCost = new Prisma.Decimal(cost);
      }
      if (!Object.keys(update).length) return NextResponse.json({ error: 'لا توجد تغييرات صالحة.' }, { status: 400 });
      const current = await prisma.shippingRate.findUnique({ where: { id }, select: { zoneId: true, serviceCode: true, currency: true } });
      if (!current) return NextResponse.json({ error: 'سعر الشحن غير موجود.' }, { status: 404 });
      const duplicate = await prisma.shippingRate.findFirst({
        where: {
          id: { not: id },
          zoneId: current.zoneId,
          serviceCode: update.serviceCode || current.serviceCode,
          currency: update.currency || current.currency,
        },
        select: { id: true },
      });
      if (duplicate) return NextResponse.json({ error: 'يوجد سعر آخر للخدمة والعملة في المنطقة.' }, { status: 409 });
      return NextResponse.json({ rate: await prisma.shippingRate.update({ where: { id }, data: update }) });
    }

    return NextResponse.json({ error: 'نوع إعداد الشحن غير معروف.' }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}
