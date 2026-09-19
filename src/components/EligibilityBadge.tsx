import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { EligibilityStatus } from '../types';

interface EligibilityBadgeProps {
  status: EligibilityStatus;
  compact?: boolean;
}

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({ status, compact = false }) => {
  if (status === 'POTENTIALLY_ELIGIBLE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#d8f3dc] text-[#1b4332] text-xs font-semibold border border-[#b7e4c7]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
        <span>{compact ? 'May Match' : 'You May Be Eligible'}</span>
      </span>
    );
  }

  if (status === 'MORE_INFO_REQUIRED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#fef3c7] text-[#92400e] text-xs font-semibold border border-[#fde68a]">
        <AlertTriangle className="w-3.5 h-3.5 text-[#b45309]" />
        <span>{compact ? 'Info Needed' : 'More Info Needed'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
      <XCircle className="w-3.5 h-3.5 text-gray-500" />
      <span>{compact ? 'Not Matching' : 'Not Matching Current Profile'}</span>
    </span>
  );
};
