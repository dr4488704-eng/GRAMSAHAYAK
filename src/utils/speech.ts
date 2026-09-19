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

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

let activeRecognition: SpeechRecognitionInstance | null = null;

function getSpeechRecognitionConstructor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null;

  const browserWindow = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };

  return browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition || null;
}

function getRecognitionErrorMessage(error: string | undefined): string {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone permission was denied. Allow microphone access and try again.';
    case 'audio-capture':
      return 'No microphone was found. Connect a microphone and try again.';
    case 'network':
      return 'Voice recognition needs an internet connection. Check your connection and try again.';
    case 'no-speech':
      return 'No speech was detected. Tap the microphone and speak clearly.';
    case 'aborted':
      return 'Voice recognition was stopped.';
    default:
      return 'Voice recognition could not start. Please try again or type your question.';
  }
}

export function startSpeechRecognition(
  language: Language,
  handlers: SpeechRecognitionHandlers
): { stop: () => void } | null {
  const SpeechRecognitionAPI = getSpeechRecognitionConstructor();
  if (!SpeechRecognitionAPI) {
    handlers.onError?.('Voice input is not supported in this browser. You can type instead.');
    return null;
  }

  try {
    activeRecognition?.abort();

    const recognition = new SpeechRecognitionAPI();
    activeRecognition = recognition;
    recognition.lang = LANGUAGE_LOCALE_MAP[language] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';
    let stoppedByUser = false;

    recognition.onstart = () => {
      handlers.onStart?.();
    };

    recognition.onresult = (event: any) => {
      const results = event.results;
      if (!results) return;

      for (let index = event.resultIndex || 0; index < results.length; index += 1) {
        const result = results[index];
        const text = result?.[0]?.transcript?.trim();
        if (text && result.isFinal) finalTranscript += `${text} `;
      }

      if (finalTranscript.trim()) {
        handlers.onResult(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error !== 'aborted' || !stoppedByUser) {
        handlers.onError?.(getRecognitionErrorMessage(event.error));
      }
    };

    recognition.onend = () => {
      if (activeRecognition === recognition) activeRecognition = null;
      handlers.onEnd?.();
    };

    recognition.start();

    return {
      stop: () => {
        stoppedByUser = true;
        try {
          recognition.stop();
        } catch {
          try {
            recognition.abort();
          } catch {
            // The browser may already have ended the session.
          }
        }
      }
    };
  } catch (err: any) {
    activeRecognition = null;
    console.error('Failed to start speech recognition:', err);
    handlers.onError?.(getRecognitionErrorMessage(err?.error) || err?.message || 'Failed to initialize microphone');
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
