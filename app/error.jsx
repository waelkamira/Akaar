'use client';

import ErrorState from '../components/ReusableComponents/ErrorState';

export default function Error({ error, reset }) {
  return <ErrorState error={error} reset={reset} />;
}
