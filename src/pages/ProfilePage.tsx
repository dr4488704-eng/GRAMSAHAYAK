import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck } from 'lucide-react';
import { ProfileWizard } from '../components/ProfileWizard';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-[#2d6a4f]" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
            {t('citizen_profile')}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          Provide your household details to calculate explainable, deterministic eligibility matches across state and central welfare programs.
        </p>
      </div>

      <ProfileWizard
        onSaved={() => {
          navigate('/dashboard');
        }}
      />

      <div className="p-4 bg-[#f8f9fa] rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <ShieldCheck className="w-4 h-4 text-[#2d6a4f]" />
          <span>Data Privacy & Rule Transparency:</span>
        </div>
        <p>
          GramSahay stores your profile locally on your device. Eligibility evaluation is conducted via strict rule algorithms with no random AI scoring or hallucination. You can modify or clear these details anytime.
        </p>
      </div>
    </div>
  );
};
