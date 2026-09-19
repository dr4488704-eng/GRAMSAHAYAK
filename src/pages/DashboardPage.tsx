import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Bookmark, 
  Bell, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  MessageSquareText,
  Compass,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SchemeCard } from '../components/SchemeCard';

export const DashboardPage: React.FC = () => {
  const { 
    profile, 
    schemes, 
    savedSchemeIds, 
    applications, 
    notifications, 
    checkSchemeEligibility, 
    t 
  } = useApp();

  // Evaluate matching schemes
  const potentiallyEligible = schemes.filter(s => {
    const el = checkSchemeEligibility(s);
    return el.status === 'POTENTIALLY_ELIGIBLE';
  });

  const moreInfoRequired = schemes.filter(s => {
    const el = checkSchemeEligibility(s);
    return el.status === 'MORE_INFO_REQUIRED';
  });

  const savedSchemes = schemes.filter(s => savedSchemeIds.includes(s.id));
  const unreadNotifs = notifications.filter(n => !n.read);

  // Profile completion calculation
  const profileFields = [
    profile.name,
    profile.age,
    profile.state,
    profile.district,
    profile.occupation,
    profile.annual_family_income,
    profile.email
  ];
  const filledFields = profileFields.filter(f => f !== undefined && f !== null && f !== '').length;
  const completionPercentage = Math.round((filledFields / profileFields.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hello Citizen Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#d8f3dc] text-[#1b4332]">
              Citizen Dashboard
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{profile.occupation} in {profile.state}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1f2937]">
            Hello, {profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {t('disclaimer_short')}
          </p>
        </div>

        {/* Profile completion badge */}
        <div className="bg-[#f8f9fa] border border-gray-200 rounded-lg p-3 w-full sm:w-60 space-y-1.5 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-700">{t('profile_completion')}</span>
            <span className="font-bold text-[#1b4332]">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#2d6a4f] h-2 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] pt-1">
            <Link to="/profile" className="text-[#1b4332] font-semibold hover:underline">
              Update Profile
            </Link>
            <span className="text-gray-400">{profile.category} category</span>
          </div>
        </div>
      </div>

      {/* Recommended Next Step Box */}
      <div className="bg-[#f3f0ea] rounded-lg border border-[#e5e0d8] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#95d5b2]" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">
              {t('recommended_next_step')}
            </div>
            <p className="text-gray-600 mt-0.5">
              {t('step_review_matches')}
            </p>
          </div>
        </div>

        <Link
          to="/assistant"
          className="px-3.5 py-1.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-semibold rounded transition-colors flex items-center gap-1.5 shrink-0"
        >
          <MessageSquareText className="w-3.5 h-3.5" />
          <span>Ask Assistant</span>
        </Link>
      </div>

      {/* Metric Cards Grid (Simple, Non-SaaS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-1">
          <div className="text-xs text-gray-500 font-medium">{t('schemes_for_you')}</div>
          <div className="text-2xl font-bold text-[#1b4332]">{potentiallyEligible.length}</div>
          <div className="text-[11px] text-gray-500">Matching criteria</div>
        </div>

        <Link to="/saved" className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-1 hover:border-gray-300 block">
          <div className="text-xs text-gray-500 font-medium">{t('saved_schemes')}</div>
          <div className="text-2xl font-bold text-gray-900">{savedSchemes.length}</div>
          <div className="text-[11px] text-gray-500">Bookmarked</div>
        </Link>

        <Link to="/applications" className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-1 hover:border-gray-300 block">
          <div className="text-xs text-gray-500 font-medium">{t('applications')}</div>
          <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          <div className="text-[11px] text-gray-500">Tracked locally</div>
        </Link>

        <Link to="/notifications" className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-1 hover:border-gray-300 block">
          <div className="text-xs text-gray-500 font-medium">{t('notifications')}</div>
          <div className="text-2xl font-bold text-gray-900">{unreadNotifs.length}</div>
          <div className="text-[11px] text-gray-500">Unread alerts</div>
        </Link>
      </div>

      {/* Section 1: Schemes for You */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1f2937] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2d6a4f]" />
              <span>{t('schemes_for_you')} ({potentiallyEligible.length})</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Schemes that match your age, occupation, location, and landholdings.
            </p>
          </div>
          <Link to="/schemes" className="text-xs font-semibold text-[#1b4332] hover:underline flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {potentiallyEligible.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center space-y-3">
            <p className="text-sm text-gray-600">{t('no_results')}</p>
            <Link
              to="/profile"
              className="inline-block px-4 py-2 bg-[#1b4332] text-white text-xs font-bold rounded"
            >
              Update Profile Details
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {potentiallyEligible.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </section>

      {/* Section 2: More Information Needed */}
      {moreInfoRequired.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#92400e]">
            <AlertCircle className="w-4 h-4 text-[#b45309]" />
            <span>Additional Schemes Requiring Minor Details ({moreInfoRequired.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {moreInfoRequired.slice(0, 2).map((scheme) => (
              <div key={scheme.id} className="bg-white p-4 rounded-lg border border-amber-200 text-xs space-y-2">
                <div className="font-bold text-gray-900 text-sm">{scheme.name}</div>
                <p className="text-gray-600">{scheme.short_description}</p>
                <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                  <span className="text-[11px] text-[#b45309] font-medium">Check requirements</span>
                  <Link to={`/schemes/${scheme.id}`} className="text-[#1b4332] font-semibold hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Saved Schemes Quick View */}
      {savedSchemes.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1f2937] flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#2d6a4f]" />
              <span>{t('saved_schemes')} ({savedSchemes.length})</span>
            </h2>
            <Link to="/saved" className="text-xs font-semibold text-[#1b4332] hover:underline">
              View All Saved →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedSchemes.slice(0, 3).map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} showExplanationSnippet={false} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
