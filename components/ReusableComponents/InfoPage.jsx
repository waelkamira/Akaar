import Link from 'next/link';

export default function InfoPage({ title, intro, sections }) {
  return (
    <main
      dir="rtl"
      className="mx-auto min-h-[60vh] w-full max-w-5xl px-4 py-12 text-ak-cream sm:px-8"
    >
      <header className="ak-panel-raised mb-8 p-6 sm:p-8">
        <p className="mb-2 text-sm font-bold text-ak-honey">عقار</p>
        <h1 className="text-3xl font-black text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl leading-8 text-ak-muted">{intro}</p>
      </header>

      <div className="space-y-4">
        {sections.map((section) => (
          <section key={section.title} className="ak-panel p-5 sm:p-6">
            <h2 className="mb-2 text-xl font-bold text-white">{section.title}</h2>
            <p className="leading-8 text-ak-muted">{section.content}</p>
          </section>
        ))}
      </div>

      <p className="mt-8 border-t border-ak-line pt-6 text-sm text-ak-muted">
        للاستفسارات أو طلب المساعدة، تواصل معنا من خلال{' '}
        <Link
          href="/contactUs"
          className="font-semibold text-ak-honey underline decoration-ak-amber/50 underline-offset-4"
        >
          صفحة التواصل والدعم
        </Link>
        .
      </p>
    </main>
  );
}
