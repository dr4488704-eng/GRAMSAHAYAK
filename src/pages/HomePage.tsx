import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Mic, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Compass, 
  Sparkles, 
  Trees, 
  GraduationCap, 
  Home as HomeIcon, 
  HeartPulse, 
  Users, 
  Coins, 
  Briefcase,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from '../components/SchemeCard';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';
import { SchemeCategory } from '../types';

export const HomePage: React.FC = () => {
  const { t, schemes, profile, checkSchemeEligibility } = useApp();
  const navigate = useNavigate();
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Top categories with icons
  const categoryHighlights: { name: SchemeCategory; icon: any; count: number }[] = [
    { name: 'Agriculture', icon: Trees, count: schemes.filter(s => s.category === 'Agriculture').length },
    { name: 'Education', icon: GraduationCap, count: schemes.filter(s => s.category === 'Education').length },
    { name: 'Housing', icon: HomeIcon, count: schemes.filter(s => s.category === 'Housing').length },
    { name: 'Healthcare', icon: HeartPulse, count: schemes.filter(s => s.category === 'Healthcare').length },
    { name: 'Women Welfare', icon: Users, count: schemes.filter(s => s.category === 'Women Welfare').length },
    { name: 'Pension', icon: Coins, count: schemes.filter(s => s.category === 'Pension').length },
    { name: 'Financial Assistance', icon: Briefcase, count: schemes.filter(s => s.category === 'Financial Assistance').length },
    { name: 'Entrepreneurship', icon: Sparkles, count: schemes.filter(s => s.category === 'Entrepreneurship').length }
  ];

  // Matched schemes preview for current profile
  const matchedSchemes = schemes.filter(s => {
    const el = checkSchemeEligibility(s);
    return el.status === 'POTENTIALLY_ELIGIBLE';
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Compact, Dignified Hero Section */}
      <section className="bg-[#1b4332] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#2d6a4f]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#235841] text-[#d8f3dc] border border-[#40916c] rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#95d5b2]" />
            <span>GramSahay AI Public Welfare Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            {t('hero_title')}
          </h1>

          <p className="text-sm sm:text-base text-[#d8f3dc] max-w-2xl mx-auto leading-relaxed">
            {t('hero_subtitle')}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>{t('find_my_schemes')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/schemes"
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-xs whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-emerald-300" />
              <span>{t('search_schemes')}</span>
            </Link>

            <button
              onClick={() => setIsVoiceOpen(true)}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-xs whitespace-nowrap cursor-pointer"
            >
              <Mic className="w-4 h-4 text-emerald-300" />
              <span>{t('speak')}</span>
            </button>
          </div>

          {/* Verification Disclaimer */}
          <p className="text-[11px] text-emerald-200/80 max-w-xl mx-auto pt-2 italic">
            "{t('disclaimer_short')}" Final eligibility is determined by the relevant government authority.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Active Demo Profile Banner */}
        <div className="bg-[#f3f0ea] rounded-xl border border-[#e5e0d8] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0f291e] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {profile.name[0]}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">
                Active Citizen Profile: {profile.name} ({profile.age} yrs)
              </div>
              <div className="text-gray-600">
                {profile.occupation} • {profile.district}, {profile.state} • {profile.land_owned ? `${profile.land_area} acres land` : 'No land'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="px-3.5 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-all text-xs shadow-2xs whitespace-nowrap"
            >
              Edit Profile
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-1.5 bg-[#0f291e] hover:bg-[#1b4332] text-white rounded-full font-semibold transition-all text-xs shadow-xs whitespace-nowrap"
            >
              View {matchedSchemes.length} Matches
            </Link>
          </div>
        </div>

        {/* How GramSahay Helps (Section 13) */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
              {t('how_it_helps')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Clear, step-by-step assistance designed for rural citizens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
              <div className="w-8 h-8 rounded-md bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900">{t('step1_title')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t('step1_desc')}</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
              <div className="w-8 h-8 rounded-md bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900">{t('step2_title')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t('step2_desc')}</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
              <div className="w-8 h-8 rounded-md bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900">{t('step3_title')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t('step3_desc')}</p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-2">
              <div className="w-8 h-8 rounded-md bg-[#d8f3dc] text-[#1b4332] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-sm text-gray-900">{t('step4_title')}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t('step4_desc')}</p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-[#1f2937]">
              {t('browse_by_category')}
            </h2>
            <Link to="/schemes" className="text-xs font-semibold text-[#1b4332] hover:underline">
              View All Schemes →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categoryHighlights.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/schemes?category=${encodeURIComponent(cat.name)}`}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#2d6a4f] hover:shadow-xs transition-all flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded bg-[#f3f0ea] text-[#1b4332] group-hover:bg-[#d8f3dc] flex items-center justify-center transition-colors shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#1b4332] transition-colors leading-tight">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {cat.count} verified schemes
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Potential Matches for Active Profile */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1f2937]">
                Featured Matching Schemes for {profile.name}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Evaluated through deterministic rule matching against your profile.
              </p>
            </div>
            <Link to="/dashboard" className="text-xs font-semibold text-[#1b4332] hover:underline">
              View All Matches ({matchedSchemes.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedSchemes.slice(0, 3).map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </section>

        {/* Trust & Transparency Box */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1b4332]">
            <ShieldCheck className="w-5 h-5 text-[#2d6a4f]" />
            <span>Public Trust & Official Verification</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            {t('disclaimer_banner')}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t border-gray-100">
            <span>✓ Verified official government sources</span>
            <span>✓ No hidden charges or agents</span>
            <span>✓ Privacy-first, no unnecessary personal tracking</span>
          </div>
        </section>

      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onTranscribe={(text) => {
          setIsVoiceOpen(false);
          navigate(`/schemes?q=${encodeURIComponent(text)}`);
        }}
      />

    </div>
  );
};
