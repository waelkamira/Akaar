import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    const { data, error } = await resend.emails.send({
      from: `Contact Form <${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}>`,
      to: [process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL], // أرسل إلى نفسك أو أي بريد آخر
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
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    );
  }
}
