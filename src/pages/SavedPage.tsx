import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from '../components/SchemeCard';

export const SavedPage: React.FC = () => {
  const { savedSchemeIds, schemes, t } = useApp();

  const savedSchemes = schemes.filter(s => savedSchemeIds.includes(s.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-[#2d6a4f]" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
            {t('saved_schemes')}
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
            {savedSchemes.length} saved
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          Schemes you have bookmarked for offline review or application readiness.
        </p>
      </div>

      {savedSchemes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-800">No saved schemes yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You can bookmark any scheme from the catalog or dashboard to keep track of its documents and deadlines.
            </p>
          </div>
          <Link
            to="/schemes"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b4332] text-white text-xs font-bold rounded-lg hover:bg-[#2d6a4f] transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Schemes</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

    </div>
  );
};
