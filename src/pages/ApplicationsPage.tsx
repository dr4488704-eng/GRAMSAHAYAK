import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Calendar, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplicationStatus, Application } from '../types';

export const ApplicationsPage: React.FC = () => {
  const { applications, schemes, addOrUpdateApplication, deleteApplication, t } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);

  const [selectedSchemeId, setSelectedSchemeId] = useState(schemes[0]?.id || '');
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [refNumber, setRefNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleOpenAdd = () => {
    setEditingApp(null);
    setSelectedSchemeId(schemes[0]?.id || '');
    setStatus('Applied');
    setRefNumber('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: Application) => {
    setEditingApp(app);
    setSelectedSchemeId(app.scheme_id);
    setStatus(app.status);
    setRefNumber(app.reference_number || '');
    setNotes(app.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateApplication({
      id: editingApp ? editingApp.id : undefined,
      scheme_id: selectedSchemeId,
      status,
      reference_number: refNumber,
      notes
    });
    setIsModalOpen(false);
  };

  const getStatusBadge = (st: ApplicationStatus) => {
    switch (st) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#d8f3dc] text-[#1b4332] border border-[#b7e4c7]">
            <CheckCircle className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Under Review</span>
          </span>
        );
      case 'Applied':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <FileCheck className="w-3 h-3" />
            <span>Applied</span>
          </span>
        );
      case 'Ready to Apply':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <HelpCircle className="w-3 h-3" />
            <span>Ready to Apply</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
            {st}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#2d6a4f]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
              {t('applications')}
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {applications.length} tracked
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Log and monitor your scheme application reference numbers and milestones.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b4332] text-white text-xs font-bold rounded-lg hover:bg-[#2d6a4f] transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application Record</span>
        </button>
      </div>

      {/* Prominent Trust Banner (Mandated by Section 19) */}
      <div className="p-3.5 bg-[#f3f0ea] rounded-lg border border-[#e2ded5] text-xs text-gray-700 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#1b4332] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-gray-900">User-Managed Tracking Notice: </span>
          <span>{t('user_managed_notice')}</span>
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-800">No applications tracked yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Once you apply on an official portal or Grama Sachivalayam / CSC centre, record your acknowledgement number here for organized follow-ups.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1b4332] text-white text-xs font-bold rounded-lg"
          >
            Track First Scheme
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-semibold">
                  <th className="p-3.5">Scheme Name</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Reference / Ack No.</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => {
                  const scheme = schemes.find(s => s.id === app.scheme_id);
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3.5 font-bold text-gray-900">
                        {scheme ? (
                          <Link to={`/schemes/${scheme.id}`} className="hover:text-[#1b4332] hover:underline">
                            {scheme.name}
                          </Link>
                        ) : (
                          'Scheme (Archived)'
                        )}
                        {scheme && (
                          <span className="block text-[11px] font-normal text-gray-500">
                            {scheme.category}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="p-3.5 font-mono text-gray-700">
                        {app.reference_number || '—'}
                      </td>
                      <td className="p-3.5 text-gray-500 whitespace-nowrap">
                        {new Date(app.application_date || app.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-gray-600 max-w-xs truncate">
                        {app.notes || '—'}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="p-1 text-gray-500 hover:text-gray-900 rounded"
                          title="Edit application"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-sm text-gray-900">
                {editingApp ? 'Update Application Record' : 'Add Application Tracker'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Scheme</label>
                <select
                  value={selectedSchemeId}
                  onChange={(e) => setSelectedSchemeId(e.target.value)}
                  className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f]"
                  required
                >
                  {schemes.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Current Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                  className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f]"
                >
                  <option value="Saved">Saved</option>
                  <option value="Ready to Apply">Ready to Apply</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Application / Reference / Token Number
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  placeholder="e.g. TN-PMAY-2025-88123"
                  className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes / Important Details</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Submitted at Mandal Revenue Office. Verification scheduled for next week."
                  rows={3}
                  className="w-full p-2 bg-[#f8f9fa] border border-gray-300 rounded focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1b4332] text-white font-bold rounded hover:bg-[#2d6a4f]"
                >
                  Save Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
