import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // 1. إنشاء "ناقل" (Transporter) باستخدام Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL, // ايميلك (مثل: yourname@gmail.com)
        pass: process.env.GMAIL_APP_PASSWORD, // كلمة مرور التطبيق (ليس كلمة السر العادية!)
      },
    });

    // 2. إعداد محتوى الإيميل
    const mailOptions = {
      from: `"Contact Form" <${process.env.GMAIL_EMAIL}>`,
      to: process.env.GMAIL_EMAIL, // إرسال إلى نفسك (أو أي إيميل آخر)
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
    };

    // 3. إرسال الإيميل
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'تم إرسال الرسالة بنجاح!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'فشل إرسال الرسالة' },
      { status: 500 }
    );
  }
}
