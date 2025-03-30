'use client';
import { SearchProvider, useSearch } from '../../contexts/SearchContext';
import SelectedFilters from '../../components/Search/SelectedFilters';
import CategoryFilter from '../../components/Search/CategoryFilter';
import StaticFilters from '../../components/Search/StaticFilters';
import DynamicFilters from '../../components/Search/DynamicFilters';
import SearchResults from '../../components/Search/SearchResults';
import { useState, useCallback } from 'react';
import { FilterIcon, XIcon } from 'lucide-react';

// Separate component for filters that can access context
function FiltersContent({ setShowFilters }) {
  const { category, performSearch } = useSearch();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      await performSearch();
      // Close filters on mobile when searching
      if (window.innerWidth < 1024) {
        setShowFilters(false);
      }
    } finally {
      setIsSearching(false);
    }
  }, [performSearch, setShowFilters]);

  return (
    <div className="space-y-6">
      <SelectedFilters />
      {!category && <CategoryFilter />}
      <StaticFilters />
      {category && <DynamicFilters />}

      {/* Search Button - Only visible on mobile */}
      <div className="lg:hidden">
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg transition-all duration-200 hover:bg-primary/90 disabled:opacity-50"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>جاري البحث...</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <span>بحث</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function SearchPage({ searchParams }) {
  const [showFilters, setShowFilters] = useState(false);
  const { performSearch } = useSearch();

  // Parse category from URL if present
  let initialCategory = null;
  if (searchParams.category) {
    try {
      const categoryId = Number.parseInt(searchParams.category);
      initialCategory = { id: categoryId };
    } catch (e) {
      console.error('Error parsing category:', e);
    }
  }

  return (
    <SearchProvider initialCategory={initialCategory}>
      <div className="min-h-screen bg-gray-50 relative">
        {/* Mobile Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label="Toggle Filters"
        >
          {showFilters ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <FilterIcon className="w-6 h-6" />
          )}
        </button>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <aside
              className={`
                fixed inset-y-0 right-0 w-full lg:w-80 lg:static
                transform transition-transform duration-300 ease-in-out
                ${
                  showFilters
                    ? 'translate-x-0'
                    : 'translate-x-full lg:translate-x-0'
                }
                bg-white lg:bg-transparent z-40
                lg:block
              `}
            >
              <div className="h-full lg:h-auto overflow-y-auto lg:sticky lg:top-4">
                <div className="p-6 lg:p-0 space-y-6">
                  {/* Mobile Header */}
                  <div className="flex justify-between items-center lg:hidden">
                    <h2 className="text-xl font-bold text-gray-900">الفلاتر</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <FiltersContent setShowFilters={setShowFilters} />
                </div>
              </div>
            </aside>

            {/* Overlay for mobile */}
            <div
              className={`
                fixed inset-0 bg-black/50 z-30 lg:hidden
                transition-opacity duration-300
                ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}
              `}
              onClick={() => setShowFilters(false)}
            />

            {/* Search Results */}
            <section className="flex-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <SearchResults />
              </div>
            </section>
          </div>
        </main>
      </div>
    </SearchProvider>
  );
}
