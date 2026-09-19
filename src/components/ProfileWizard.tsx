import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Briefcase, 
  Trees, 
  Users, 
  HeartHandshake, 
  Bell, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Save,
  Sparkles
} from 'lucide-react';
import { UserProfile, Occupation, SocialCategory, Gender, LandType, Language } from '../types';
import { useApp } from '../context/AppContext';
import { DEMO_PROFILES } from '../data/demoProfiles';
import { OCCUPATIONS } from './FilterPanel';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka', 'Kerala',
  'Maharashtra', 'Uttar Pradesh', 'Bihar', 'Madhya Pradesh', 'Rajasthan',
  'West Bengal', 'Gujarat', 'Odisha', 'Punjab', 'Haryana', 'Assam', 'Jharkhand'
];

interface ProfileWizardProps {
  onSaved?: () => void;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({ onSaved }) => {
  const { profile, setProfile, t, setLanguage } = useApp();
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [currentStep, setCurrentStep] = useState(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const totalSteps = 6;

  const handleUpdate = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setProfile(formData);
    if (formData.preferred_language) {
      setLanguage(formData.preferred_language);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onSaved?.();
    }, 1500);
  };

  const loadPreset = (demoId: string) => {
    const preset = DEMO_PROFILES.find(p => p.id === demoId);
    if (preset) {
      setFormData(preset);
      setProfile(preset);
      setLanguage(preset.preferred_language);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Quick Demo Fill Bar */}
      <div className="bg-[#f3f0ea] px-4 py-2.5 border-b border-[#e5e0d8] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-[#1b4332] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
          <span>Quick Demo Personas:</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {DEMO_PROFILES.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                formData.id === p.id 
                  ? 'bg-[#1b4332] text-white border-[#1b4332]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p.name} ({p.occupation})
            </button>
          ))}
        </div>
      </div>

      {/* Progress Track */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="font-medium text-[#1b4332]">Step {currentStep} of {totalSteps}</span>
          <span>
            {currentStep === 1 && 'Personal Info'}
            {currentStep === 2 && 'Location'}
            {currentStep === 3 && 'Income & Occupation'}
            {currentStep === 4 && 'Agriculture & Land'}
            {currentStep === 5 && 'Family & Conditions'}
            {currentStep === 6 && 'Alerts & Language'}
          </span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#2d6a4f] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Step Forms */}
      <div className="p-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1f2937] flex items-center gap-2">
              <User className="w-5 h-5 text-[#2d6a4f]" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleUpdate('name', e.target.value)}
                  placeholder="e.g. Ramesh"
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => handleUpdate('age', parseInt(e.target.value) || 0)}
                  placeholder="e.g. 45"
                  min="1"
                  max="120"
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleUpdate('gender', e.target.value as Gender)}
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Social Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleUpdate('category', e.target.value as SocialCategory)}
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                >
                  <option value="General">General / Open</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1f2937] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2d6a4f]" />
              <span>Location Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleUpdate('state', e.target.value)}
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleUpdate('district', e.target.value)}
                  placeholder="e.g. Prakasam / Madurai / Varanasi"
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Village or Town</label>
                <input
                  type="text"
                  value={formData.village_or_town}
                  onChange={(e) => handleUpdate('village_or_town', e.target.value)}
                  placeholder="e.g. Chimakurthy"
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Income & Occupation */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1f2937] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#2d6a4f]" />
              <span>Income & Occupation</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Select Primary Occupation</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {OCCUPATIONS.map(occ => {
                  const isSelected = formData.occupation === occ;
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => handleUpdate('occupation', occ)}
                      className={`p-3 text-left rounded-lg border text-xs transition-all ${
                        isSelected 
                          ? 'bg-[#d8f3dc] border-[#2d6a4f] font-bold text-[#1b4332] shadow-sm' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold text-sm">{occ}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  value={formData.annual_family_income || ''}
                  onChange={(e) => handleUpdate('annual_family_income', parseInt(e.target.value) || 0)}
                  placeholder="e.g. 120000"
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-0.5">Total combined family income per year.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Employment Status
                </label>
                <select
                  value={formData.employment_status}
                  onChange={(e) => handleUpdate('employment_status', e.target.value)}
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                >
                  <option value="farmer">Farmer</option>
                  <option value="self_employed">Self Employed / Artisan</option>
                  <option value="student">Student</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="employed">Employed / Wage Worker</option>
                  <option value="homemaker">Homemaker</option>
                  <option value="retired">Retired / Senior</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Agriculture & Land */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1f2937] flex items-center gap-2">
              <Trees className="w-5 h-5 text-[#2d6a4f]" />
              <span>Agricultural Land Information</span>
            </h3>

            <div className="p-4 bg-[#f8f9fa] rounded-lg border border-gray-200 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.land_owned}
                  onChange={(e) => handleUpdate('land_owned', e.target.checked)}
                  className="w-4 h-4 rounded text-[#2d6a4f] focus:ring-[#2d6a4f]"
                />
                <span className="text-sm font-semibold text-gray-800">
                  Does your family own agricultural land?
                </span>
              </label>

              {formData.land_owned && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Land Area (in Acres)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.land_area || ''}
                      onChange={(e) => handleUpdate('land_area', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 2.0"
                      className="w-full text-sm p-2 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Land Irrigation Type
                    </label>
                    <select
                      value={formData.land_type}
                      onChange={(e) => handleUpdate('land_type', e.target.value as LandType)}
                      className="w-full text-sm p-2 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                    >
                      <option value="irrigated">Irrigated (Wetland)</option>
                      <option value="unirrigated">Unirrigated (Dryland / Rainfed)</option>
                      <option value="none">None / Leased</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Family & Special Conditions */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1f2937] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2d6a4f]" />
              <span>Family & Special Conditions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Family Size</label>
                <input
                  type="number"
                  value={formData.family_size || 1}
                  onChange={(e) => handleUpdate('family_size', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Children Count</label>
                <input
                  type="number"
                  value={formData.children_count || 0}
                  onChange={(e) => handleUpdate('children_count', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Seniors (60+) in Family</label>
                <input
                  type="number"
                  value={formData.senior_citizen_count || 0}
                  onChange={(e) => handleUpdate('senior_citizen_count', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-center gap-2 p-2.5 rounded bg-[#f8f9fa] border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.female_headed_household}
                  onChange={(e) => handleUpdate('female_headed_household', e.target.checked)}
                  className="rounded text-[#2d6a4f] focus:ring-[#2d6a4f]"
                />
                <span className="text-xs font-medium text-gray-800">Female-headed household</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded bg-[#f8f9fa] border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.widow}
                  onChange={(e) => handleUpdate('widow', e.target.checked)}
                  className="rounded text-[#2d6a4f] focus:ring-[#2d6a4f]"
                />
                <span className="text-xs font-medium text-gray-800">Widow support category</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded bg-[#f8f9fa] border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.disability}
                  onChange={(e) => handleUpdate('disability', e.target.checked)}
                  className="rounded text-[#2d6a4f] focus:ring-[#2d6a4f]"
                />
                <span className="text-xs font-medium text-gray-800">Person with Disability (PwD)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded bg-[#f8f9fa] border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.senior_citizen}
                  onChange={(e) => handleUpdate('senior_citizen', e.target.checked)}
                  className="rounded text-[#2d6a4f] focus:ring-[#2d6a4f]"
                />
                <span className="text-xs font-medium text-gray-800">Senior Citizen (60 years or above)</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 6: Notifications & Language */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1f2937] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2d6a4f]" />
              <span>Notifications & Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleUpdate('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-0.5">Used only for explicit scheme match notifications.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Language</label>
                <select
                  value={formData.preferred_language}
                  onChange={(e) => handleUpdate('preferred_language', e.target.value as Language)}
                  className="w-full text-sm p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f] focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-[#f8f9fa] rounded-lg border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.email_notifications_enabled}
                  onChange={(e) => handleUpdate('email_notifications_enabled', e.target.checked)}
                  className="w-4 h-4 rounded text-[#2d6a4f] focus:ring-[#2d6a4f] mt-0.5"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-800">
                    Opt-in to automatic new scheme email alerts
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Receive an email when new government schemes matching your profile are published. You can turn this off anytime.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="bg-[#fcfbf9] px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 text-xs font-semibold disabled:opacity-40 hover:bg-gray-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#1b4332] text-white text-xs font-semibold hover:bg-[#2d6a4f] transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? 'Profile Saved ✓' : 'Save Profile'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
