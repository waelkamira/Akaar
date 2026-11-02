'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = { favoriteId: string };

export default function RemoveFavoriteButton({ favoriteId }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function removeFavorite() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/favorite', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: favoriteId }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || 'تعذر حذف المنتج من المفضلة.');
        return;
      }
      router.refresh();
    } catch {
      setError('تعذر الاتصال بالخادم. حاول مرة أخرى.');
    } finally {
      setBusy(false);
    }
  }

  return <div className="px-4 pb-4">
    <button type="button" onClick={removeFavorite} disabled={busy}
      className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/75 transition hover:border-red-300/50 hover:text-red-200 disabled:opacity-50">
      {busy ? 'جارٍ الحذف…' : 'إزالة من المفضلة'}
    </button>
    {error ? <p role="alert" className="mt-2 text-xs text-red-300">{error}</p> : null}
  </div>;
}
