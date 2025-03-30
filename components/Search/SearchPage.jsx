'use client';

import { useSearch } from '../../contexts/SearchContext';
import CategoryFilter from './CategoryFilter';
import StaticFilters from './StaticFilters';
import DynamicFilters from './DynamicFilters';
import SearchResults from './SearchResults';
import SelectedFilters from './SelectedFilters';

export default function SearchPage() {
  const { category } = useSearch();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Column */}
        <div className="md:col-span-1">
          <CategoryFilter />
          <StaticFilters />
          {category && <DynamicFilters />}
        </div>

        {/* Results Column */}
        <div className="md:col-span-3">
          <SelectedFilters />
          <SearchResults />
        </div>
      </div>
    </div>
  );
}
