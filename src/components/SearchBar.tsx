import React, { useState } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { startSpeechRecognition, isSpeechRecognitionSupported } from '../utils/speech';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  onVoiceResult?: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onVoiceResult,
  placeholder
}) => {
  const { language, t } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const handleVoiceClick = () => {
    if (isListening) return;

    if (!isSpeechRecognitionSupported()) {
      setVoiceError(t('voice_unsupported'));
      setTimeout(() => setVoiceError(null), 4000);
      return;
    }

    setVoiceError(null);
    setIsListening(true);

    const recognitionInstance = startSpeechRecognition(language, {
      onStart: () => setIsListening(true),
      onResult: (transcript) => {
        setIsListening(false);
        onChange(transcript);
        onVoiceResult?.(transcript);
      },
      onError: (err) => {
        setIsListening(false);
        setVoiceError(err);
        setTimeout(() => setVoiceError(null), 4000);
      },
      onEnd: () => setIsListening(false)
    });
  };

  return (
    <div className="w-full space-y-1">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3.5 text-gray-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('search_placeholder')}
          className="w-full pl-10 pr-20 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#1f2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] focus:border-transparent transition-all shadow-sm"
        />

        {/* Action icons (Clear + Voice Mic) */}
        <div className="absolute right-2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleVoiceClick}
            className={`p-1.5 rounded-md transition-colors flex items-center justify-center ${
              isListening
                ? 'bg-[#b91c1c] text-white animate-pulse'
                : 'text-[#1b4332] hover:bg-[#d8f3dc] bg-gray-50 border border-gray-200'
            }`}
            title={isListening ? t('listening') : t('speak')}
            aria-label="Voice Search"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Status / Error banner */}
      {isListening && (
        <div className="text-xs text-[#1b4332] font-semibold flex items-center gap-1.5 px-2 py-0.5 bg-[#d8f3dc] rounded">
          <span className="w-2 h-2 rounded-full bg-[#2d6a4f] animate-ping" />
          <span>{t('listening')}</span>
        </div>
      )}

      {voiceError && (
        <div className="text-xs text-[#b91c1c] px-2 py-0.5 bg-red-50 rounded border border-red-100">
          {voiceError}
        </div>
      )}
    </div>
  );
};
