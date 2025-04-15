import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Ensure the API key is properly loaded
if (!process.env.RESEND_API_KEY) {
  console.error(
    'Resend API key is missing. Please check your environment variables.'
  );
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // التحقق من صحة البيانات المدخلة
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: `Contact Form <${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}>`,
      to: [process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL],
      subject: 'رسالة جديدة من نموذج الاتصال',
      html: `
        <div dir="rtl">
          <h2>تفاصيل الرسالة</h2>
          <p><strong>الاسم:</strong> ${name}</p>
          <p><strong>البريد الإلكتروني:</strong> ${email}</p>
          <p><strong>الرسالة:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: 'فشل إرسال البريد الإلكتروني' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    );
  }
}
