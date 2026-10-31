import InfoPage from '@/components/ReusableComponents/InfoPage';
import { readManagedSitePage } from '@/lib/site/content';

type Props = {
  slug: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; content: string }>;
};

export default async function ManagedInfoPage({ slug, title, intro, sections }: Props) {
  const page = await readManagedSitePage(slug);
  return (
    <InfoPage
      title={page?.title || title}
      intro={page ? '' : intro}
      sections={page ? [{ title: 'معلومات الصفحة', content: page.content }] : sections}
    />
  );
}
