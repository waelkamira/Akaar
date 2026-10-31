type AnalyticsMetric = {
  label: string;
  value: number | string;
  detail: string;
  color: string;
};

type AnalyticsPanelProps = {
  title: string;
  description: string;
  metrics: AnalyticsMetric[];
  chartTitle: string;
  chart: Array<{ label: string; value: number }>;
  chartColor: string;
  notice?: string;
};

function formatValue(value: number | string) {
  return typeof value === 'number' ? new Intl.NumberFormat('ar').format(value) : value;
}

export default function AnalyticsPanel({ title, description, metrics, chartTitle, chart, chartColor, notice }: AnalyticsPanelProps) {
  const maximum = Math.max(...chart.map((item) => item.value), 1);

  return (
    <section className="space-y-5">
      <header className="ak-panel p-5 sm:p-6">
        <p className="ak-eyebrow">SECTION ANALYTICS</p>
        <h2 className="mt-2 text-xl font-black">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-400">{description}</p>
      </header>
      {notice && <p role="status" className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">{notice}</p>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className={`rounded-2xl border p-4 ${metric.color}`}>
            <p className="text-xs opacity-80">{metric.label}</p>
            <p className="mt-2 text-2xl font-black">{formatValue(metric.value)}</p>
            <p className="mt-1 text-[11px] opacity-70">{metric.detail}</p>
          </article>
        ))}
      </div>
      <section className="ak-panel p-5">
        <h3 className="font-bold">{chartTitle}</h3>
        {chart.length ? (
          <div className="mt-5 grid min-h-44 grid-flow-col auto-cols-fr items-end gap-2" role="img" aria-label={chartTitle}>
            {chart.map((item) => (
              <div key={item.label} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="text-[10px] text-stone-400">{formatValue(item.value)}</span>
                <div className="w-full rounded-t-md bg-white/[.04]" style={{ height: '110px', display: 'flex', alignItems: 'end' }}>
                  <div className={`w-full rounded-t-md ${chartColor}`} style={{ height: `${Math.max((item.value / maximum) * 100, item.value > 0 ? 5 : 0)}%` }} />
                </div>
                <span className="max-w-full truncate text-[10px] text-stone-500">{item.label}</span>
              </div>
            ))}
          </div>
        ) : <p className="mt-4 rounded-lg border border-dashed border-ak-line p-4 text-sm text-stone-500">لا تتوفر بيانات كافية لعرض الرسم البياني.</p>}
      </section>
    </section>
  );
}
