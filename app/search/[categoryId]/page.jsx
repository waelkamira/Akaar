'use client';

import { useEffect } from 'react';
import { useSearch } from '../../../contexts/SearchContext';
import SearchResults from '../../../components/Search/SearchResults';
import StaticFilters from '../../../components/Search/StaticFilters';
import DynamicFilters from '../../../components/Search/DynamicFilters';
import SelectedFilters from '../../../components/Search/SelectedFilters';
import { motion } from 'framer-motion';
import { SearchProvider } from '../../../contexts/SearchContext';
import { filterOptions } from '../../../lib/mockData';

function SearchCategoryContent({ params }) {
  const { performSearch, loading } = useSearch();

  useEffect(() => {
    // Trigger search when the page loads
    performSearch();
  }, [performSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <StaticFilters />
          <DynamicFilters />
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <SelectedFilters />
          <SearchResults />
        </div>
      </div>
    </motion.div>
  );
}

export default function SearchCategoryPage({ params }) {
  // Extract categoryId from params
  const categoryId = params.categoryId?.split('=')[1];

  // Find the full category object
  const category = filterOptions.categories.find(
    (cat) => cat.id.toString() === categoryId
  );

  return (
    <SearchProvider initialCategory={category}>
      <SearchCategoryContent params={params} />
    </SearchProvider>
  );
}
