import { Language } from '../types';

export const LANGUAGE_LOCALE_MAP: Record<Language, string> = {
  en: 'en-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
};

// Check if SpeechRecognition is available in browser
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

// Check if SpeechSynthesis is available in browser
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function startSpeechRecognition(
  language: Language,
  handlers: SpeechRecognitionHandlers
): { stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    handlers.onError?.('Voice input is not supported in this browser. You can type instead.');
    return null;
  }

  try {
    const SpeechRecognitionAPI = (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = LANGUAGE_LOCALE_MAP[language] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      handlers.onStart?.();
    };

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        handlers.onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      handlers.onError?.(event.error === 'not-allowed' ? 'Microphone permission denied.' : 'Voice recognition ended.');
    };

    recognition.onend = () => {
      handlers.onEnd?.();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      }
    };
  } catch (err: any) {
    console.error('Failed to start speech recognition:', err);
    handlers.onError?.(err?.message || 'Failed to initialize microphone');
    return null;
  }
}

export function speakText(text: string, language: Language): void {
  if (!isSpeechSynthesisSupported()) return;

  try {
    window.speechSynthesis.cancel(); // cancel any active utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_LOCALE_MAP[language] || 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clear rural understanding
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === utterance.lang || v.lang.startsWith(language));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis failed:', err);
  }
}

export function stopSpeaking(): void {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}
