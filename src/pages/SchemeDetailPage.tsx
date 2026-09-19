import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  ExternalLink, 
  Share2, 
  MessageSquareText, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Briefcase, 
  Users, 
  PlusCircle,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EligibilityExplanation } from '../components/EligibilityExplanation';
import { DocumentChecklist } from '../components/DocumentChecklist';
import { EligibilityBadge } from '../components/EligibilityBadge';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    schemes, 
    isSchemeSaved, 
    toggleSaveScheme, 
    checkSchemeEligibility, 
    addOrUpdateApplication,
    t 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [appNotes, setAppNotes] = useState('');
  const [appStatus, setAppStatus] = useState<any>('Ready to Apply');

  const scheme = schemes.find(s => s.id === id);

  if (!scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Scheme not found</h2>
        <p className="text-xs text-gray-500">The requested scheme may have been archived or removed.</p>
        <Link to="/schemes" className="inline-block px-4 py-2 bg-[#1b4332] text-white text-xs font-semibold rounded">
          Back to Schemes
        </Link>
      </div>
    );
  }

  const isSaved = isSchemeSaved(scheme.id);
  const eligibility = checkSchemeEligibility(scheme);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateApplication({
      scheme_id: scheme.id,
      status: appStatus,
      reference_number: refNumber,
      notes: appNotes
    });
    setShowTrackModal(false);
    navigate('/applications');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Back link & Top Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/schemes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#1b4332] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Schemes</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            title="Copy link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#2d6a4f]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Link' : 'Share'}</span>
          </button>

          <button
            onClick={() => toggleSaveScheme(scheme.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
              isSaved
                ? 'bg-[#1b4332] text-white border-[#1b4332]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{isSaved ? t('saved') : t('save_scheme')}</span>
          </button>
        </div>
      </div>

      {/* Main Scheme Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200">
            {scheme.category}
          </span>
          {scheme.subcategory && (
            <span className="text-xs text-gray-500 font-medium">
              • {scheme.subcategory}
            </span>
          )}
          <EligibilityBadge status={eligibility.status} />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937] leading-tight">
            {scheme.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            {scheme.full_description}
          </p>
        </div>

        {/* Benefit Highlight Box */}
        {scheme.benefit_amount && (
          <div className="p-3 bg-[#f3f0ea] rounded-lg border border-[#e5e0d8] flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Financial Assistance / Benefit:</span>
            <span className="text-sm font-bold text-[#1b4332]">{scheme.benefit_amount}</span>
          </div>
        )}

        {/* Official Source & Verification Strip */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2d6a4f]" />
            <span>{t('official_source')}: </span>
            <a
              href={scheme.official_source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1b4332] font-semibold underline"
            >
              {new URL(scheme.official_source).hostname}
            </a>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>{t('last_verified')}: {scheme.last_verified_date}</span>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {scheme.application_url && (
          <a
            href={scheme.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <span>{t('apply_official')}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        <button
          onClick={() => setShowTrackModal(true)}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-[#2d6a4f]" />
          <span>{t('track_application')}</span>
        </button>

        <Link
          to={`/assistant?q=${encodeURIComponent(`Tell me about ${scheme.name} and how to apply`)}`}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#f3f0ea] hover:bg-[#e8e4db] text-[#1b4332] text-xs font-semibold rounded-lg transition-colors border border-[#ded9cf]"
        >
          <MessageSquareText className="w-4 h-4" />
          <span>Ask Assistant</span>
        </Link>
      </div>

      {/* Why This Scheme May Be Relevant (Explainable Matching) */}
      <section className="space-y-2">
        <EligibilityExplanation result={eligibility} />
      </section>

      {/* Key Benefits */}
      <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h3 className="text-sm font-bold text-[#1f2937] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
          <span>{t('benefits')}</span>
        </h3>
        <ul className="space-y-2 text-xs text-gray-700">
          {scheme.benefits.map((b, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#2d6a4f] font-bold text-sm leading-none mt-0.5">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Structured Eligibility Criteria */}
      <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h3 className="text-sm font-bold text-[#1f2937] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#2d6a4f]" />
          <span>{t('eligibility_criteria')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#f8f9fa] rounded border border-gray-200">
            <span className="font-semibold text-gray-500 block">Age Limit</span>
            <span className="text-gray-900 font-medium">
              {scheme.min_age !== null ? `${scheme.min_age} yrs minimum` : 'No minimum'} 
              {scheme.max_age !== null ? ` (up to ${scheme.max_age} yrs)` : ' (No upper cap)'}
            </span>
          </div>

          <div className="p-3 bg-[#f8f9fa] rounded border border-gray-200">
            <span className="font-semibold text-gray-500 block">Income Ceiling</span>
            <span className="text-gray-900 font-medium">
              {scheme.max_income !== null ? `Up to ₹${scheme.max_income.toLocaleString('en-IN')}/year` : 'No strict income ceiling stated'}
            </span>
          </div>

          <div className="p-3 bg-[#f8f9fa] rounded border border-gray-200">
            <span className="font-semibold text-gray-500 block">Land Requirement</span>
            <span className="text-gray-900 font-medium">
              {scheme.requires_land ? `Landholder (${scheme.minimum_land_area || 0.1}+ acres)` : 'Land ownership not mandatory'}
            </span>
          </div>

          <div className="p-3 bg-[#f8f9fa] rounded border border-gray-200">
            <span className="font-semibold text-gray-500 block">Applicable Locations</span>
            <span className="text-gray-900 font-medium">
              {scheme.states.join(', ')}
            </span>
          </div>
        </div>
      </section>

      {/* Required Documents Checklist (Section 16) */}
      <section className="space-y-2">
        <DocumentChecklist schemeId={scheme.id} documents={scheme.required_documents} />
      </section>

      {/* Step-by-Step Application Steps (Section 17) */}
      <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h3 className="text-sm font-bold text-[#1f2937] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#2d6a4f]" />
          <span>{t('application_steps')}</span>
        </h3>

        <div className="space-y-2.5">
          {scheme.application_steps.map((step, idx) => (
            <div key={idx} className="p-3 bg-[#f8f9fa] rounded border border-gray-100 text-xs text-gray-700 leading-relaxed">
              {step}
            </div>
          ))}
        </div>

        {scheme.application_url && (
          <div className="pt-2">
            <a
              href={scheme.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b4332] text-white rounded text-xs font-bold hover:bg-[#2d6a4f] transition-colors"
            >
              <span>Proceed to {new URL(scheme.application_url).hostname}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </section>

      {/* Standard Required Disclaimer */}
      <div className="p-4 bg-[#f8f9fa] rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
        <div className="font-bold text-gray-800">Public Guidance Statement:</div>
        <p>
          {t('disclaimer_banner')}
        </p>
      </div>

      {/* Track Application Modal */}
      {showTrackModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-sm text-gray-900">Track Scheme Application</h3>
              <button onClick={() => setShowTrackModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Scheme</label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 font-medium text-gray-800">
                  {scheme.name}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={appStatus}
                  onChange={(e) => setAppStatus(e.target.value)}
                  className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f]"
                >
                  <option value="Ready to Apply">Ready to Apply</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Application Reference / Acknowledgement Number (Optional)
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="e.g. AP-PMK-2025-XXXXX"
                  className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Personal Notes</label>
                <textarea
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="e.g. Documents submitted at CSC center on Monday."
                  rows={2}
                  className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>

              <div className="p-2.5 bg-[#f3f0ea] rounded text-[11px] text-gray-600 border border-[#e2ded5]">
                {t('user_managed_notice')}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowTrackModal(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1b4332] text-white font-bold rounded hover:bg-[#2d6a4f]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
