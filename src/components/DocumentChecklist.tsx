import React, { useState, useEffect } from 'react';
import { FileCheck, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DocumentChecklistProps {
  schemeId: string;
  documents: string[];
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({ schemeId, documents }) => {
  const { t } = useApp();
  const storageKey = `gramsahay_docs_${schemeId}`;

  const [readyDocs, setReadyDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Default: mark first 2 ready as a helpful demo state
    const initial: Record<string, boolean> = {};
    documents.forEach((doc, idx) => {
      initial[doc] = idx < 2;
    });
    return initial;
  });

  const toggleDoc = (doc: string) => {
    setReadyDocs(prev => {
      const next = { ...prev, [doc]: !prev[doc] };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const readyCount = documents.filter(doc => readyDocs[doc]).length;
  const totalCount = documents.length;
  const percentage = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Header & Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1f2937] flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#2d6a4f]" />
            <span>{t('required_documents')}</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {readyCount} of {totalCount} {t('document_readiness')}
          </p>
        </div>
        <span className="text-xs font-bold px-2 py-1 bg-[#d8f3dc] text-[#1b4332] rounded">
          {percentage}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-[#2d6a4f] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {documents.map((doc, idx) => {
          const isReady = !!readyDocs[doc];
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleDoc(doc)}
              className={`w-full flex items-start gap-3 p-2.5 rounded-md border text-left text-xs transition-colors ${
                isReady 
                  ? 'bg-[#d8f3dc]/30 border-[#b7e4c7] text-[#1b4332]' 
                  : 'bg-[#f8f9fa] border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mt-0.5">
                {isReady ? (
                  <CheckSquare className="w-4 h-4 text-[#2d6a4f]" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
              </span>
              <div className="flex-1">
                <div className={`font-medium ${isReady ? 'text-[#1b4332]' : 'text-gray-800'}`}>
                  {doc}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Status: <span className={isReady ? 'text-[#2d6a4f] font-semibold' : 'text-gray-500'}>
                    {isReady ? t('ready') : t('not_ready')}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Trust Notice */}
      <div className="flex items-start gap-1.5 p-2 bg-[#f8f9fa] rounded border border-gray-200 text-[11px] text-gray-500">
        <AlertCircle className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
        <span>
          Self-managed checklist for readiness. Official document verification is conducted solely by government inspecting authorities.
        </span>
      </div>
    </div>
  );
};
