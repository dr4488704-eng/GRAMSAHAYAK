import React from 'react';
import { Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { EligibilityResult } from '../types';
import { useApp } from '../context/AppContext';

interface EligibilityExplanationProps {
  result: EligibilityResult;
}

export const EligibilityExplanation: React.FC<EligibilityExplanationProps> = ({ result }) => {
  const { t } = useApp();

  return (
    <div className="bg-[#f8f9fa] rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h4 className="text-sm font-semibold text-[#1b4332] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#2d6a4f]" />
          <span>{t('why_it_matches')}</span>
        </h4>
        <span className="text-[11px] text-gray-500 font-medium">Deterministic Rule Matching</span>
      </div>

      {/* Primary status announcement */}
      <p className="text-xs font-semibold text-[#1f2937]">
        {result.summaryMessage}
      </p>

      {/* Matched Criteria list (✓) */}
      {result.matchedCriteria.length > 0 && (
        <div className="space-y-1.5">
          {result.matchedCriteria.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
              <span className="text-[#2d6a4f] font-bold text-sm leading-none mt-0.5">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Missing Information list (⚠) */}
      {result.missingCriteria.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-gray-200">
          <div className="text-[11px] font-semibold text-[#b45309] flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t('missing_info_needed')}:</span>
          </div>
          {result.missingCriteria.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-[#92400e]">
              <span className="text-[#b45309] font-bold text-sm leading-none mt-0.5">⚠</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Unmatched criteria if any */}
      {result.unmatchedCriteria.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-gray-200">
          <div className="text-[11px] font-semibold text-gray-600">Unmatched conditions:</div>
          {result.unmatchedCriteria.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-gray-400 font-bold text-sm leading-none mt-0.5">•</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Standard Required Disclaimer */}
      <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500 italic">
        Final eligibility is determined exclusively by the respective government department.
      </div>
    </div>
  );
};
