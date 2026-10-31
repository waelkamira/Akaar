import { notFound } from 'next/navigation';
import InfoPage from '@/components/ReusableComponents/InfoPage';
import { readManagedSitePage } from '@/lib/site/content';

export const dynamic = 'force-dynamic';

export default async function ManagedSitePage({ params }: PageProps<'/pages/[slug]'>) {
  const { slug } = await params;
  const page = await readManagedSitePage(slug);
  if (!page) notFound();

  return (
    <InfoPage
      title={page.title}
      intro=""
      sections={page.content.split(/\n{2,}/).filter(Boolean).map((content, index) => ({
        title: index === 0 ? page.title : `القسم ${index + 1}`,
        content,
      }))}
    />
  );
}
