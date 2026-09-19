import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { Scheme } from '../types';
import { useApp } from '../context/AppContext';
import { EligibilityBadge } from './EligibilityBadge';

interface SchemeCardProps {
  scheme: Scheme;
  showExplanationSnippet?: boolean;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, showExplanationSnippet = true }) => {
  const { t, isSchemeSaved, toggleSaveScheme, checkSchemeEligibility } = useApp();
  const isSaved = isSchemeSaved(scheme.id);
  const eligibility = checkSchemeEligibility(scheme);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
      {/* Card Header & Category Tag */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
              {scheme.category}
            </span>
            {scheme.subcategory && (
              <span className="text-[11px] text-gray-500 hidden sm:inline">
                • {scheme.subcategory}
              </span>
            )}
            {scheme.states.length === 1 && scheme.states[0] !== 'All' && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-[#f3f0ea] text-[#1b4332] border border-[#e5e0d8]">
                {scheme.states[0]}
              </span>
            )}
          </div>

          {/* Bookmark / Save button */}
          <button
            onClick={() => toggleSaveScheme(scheme.id)}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isSaved
                ? 'bg-[#0f291e] text-white shadow-xs'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title={isSaved ? t('saved') : t('save_scheme')}
            aria-label={isSaved ? t('saved') : t('save_scheme')}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Scheme Title */}
        <div>
          <Link to={`/schemes/${scheme.id}`} className="group">
            <h3 className="text-base sm:text-lg font-bold text-[#1f2937] group-hover:text-[#1b4332] transition-colors line-clamp-2">
              {scheme.name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
            {scheme.short_description}
          </p>
        </div>

        {/* Key Benefit Highlight */}
        {scheme.benefit_amount && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f3f0ea] rounded-full text-xs font-semibold text-[#0f291e] border border-[#e2ded5]">
            <span>Benefit:</span>
            <span className="text-[#0f291e] font-bold">{scheme.benefit_amount}</span>
          </div>
        )}

        {/* Eligibility Status Badge */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <EligibilityBadge status={eligibility.status} />
          <span className="text-[11px] text-gray-500 font-mono">
            {scheme.required_documents.length} docs
          </span>
        </div>

        {/* Short explanation summary */}
        {showExplanationSnippet && eligibility.matchedCriteria.length > 0 && (
          <div className="bg-[#f8f9fa] p-2 rounded-lg text-[11px] text-gray-600 space-y-0.5 border border-gray-100">
            <span className="font-semibold text-emerald-800 mr-1">Match:</span>
            <span>{eligibility.matchedCriteria[0]}</span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="bg-[#fcfbf9] px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <Link
          to={`/schemes/${scheme.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f291e] hover:text-emerald-700 transition-colors whitespace-nowrap"
        >
          <span>{t('view_details')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {scheme.application_url && (
          <a
            href={scheme.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-emerald-950 bg-white border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-full transition-all shadow-2xs whitespace-nowrap"
          >
            <span>{t('apply_official')}</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        )}
      </div>
    </div>
  );
};
