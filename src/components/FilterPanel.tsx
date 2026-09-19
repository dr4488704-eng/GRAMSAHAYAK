import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { SchemeCategory, Occupation } from '../types';
import { useApp } from '../context/AppContext';

export interface FilterState {
  category: string;
  state: string;
  occupation: string;
  eligibleOnly: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableStates: string[];
}

export const CATEGORIES: SchemeCategory[] = [
  'Agriculture',
  'Housing',
  'Healthcare',
  'Education',
  'Women Welfare',
  'Pension',
  'Financial Assistance',
  'Entrepreneurship',
  'Skill Development'
];

export const OCCUPATIONS: Occupation[] = [
  'Farmer',
  'Agricultural Labourer',
  'Student',
  'Artisan / Craftsperson',
  'Small Business Owner / Vendor',
  'Daily Wage Worker',
  'Homemaker',
  'Unemployed Youth',
  'Senior Citizen',
  'Other'
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  availableStates
}) => {
  const { t } = useApp();

  const handleReset = () => {
    onFilterChange({
      category: 'All',
      state: 'All',
      occupation: 'All',
      eligibleOnly: false
    });
  };

  const isFiltered = filters.category !== 'All' || filters.state !== 'All' || filters.occupation !== 'All' || filters.eligibleOnly;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-1.5 font-semibold text-gray-700">
          <Filter className="w-3.5 h-3.5 text-[#2d6a4f]" />
          <span>{t('filter_by')}</span>
        </div>
        {isFiltered && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-gray-500 hover:text-[#b91c1c] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('reset_filters')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Category */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full bg-[#f8f9fa] border border-gray-300 rounded p-1.5 text-xs text-gray-800 focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
          >
            <option value="All">{t('all_categories')}</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">State / Territory</label>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange({ ...filters, state: e.target.value })}
            className="w-full bg-[#f8f9fa] border border-gray-300 rounded p-1.5 text-xs text-gray-800 focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
          >
            <option value="All">{t('all_states')}</option>
            {availableStates.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Occupation</label>
          <select
            value={filters.occupation}
            onChange={(e) => onFilterChange({ ...filters, occupation: e.target.value })}
            className="w-full bg-[#f8f9fa] border border-gray-300 rounded p-1.5 text-xs text-gray-800 focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
          >
            <option value="All">All Occupations</option>
            {OCCUPATIONS.map(occ => (
              <option key={occ} value={occ}>{occ}</option>
            ))}
          </select>
        </div>

        {/* Eligible only toggle */}
        <div className="flex items-end">
          <label className="w-full flex items-center gap-2 p-1.5 bg-[#f8f9fa] border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={filters.eligibleOnly}
              onChange={(e) => onFilterChange({ ...filters, eligibleOnly: e.target.checked })}
              className="rounded text-[#2d6a4f] focus:ring-[#2d6a4f] w-3.5 h-3.5"
            />
            <span className="font-semibold text-gray-700">{t('eligible_only')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
