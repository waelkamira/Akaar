export async function sendNewsletterConfirmation(to, confirmationToken, unsubscribeToken) {
  const baseUrl = process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (!baseUrl || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    throw new Error('NEWSLETTER_EMAIL_NOT_CONFIGURED');
  }
  const base = new URL(baseUrl);
  if (base.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
    throw new Error('NEWSLETTER_APP_URL_MUST_USE_HTTPS');
  }
  const confirmUrl = new URL(`/newsletter/confirm?token=${encodeURIComponent(confirmationToken)}`, base).toString();
  const unsubscribeUrl = new URL(`/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`, base).toString();
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject: 'تأكيد الاشتراك في أخبار عقار',
      text: `لتأكيد اشتراكك، افتح الرابط:\n${confirmUrl}\n\nلإلغاء الاشتراك في أي وقت:\n${unsubscribeUrl}`,
    }),
  });
  if (!response.ok) throw new Error(`RESEND_DELIVERY_FAILED_${response.status}`);
}
