'use client';

export default function PrintReceiptButton() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-xl bg-ak-amber px-5 py-3 text-sm font-bold text-ak-canvas">
      طباعة / حفظ كـ PDF
    </button>
  );
}
