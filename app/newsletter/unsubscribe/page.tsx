import NewsletterTokenAction from '../confirm/NewsletterTokenAction';

export default async function NewsletterUnsubscribePage({ searchParams }: PageProps<'/newsletter/unsubscribe'>) {
  const { token } = await searchParams;
  const value = typeof token === 'string' ? token : '';
  return <NewsletterTokenAction token={value} action="unsubscribe" />;
}
