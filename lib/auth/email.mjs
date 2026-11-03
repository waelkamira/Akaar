function getEmailConfiguration(env) {
  const baseUrl = env.APP_URL || env.NEXTAUTH_URL;
  if (!baseUrl || !env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    throw new Error('AUTH_EMAIL_NOT_CONFIGURED');
  }

  let base;
  try {
    base = new URL(baseUrl);
  } catch {
    throw new Error('AUTH_APP_URL_INVALID');
  }
  if (env.NODE_ENV === 'production' && base.protocol !== 'https:') {
    throw new Error('AUTH_APP_URL_MUST_USE_HTTPS');
  }

  return { base, apiKey: env.RESEND_API_KEY, from: env.RESEND_FROM_EMAIL };
}

export function isAuthEmailConfigured(env = process.env) {
  try {
    getEmailConfiguration(env);
    return true;
  } catch {
    return false;
  }
}

async function sendAuthLink(to, token, path, subject, instruction, {
  env = process.env,
  fetchImpl = fetch,
} = {}) {
  const { base, apiKey, from } = getEmailConfiguration(env);
  const link = new URL(path, base);
  link.searchParams.set('token', token);
  const response = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: `${instruction}\n\n${link.toString()}\n\nإذا لم تطلب هذا الإجراء، فتجاهل هذه الرسالة.`,
    }),
  });
  if (!response.ok) throw new Error(`AUTH_EMAIL_DELIVERY_FAILED_${response.status}`);
}

export function sendVerificationEmail(to, token, options) {
  return sendAuthLink(
    to,
    token,
    '/verify-email',
    'تأكيد البريد الإلكتروني في عقار',
    'لتأكيد بريدك الإلكتروني، افتح الرابط التالي:',
    options,
  );
}

export function sendPasswordResetEmail(to, token, options) {
  return sendAuthLink(
    to,
    token,
    '/reset-password',
    'إعادة تعيين كلمة المرور في عقار',
    'لإعادة تعيين كلمة المرور، افتح الرابط التالي:',
    options,
  );
}
