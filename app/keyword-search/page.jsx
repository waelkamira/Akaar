'use client';

import { useSearchParams } from 'next/navigation';
import KeywordSearchResults from '../../components/Search/KeywordSearchResults';

export default function KeywordSearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <KeywordSearchResults keyword={keyword} />
      </div>
    </div>
  );
}
