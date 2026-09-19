import React from 'react';
import { Mail, X, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { NotificationLog } from '../types';

interface EmailPreviewModalProps {
  log: NotificationLog | null;
  onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-300 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#1b4332] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#95d5b2]" />
            <h3 className="font-bold text-sm">Demo Email Preview</h3>
            <span className="text-[10px] bg-[#2d6a4f] text-[#d8f3dc] px-2 py-0.5 rounded font-mono uppercase">
              {log.delivery_channel === 'demo_mode' ? 'Demo Email Mode' : 'Live SMTP Sent'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice for judges */}
        <div className="bg-[#fef3c7] text-[#92400e] text-xs px-4 py-2 border-b border-[#fde68a] flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#b45309] shrink-0" />
          <span>
            <strong>Judge Inspection:</strong> In demo mode without SMTP credentials, GramSahay generates and records this full email artifact automatically.
          </span>
        </div>

        {/* Email Metadata */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 text-xs space-y-1.5">
          <div className="flex">
            <span className="w-20 font-semibold text-gray-500">To:</span>
            <span className="font-mono text-gray-800">{log.recipient_email}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold text-gray-500">Subject:</span>
            <span className="font-semibold text-gray-900">{log.subject}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold text-gray-500">Sent At:</span>
            <span className="text-gray-600">{new Date(log.sent_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-gray-800 leading-relaxed bg-white">
          <div className="p-4 bg-[#f8f9fa] rounded-lg border border-gray-200 space-y-3">
            <div className="flex items-center gap-2 text-[#1b4332] font-bold text-base pb-2 border-b border-gray-200">
              <ShieldCheck className="w-5 h-5 text-[#2d6a4f]" />
              <span>GramSahay AI Notification</span>
            </div>

            <div className="whitespace-pre-wrap text-gray-700">
              {log.body_text}
            </div>
          </div>

          <div className="p-3 bg-[#f3f0ea] rounded border border-[#e5e0d8] text-[11px] text-gray-600">
            <strong>Disclaimer:</strong> Information provided is for discovery only. Final eligibility is determined exclusively by the respective government authority.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
