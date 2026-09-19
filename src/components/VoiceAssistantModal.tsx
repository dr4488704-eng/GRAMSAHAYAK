import React, { useEffect, useRef, useState } from 'react';
import { Mic, X, Sparkles, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { startSpeechRecognition, speakText, isSpeechRecognitionSupported } from '../utils/speech';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscribe?: (text: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onTranscribe
}) => {
  const { language, t } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    if (!isSpeechRecognitionSupported()) {
      setVoiceError(t('voice_unsupported'));
      return;
    }

    setVoiceError(null);
    setTranscript('');
    setIsListening(true);

    recognitionRef.current = startSpeechRecognition(language, {
      onStart: () => setIsListening(true),
      onResult: (text) => {
        recognitionRef.current = null;
        setIsListening(false);
        setTranscript(text);
        onTranscribe?.(text);
      },
      onError: (err) => {
        recognitionRef.current = null;
        setIsListening(false);
        setVoiceError(err);
      },
      onEnd: () => {
        recognitionRef.current = null;
        setIsListening(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-md w-full p-6 text-center space-y-5">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="w-16 h-16 rounded-full bg-[#d8f3dc] text-[#1b4332] mx-auto flex items-center justify-center">
            <Mic className={`w-8 h-8 ${isListening ? 'animate-bounce text-[#b91c1c]' : 'text-[#2d6a4f]'}`} />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {isListening ? t('listening') : t('speak')}
          </h3>
          <p className="text-xs text-gray-500">
            Speak naturally (e.g. "I am a 45 year old farmer with two acres of land")
          </p>
        </div>

        {transcript && (
          <div className="p-3 bg-[#f8f9fa] rounded-lg border border-gray-200 text-xs text-gray-800 text-left">
            <span className="font-semibold text-[#2d6a4f]">You said: </span>
            "{transcript}"
          </div>
        )}

        {voiceError && (
          <div className="p-2.5 bg-red-50 rounded text-xs text-[#b91c1c] border border-red-200">
            {voiceError}
          </div>
        )}

        <div className="flex justify-center gap-3 pt-2">
          {!isListening ? (
            <button
              onClick={handleStartListening}
              className="px-5 py-2.5 rounded-lg bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f] transition-colors"
            >
              Start Speaking
            </button>
          ) : (
            <button
              onClick={() => {
                recognitionRef.current?.stop();
                recognitionRef.current = null;
                setIsListening(false);
              }}
              className="px-5 py-2.5 rounded-lg bg-[#b91c1c] text-white text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Stop
            </button>
          )}

          {transcript && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
