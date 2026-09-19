import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Scheme, SchemeCategory, Occupation, Gender } from '../../types';
import { CATEGORIES, OCCUPATIONS } from '../../components/FilterPanel';
import { DEMO_PROFILES } from '../../data/demoProfiles';
import { checkEligibility } from '../../utils/eligibilityEngine';

export const AdminSchemeFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schemes, addScheme, updateScheme, sendNotification, profile } = useApp();

  const isEdit = Boolean(id);
  const existingScheme = schemes.find(s => s.id === id);

  const [formData, setFormData] = useState<Partial<Scheme>>({
    name: '',
    category: 'Agriculture',
    subcategory: '',
    short_description: '',
    full_description: '',
    benefits: [''],
    benefit_amount: '',
    min_age: null,
    max_age: null,
    gender_requirement: 'all',
    categories: [],
    occupations: ['Farmer'],
    states: ['All'],
    requires_land: false,
    minimum_land_area: null,
    maximum_land_area: null,
    disability_required: false,
    senior_citizen_required: false,
    widow_required: false,
    max_income: null,
    required_documents: ['Aadhaar Card', 'Active Bank Passbook'],
    application_steps: ['Visit official portal or nearest Grama Sachivalayam / CSC centre.'],
    official_source: 'https://india.gov.in',
    application_url: '',
    status: 'published',
    last_verified_date: new Date().toISOString().split('T')[0]
  });

  const [docInput, setDocInput] = useState('Aadhaar Card\nActive Bank Passbook');
  const [stepsInput, setStepsInput] = useState('Visit official portal or nearest Grama Sachivalayam / CSC centre.\nFill application form with identity details.\nSubmit required copies.');
  const [benefitsInput, setBenefitsInput] = useState('Direct cash transfer assistance\nSubsidized insurance coverage');

  useEffect(() => {
    if (isEdit && existingScheme) {
      setFormData(existingScheme);
      setDocInput(existingScheme.required_documents.join('\n'));
      setStepsInput(existingScheme.application_steps.join('\n'));
      setBenefitsInput(existingScheme.benefits.join('\n'));
    }
  }, [isEdit, existingScheme]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const preparedScheme: Scheme = {
      id: isEdit && existingScheme ? existingScheme.id : 'scheme-' + Date.now(),
      name: formData.name || 'Untitled Scheme',
      category: (formData.category as SchemeCategory) || 'Agriculture',
      subcategory: formData.subcategory || undefined,
      short_description: formData.short_description || '',
      full_description: formData.full_description || '',
      benefits: benefitsInput.split('\n').map(b => b.trim()).filter(Boolean),
      benefit_amount: formData.benefit_amount || undefined,
      min_age: formData.min_age ? Number(formData.min_age) : null,
      max_age: formData.max_age ? Number(formData.max_age) : null,
      gender_requirement: (formData.gender_requirement || 'all') as Gender,
      categories: formData.categories || [],
      occupations: formData.occupations || [],
      states: formData.states && formData.states.length > 0 ? formData.states : ['All'],
      requires_land: Boolean(formData.requires_land),
      minimum_land_area: formData.minimum_land_area ? Number(formData.minimum_land_area) : null,
      maximum_land_area: formData.maximum_land_area ? Number(formData.maximum_land_area) : null,
      disability_required: Boolean(formData.disability_required),
      senior_citizen_required: Boolean(formData.senior_citizen_required),
      widow_required: Boolean(formData.widow_required),
      max_income: formData.max_income ? Number(formData.max_income) : null,
      required_documents: docInput.split('\n').map(d => d.trim()).filter(Boolean),
      application_steps: stepsInput.split('\n').map(s => s.trim()).filter(Boolean),
      official_source: formData.official_source || 'https://india.gov.in',
      application_url: formData.application_url || '',
      last_verified_date: formData.last_verified_date || new Date().toISOString().split('T')[0],
      status: 'published',
      created_at: isEdit && existingScheme ? existingScheme.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isEdit) {
      updateScheme(preparedScheme);
    } else {
      addScheme(preparedScheme);
    }

    // Automated Eligibility Broadcast: check against all demo personas & user
    const users = [...DEMO_PROFILES, profile];
    users.forEach(u => {
      const match = checkEligibility(u, preparedScheme);
      if (match.status === 'POTENTIALLY_ELIGIBLE') {
        sendNotification({
          type: 'new_matching_scheme',
          title: `New Scheme Published: ${preparedScheme.name}`,
          message: `Dear ${u.name}, you may be eligible based on your verified criteria.`,
          scheme_id: preparedScheme.id,
          email_data: {
            recipient_email: u.email || 'citizen@gramsahay.gov.in',
            recipient_name: u.name,
            subject: `GramSahay: ${preparedScheme.name} Released`,
            scheme_name: preparedScheme.name,
            benefit_amount: preparedScheme.benefit_amount,
            matching_reason: match.matchedCriteria.join('; '),
            application_url: preparedScheme.application_url || preparedScheme.official_source
          }
        });
      }
    });

    navigate('/admin/schemes');
  };

  const toggleOccupation = (occ: Occupation) => {
    const cur = formData.occupations || [];
    if (cur.includes(occ)) {
      setFormData({ ...formData, occupations: cur.filter(o => o !== occ) });
    } else {
      setFormData({ ...formData, occupations: [...cur, occ] });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <Link
          to="/admin/schemes"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#1b4332] mb-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Schemes List</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
          {isEdit ? 'Edit Welfare Scheme' : 'Publish New Verified Welfare Scheme'}
        </h1>
        <p className="text-xs text-gray-500">
          When published, GramSahay immediately runs deterministic matching against all registered profiles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 shadow-sm text-xs">
        
        {/* Basic Scheme Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5">
            1. Basic Scheme Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Scheme Official Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)"
                className="w-full p-2.5 bg-[#f8f9fa] border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#2d6a4f]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SchemeCategory })}
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f]"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Subcategory / Sector</label>
              <input
                type="text"
                value={formData.subcategory || ''}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g. Income Support, Rural Housing"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Benefit Amount / Form of Aid</label>
              <input
                type="text"
                value={formData.benefit_amount || ''}
                onChange={(e) => setFormData({ ...formData, benefit_amount: e.target.value })}
                placeholder="e.g. ₹6,000 / year or 100% Tuition Waiver"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Last Gazette Verification Date</label>
              <input
                type="date"
                value={formData.last_verified_date}
                onChange={(e) => setFormData({ ...formData, last_verified_date: e.target.value })}
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Short Description (1-2 sentences) *</label>
              <input
                type="text"
                required
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Concise summary for discovery cards"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Full Detailed Description *</label>
              <textarea
                required
                value={formData.full_description}
                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                rows={3}
                placeholder="Comprehensive explanation of objectives, criteria, and administrative guidelines"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Eligibility Criteria & Deterministic Rules */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5">
            2. Deterministic Eligibility Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Min Age (Years)</label>
              <input
                type="number"
                value={formData.min_age ?? ''}
                onChange={(e) => setFormData({ ...formData, min_age: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="e.g. 18 (leave empty if none)"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Max Age (Years)</label>
              <input
                type="number"
                value={formData.max_age ?? ''}
                onChange={(e) => setFormData({ ...formData, max_age: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="e.g. 40 (leave empty if none)"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Max Annual Family Income (₹)</label>
              <input
                type="number"
                value={formData.max_income ?? ''}
                onChange={(e) => setFormData({ ...formData, max_income: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="e.g. 250000 (leave empty if none)"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Gender Restriction</label>
              <select
                value={formData.gender_requirement || 'all'}
                onChange={(e) => setFormData({ ...formData, gender_requirement: e.target.value as Gender })}
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              >
                <option value="all">All Genders</option>
                <option value="female">Female Only</option>
                <option value="male">Male Only</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Applicable States (comma-separated, or 'All')</label>
              <input
                type="text"
                value={(formData.states || ['All']).join(', ')}
                onChange={(e) => setFormData({ ...formData, states: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="e.g. Andhra Pradesh, Telangana or All"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Land Requirements */}
          <div className="p-3 bg-[#f8f9fa] rounded border border-gray-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requires_land}
                onChange={(e) => setFormData({ ...formData, requires_land: e.target.checked })}
                className="rounded text-[#2d6a4f] focus:ring-[#2d6a4f] w-3.5 h-3.5"
              />
              <span className="font-semibold text-gray-800">Requires Agricultural Landholding</span>
            </label>

            {formData.requires_land && (
              <div className="pt-2">
                <label className="block text-gray-600 mb-1">Minimum Land Area (in Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.minimum_land_area ?? ''}
                  onChange={(e) => setFormData({ ...formData, minimum_land_area: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="e.g. 0.5"
                  className="w-48 p-1.5 bg-white border border-gray-300 rounded"
                />
              </div>
            )}
          </div>

          {/* Eligible Occupations */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">Target Occupations (Select all that apply)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OCCUPATIONS.map(occ => {
                const isSelected = (formData.occupations || []).includes(occ);
                return (
                  <label key={occ} className="flex items-center gap-2 p-1.5 bg-[#f8f9fa] rounded border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOccupation(occ)}
                      className="rounded text-[#2d6a4f] focus:ring-[#2d6a4f] w-3.5 h-3.5"
                    />
                    <span className="text-gray-700 text-[11px] truncate">{occ}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Benefits, Documents & Steps */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5">
            3. Benefits, Documents & Application Workflow
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Key Benefits (1 per line)</label>
              <textarea
                value={benefitsInput}
                onChange={(e) => setBenefitsInput(e.target.value)}
                rows={4}
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Required Documents (1 per line)</label>
              <textarea
                value={docInput}
                onChange={(e) => setDocInput(e.target.value)}
                rows={4}
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Application Steps (1 per line)</label>
              <textarea
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                rows={4}
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Official URLs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-1.5">
            4. Official Verification Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Official Portal / Gazette Source URL *</label>
              <input
                type="url"
                required
                value={formData.official_source}
                onChange={(e) => setFormData({ ...formData, official_source: e.target.value })}
                placeholder="https://pmkisan.gov.in"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Direct Citizen Application URL (Optional)</label>
              <input
                type="url"
                value={formData.application_url || ''}
                onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                placeholder="https://pmkisan.gov.in/RegistrationFormNew.aspx"
                className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            to="/admin/schemes"
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 font-semibold hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold rounded shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isEdit ? 'Save Changes' : 'Publish & Broadcast'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
