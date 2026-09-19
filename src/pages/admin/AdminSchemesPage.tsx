import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Send, Search, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Scheme } from '../../types';
import { DEMO_PROFILES } from '../../data/demoProfiles';
import { checkEligibility } from '../../utils/eligibilityEngine';

export const AdminSchemesPage: React.FC = () => {
  const { schemes, deleteScheme, sendNotification, profile } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = schemes.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBroadcastScheme = (scheme: Scheme) => {
    const allUsers = [...DEMO_PROFILES, profile];
    let count = 0;

    allUsers.forEach(u => {
      const res = checkEligibility(u, scheme);
      if (res.status === 'POTENTIALLY_ELIGIBLE') {
        count++;
        sendNotification({
          type: 'new_matching_scheme',
          title: `Scheme Match: ${scheme.name}`,
          message: `Dear ${u.name}, you may be eligible for ${scheme.name}.`,
          scheme_id: scheme.id,
          email_data: {
            recipient_email: u.email || 'citizen@gramsahay.gov.in',
            recipient_name: u.name,
            subject: `Potential Match: ${scheme.name}`,
            scheme_name: scheme.name,
            benefit_amount: scheme.benefit_amount,
            matching_reason: res.matchedCriteria.join('; '),
            application_url: scheme.application_url || scheme.official_source
          }
        });
      }
    });

    setFeedback(`Broadcast complete: Sent alert to ${count} matching citizens.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#1b4332] mb-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Overview</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
            Welfare Scheme Repository
          </h1>
          <p className="text-xs text-gray-500">
            Publish, edit, and broadcast official government welfare schemes.
          </p>
        </div>

        <Link
          to="/admin/schemes/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b4332] text-white text-xs font-bold rounded-lg hover:bg-[#2d6a4f] transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scheme</span>
        </Link>
      </div>

      {feedback && (
        <div className="p-3 bg-[#d8f3dc] border border-[#b7e4c7] text-[#1b4332] text-xs font-bold rounded">
          {feedback}
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter schemes by name or category..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2d6a4f]"
        />
      </div>

      {/* Schemes Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold">
                <th className="p-3.5">Scheme Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Benefit</th>
                <th className="p-3.5">State</th>
                <th className="p-3.5">Verified Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((scheme) => (
                <tr key={scheme.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3.5 font-bold text-gray-900 max-w-xs">
                    <Link to={`/schemes/${scheme.id}`} className="hover:text-[#1b4332] hover:underline">
                      {scheme.name}
                    </Link>
                    <div className="text-[11px] text-gray-500 font-normal truncate mt-0.5">
                      {scheme.short_description}
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                      {scheme.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-[#1b4332] whitespace-nowrap">
                    {scheme.benefit_amount || '—'}
                  </td>
                  <td className="p-3.5 text-gray-600 whitespace-nowrap">
                    {scheme.states.join(', ')}
                  </td>
                  <td className="p-3.5 text-gray-500 whitespace-nowrap font-mono text-[11px]">
                    {scheme.last_verified_date}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                    <button
                      onClick={() => handleBroadcastScheme(scheme)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f3f0ea] hover:bg-[#e5e0d8] text-[#1b4332] text-[11px] font-semibold rounded border border-[#ded9cf]"
                      title="Trigger match broadcast"
                    >
                      <Send className="w-3 h-3" />
                      <span>Broadcast</span>
                    </button>

                    <Link
                      to={`/admin/schemes/${scheme.id}/edit`}
                      className="inline-flex items-center p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${scheme.name}?`)) {
                          deleteScheme(scheme.id);
                        }
                      }}
                      className="inline-flex items-center p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
