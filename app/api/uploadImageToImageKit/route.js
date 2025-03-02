import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: 'public_iR0emSJjiHQ8w4WIgDcj3rQWvOc=', // استبدل بمفتاحك العام
  privateKey: 'private_8RLAAB7McKkVnh8x49iu038GtBs=', // استبدل بمفتاحك الخاص
  urlEndpoint: 'https://ik.imagekit.io/srrt5l32w', // استبدل بمسار ImageKit الخاص بك
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // تحويل الملف إلى Buffer
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // رفع الملف إلى ImageKit
    const response = await imagekit.upload({
      file: buffer, // الملف كـ Buffer
      fileName: file.name, // اسم الملف
    });

    console.log('ImageKit Response:', response);

    return NextResponse.json({
      success: true,
      data: {
        url: response.url, // رابط الصورة المرفوعة
      },
    });
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to upload image',
      },
      { status: 500 }
    );
  }
}
