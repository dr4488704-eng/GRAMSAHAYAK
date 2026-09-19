import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquareText, ShieldCheck, Volume2, Mic, Sparkles } from 'lucide-react';
import { AIChat } from '../components/AIChat';
import { useApp } from '../context/AppContext';

export const AssistantPage: React.FC = () => {
  const { profile, language, t } = useApp();
  const [searchParams] = useSearchParams();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MessageSquareText className="w-5 h-5 text-[#2d6a4f]" />
          <h1 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
            {t('assistant')}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">
          Ask questions in your preferred language using voice or text. Answers are grounded in verified scheme guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Frame */}
        <div className="lg:col-span-3">
          <AIChat />
        </div>

        {/* Informative Side Panel */}
        <div className="space-y-4 text-xs">
          
          {/* Active Profile Info */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Current Citizen Context</span>
            </h4>
            <div className="space-y-1 text-gray-600">
              <div><strong className="text-gray-800">Citizen:</strong> {profile.name} ({profile.age} yrs)</div>
              <div><strong className="text-gray-800">State:</strong> {profile.state}</div>
              <div><strong className="text-gray-800">Occupation:</strong> {profile.occupation}</div>
              <div><strong className="text-gray-800">Land:</strong> {profile.land_owned ? `${profile.land_area} acres` : 'No agricultural land'}</div>
            </div>
          </div>

          {/* Voice capabilities */}
          <div className="bg-[#f3f0ea] p-4 rounded-lg border border-[#e5e0d8] space-y-2">
            <h4 className="font-bold text-[#1b4332] flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Voice & Speech</span>
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Tap the microphone button inside the chat to speak in English, Telugu, Tamil, or Hindi. Tap the speaker button on any response to listen aloud.
            </p>
          </div>

          {/* Anti-Hallucination Disclaimer */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Verification Guardrails</span>
            </h4>
            <p className="text-gray-600 leading-relaxed">
              GramSahay Assistant only references verified scheme datasets. If an exact rule is not found in official gazettes, the assistant will explicitly state that official authorities must be consulted.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
