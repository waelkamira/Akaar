import { NextResponse } from 'next/server';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');

  // تحويل الملف إلى base64
  const fileBuffer = await file.arrayBuffer();
  const base64Data = Buffer.from(fileBuffer).toString('base64');

  // قائمة بمفاتيح API
  const apiKeys = [
    'da24d4c458bfdae096a47631e434b201',
    '84d9893912fd8483ea763dbdaacdc33a',
    '08174be48a091e751b2cee714b874741',
    'f90d1e6a4f7b34a93893edcf79d195be',
    '5b75f72ccda48f1907c5f12bf023b5c9',
    'e12130387be0e6f313bd4e6437c0dc8f',
  ];

  let result = null;

  // تجربة كل مفتاح API بالتناوب
  for (const key of apiKeys) {
    try {
      const imgbbFormData = new FormData();
      imgbbFormData.append('key', key); // استخدام المفتاح الحالي
      imgbbFormData.append('image', base64Data);

      const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: imgbbFormData,
      });

      const data = await imgbbResponse.json();

      if (imgbbResponse.ok) {
        result = { success: true, data: data.data };
        break; // إيقاف المحاولات عند النجاح
      } else {
        console.error(`فشل الرفع باستخدام المفتاح ${key}:`, data.error.message);
      }
    } catch (error) {
      console.error(
        `حدث خطأ أثناء الرفع باستخدام المفتاح ${key}:`,
        error.message
      );
    }
  }

  if (result) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(
      { success: false, error: 'تعذر رفع الصورة باستخدام أي من المفاتيح.' },
      { status: 500 }
    );
  }
}
