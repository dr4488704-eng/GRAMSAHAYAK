import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from '../components/SchemeCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel, FilterState } from '../components/FilterPanel';

export const SchemesPage: React.FC = () => {
  const { schemes, checkSchemeEligibility, t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialCat = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>({
    category: initialCat,
    state: 'All',
    occupation: 'All',
    eligibleOnly: false
  });

  // Extract unique states from verified schemes
  const availableStates = useMemo(() => {
    const stateSet = new Set<string>();
    schemes.forEach(s => {
      s.states.forEach(st => {
        if (st && st !== 'All') stateSet.add(st);
      });
    });
    return Array.from(stateSet).sort();
  }, [schemes]);

  // Filtering and Searching
  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = scheme.name.toLowerCase().includes(q);
        const inShortDesc = scheme.short_description.toLowerCase().includes(q);
        const inFullDesc = scheme.full_description.toLowerCase().includes(q);
        const inCategory = scheme.category.toLowerCase().includes(q);
        const inOcc = scheme.occupations.some(o => o.toLowerCase().includes(q));
        const inState = scheme.states.some(s => s.toLowerCase().includes(q));
        const inBenefit = (scheme.benefit_amount || '').toLowerCase().includes(q);

        if (!inName && !inShortDesc && !inFullDesc && !inCategory && !inOcc && !inState && !inBenefit) {
          return false;
        }
      }

      // 2. Category filter
      if (filters.category !== 'All' && scheme.category !== filters.category) {
        return false;
      }

      // 3. State filter
      if (filters.state !== 'All') {
        const matchesState = scheme.states.includes('All') || scheme.states.includes(filters.state);
        if (!matchesState) return false;
      }

      // 4. Occupation filter
      if (filters.occupation !== 'All') {
        const matchesOcc = scheme.occupations.length === 0 || scheme.occupations.includes(filters.occupation as any);
        if (!matchesOcc) return false;
      }

      // 5. Eligible Only filter
      if (filters.eligibleOnly) {
        const el = checkSchemeEligibility(scheme);
        if (el.status !== 'POTENTIALLY_ELIGIBLE') {
          return false;
        }
      }

      return true;
    });
  }, [schemes, searchQuery, filters, checkSchemeEligibility]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#2d6a4f]" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
            {t('all_schemes')}
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
            {filteredSchemes.length} verified
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          GramSahay provides a curated collection of verified scheme information for demonstration and discovery.
        </p>
      </div>

      {/* Search Bar with Speech recognition */}
      <div className="max-w-3xl">
        <SearchBar
          value={searchQuery}
          onChange={(q) => {
            setSearchQuery(q);
            setSearchParams(prev => {
              if (q) prev.set('q', q);
              else prev.delete('q');
              return prev;
            });
          }}
        />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        availableStates={availableStates}
      />

      {/* Scheme Cards Grid */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="text-sm font-bold text-gray-800">{t('no_results')}</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {t('no_results_sub')}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({
                category: 'All',
                state: 'All',
                occupation: 'All',
                eligibleOnly: false
              });
            }}
            className="px-4 py-1.5 bg-[#1b4332] text-white text-xs font-semibold rounded hover:bg-[#2d6a4f] transition-colors"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

      {/* Government Verification Trust Footer */}
      <div className="bg-[#fcfbf9] rounded-lg border border-gray-200 p-4 text-xs text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span>
          <strong>Notice:</strong> Information is refreshed periodically. Check the official source link on each scheme card for latest gazette notifications.
        </span>
        <span className="text-gray-400 font-mono text-[11px] shrink-0">
          Deterministic Matching Active
        </span>
      </div>

    </div>
  );
};
