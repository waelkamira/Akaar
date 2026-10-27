const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const MAX_BCRYPT_PASSWORD_BYTES = 72;

export function validateRegistrationInput(input) {
  const name = typeof input?.name === 'string' ? input.name.trim() : '';
  const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
  const password = typeof input?.password === 'string' ? input.password : '';

  if (name.length < 2 || name.length > 100) {
    return { ok: false, error: 'الاسم يجب أن يتراوح بين حرفين و100 حرف.' };
  }
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: 'عنوان البريد الإلكتروني غير صالح.' };
  }

  const passwordBytes = new TextEncoder().encode(password).length;
  if (passwordBytes < 8 || passwordBytes > MAX_BCRYPT_PASSWORD_BYTES) {
    return {
      ok: false,
      error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل وألا تتجاوز 72 بايتًا.',
    };
  }

  return { ok: true, name, email, password };
}
