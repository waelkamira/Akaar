'use client';
import { SearchProvider } from '../../contexts/SearchContext';
import SearchBar from '../../components/Search/SearchBar';
import SelectedFilters from '../../components/Search/SelectedFilters';
import CategoryFilter from '../../components/Search/CategoryFilter';
import StaticFilters from '../../components/Search/StaticFilters';
import DynamicFilters from '../../components/Search/DynamicFilters';
import SearchResults from '../../components/Search/SearchResults';
import { useState } from 'react';
import { FilterIcon, XIcon } from 'lucide-react';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [showFilters, setShowFilters] = useState(false);

  // Get category from URL if presen
  const categoryParam = searchParams.category
    ? Number.parseInt(searchParams.category as string)
    : null;

  return (
    <SearchProvider initialCategory={categoryParam}>
      <div className=" min-h-screen bg-gray-50 relative">
        {/* Mobile Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden fixed bottom-6 right-6 z-20 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          {showFilters ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <FilterIcon className="w-6 h-6" />
          )}
        </button>

        {/* Main Content */}
        <main className=" container mx-auto px-4 py-6">
          <div className=" flex flex-col lg:flex-row justify-between items-start gap-3 w-full">
            {/* Filters Sidebar - Fixed on mobile, Sticky on desktop */}
            <div className="relative sticky top-0 ">
              <aside
                className={`h-full w-72 bg-white z-20 shadow-xl lg:shadow-sm transform transition-transform duration-300 ease-in-out
            ${showFilters ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0 lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto`}
              >
                <div className="fixed top-0 right-0 p-5 space-y-6 h-screen overflow-y-auto bg-white pb-72">
                  <div className="flex justify-between items-center lg:hidden">
                    <h2 className="text-xl font-bold text-primary">الفلاتر</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <SelectedFilters />
                  <CategoryFilter />
                  <StaticFilters />
                  <DynamicFilters />
                </div>
              </aside>
            </div>
            {/* Overlay for mobile */}
            {showFilters && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
            )}

            {/* Search Results */}
            <section className="flex-1 lg:ml-72">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <SearchResults />
              </div>
            </section>
          </div>
        </main>
      </div>
    </SearchProvider>
  );
}
