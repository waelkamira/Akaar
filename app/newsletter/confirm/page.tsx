import NewsletterTokenAction from './NewsletterTokenAction';

export default async function NewsletterConfirmPage({ searchParams }: PageProps<'/newsletter/confirm'>) {
  const { token } = await searchParams;
  const value = typeof token === 'string' ? token : '';
  return <NewsletterTokenAction token={value} action="confirm" />;
}
