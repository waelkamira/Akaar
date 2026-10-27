export function getVerifiedGoogleIdentity(profile) {
  if (profile?.email_verified !== true) return null;

  const email = typeof profile.email === 'string' ? profile.email.trim().toLowerCase() : '';
  const subject = typeof profile.sub === 'string' ? profile.sub.trim() : '';

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || subject.length > 255) {
    return null;
  }

  return { email, subject };
}
