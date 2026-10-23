'use client';

import ErrorState from '../components/ReusableComponents/ErrorState';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ErrorState error={error} reset={reset} />
      </body>
    </html>
  );
}
