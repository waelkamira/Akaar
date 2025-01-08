import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // الحصول على قيم الصفحة والحد الأقصى
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const skip = (page - 1) * limit;
  // console.log('properties');
  try {
    // قراءة البيانات من جدول Property
    const properties = await prisma.property.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    console.log('properties', properties);

    return new Response(JSON.stringify(properties), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    // console.log('data', data);

    // إذا كان `link` فارغًا، اجعل قيمته `null` بدلاً من "" أو غيّر هذا وفقًا لاحتياجاتك
    const linkValue = data.link === '' ? null : data.link;

    // إنشاء سجل جديد باستخدام Prisma
    const newProperty = await prisma.property.create({
      data: {
        id: data.id,
        image: data.image,
        image1: data.image1,
        image2: data.image2,
        image3: data.image3,
        image4: data.image4,
        propertyName: data.propertyName,
        propertyType: data.propertyType,
        propertyPrice: data.propertyPrice,
        propertyArea: data.propertyArea,
        propertyCity: data.propertyCity,
        contactPhoneNumber: data.contactPhoneNumber,
        description: data.description,
        link: linkValue, // التعامل مع الحقل `link` بشكل صحيح
        hearts: data.hearts,
        userName: data.userName,
        userImage: data.userImage,
        createdBy: data.createdBy,
        createdAt: data.createdAt, // إرسال القيمة كـ نص
        updatedAt: data.updatedAt, // إرسال القيمة كـ نص
      },
    });

    return new Response(
      JSON.stringify({
        message: 'Property created successfully',
        id: newProperty.id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating property:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const data = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Property ID is required' }),
        { status: 400 }
      );
    }

    // تحديث البيانات باستخدام Prisma
    await prisma.property.update({
      where: { id: id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return new Response(
      JSON.stringify({ message: 'Property updated successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating property:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Property ID is required' }),
        { status: 400 }
      );
    }

    // حذف السجل باستخدام Prisma
    await prisma.property.delete({
      where: { id: id },
    });

    return new Response(
      JSON.stringify({ message: 'Property deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting property:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
