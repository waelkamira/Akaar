import Link from 'next/link';

export default function InfoPage({ title, intro, sections }) {
  return (
    <main
      dir="rtl"
      className="mx-auto min-h-[60vh] w-full max-w-5xl px-4 py-12 text-neutral-900 sm:px-8"
    >
      <header className="mb-10 border-b border-neutral-200 pb-6">
        <p className="mb-2 text-sm font-bold text-primary-600">عقار</p>
        <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl leading-8 text-neutral-600">{intro}</p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-xl font-bold">{section.title}</h2>
            <p className="leading-8 text-neutral-700">{section.content}</p>
          </section>
        ))}
      </div>

      <p className="mt-10 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
        للاستفسارات أو طلب المساعدة، تواصل معنا من خلال{' '}
        <Link
          href="/contactUs"
          className="font-semibold text-primary-600 underline"
        >
          صفحة التواصل والدعم
        </Link>
        .
      </p>
    </main>
  );
}
