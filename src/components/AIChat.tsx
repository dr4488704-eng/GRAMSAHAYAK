import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  HelpCircle, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ChatMessage } from '../types';
import { useApp } from '../context/AppContext';
import { startSpeechRecognition, speakText, stopSpeaking, isSpeechRecognitionSupported, isSpeechSynthesisSupported } from '../utils/speech';

export const AIChat: React.FC = () => {
  const { language, t, profile, schemes } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Namaste ${profile.name}! I am GramSahay Assistant. You can ask me about government schemes, eligibility requirements, documents, and application procedures in English, Telugu, Tamil, or Hindi.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    t('q1'),
    t('q2'),
    t('q3'),
    t('q4')
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language,
          profile,
          schemes
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: ChatMessage = {
          id: 'msg-reply-' + Date.now(),
          sender: 'assistant',
          text: data.reply || 'I could not process that question. Please check official government portals.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Assistant endpoint error');
      }
    } catch (err) {
      // Local deterministic fallback
      const fallbackReply = generateLocalFallbackReply(textToSend, profile, schemes, language);
      const assistantMessage: ChatMessage = {
        id: 'msg-fallback-' + Date.now(),
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalFallbackReply = (
    query: string, 
    userProfile: any, 
    schemeList: any[], 
    lang: string
  ): string => {
    const q = query.toLowerCase();

    if (q.includes('farmer') || q.includes('kisan') || q.includes('రైతు') || q.includes('किसान') || q.includes('விவசாயி')) {
      return `For farmers with landholdings, key verified schemes include:\n• PM-KISAN: ₹6,000/year direct cash transfer.\n• PM Kisan Maandhan: Assured ₹3,000/month pension at 60.\n• YSR Rythu Bharosa (Andhra Pradesh): ₹13,500/year assistance.\n\nDocuments required: Aadhaar, Land Patta/RoR passbook, and Aadhaar-linked Bank account.`;
    }

    if (q.includes('document') || q.includes('పత్రాలు') || q.includes('दस्तावेज') || q.includes('ஆவணங்கள்')) {
      return `Standard required documents across welfare schemes:\n1. Aadhaar Card (primary identity proof)\n2. Active Bank Passbook linked to NPCI/DBT\n3. Income Certificate or Ration Card\n4. Land records (RoR/Patta) if applying for agricultural schemes\n5. Passport size photographs.`;
    }

    if (q.includes('housing') || q.includes('house') || q.includes('awas') || q.includes('ఇల్లు') || q.includes('मकान') || q.includes('வீடு')) {
      return `Under Pradhan Mantri Awas Yojana - Gramin (PMAY-G), financial assistance of ₹1,20,000 (plains) or ₹1,30,000 (hilly areas) is provided to rural houseless families, plus ₹12,000 for toilet construction and 95 days MGNREGS wage labor support.`;
    }

    if (q.includes('scholarship') || q.includes('student') || q.includes('చదువు') || q.includes('विद्यार्थी') || q.includes('மாணவர்')) {
      return `For students, the Post-Matric Scholarship Scheme covers 100% compulsory tuition fees along with monthly maintenance allowance for Class 11, degree, and postgraduate courses for SC/ST/OBC students with family income under ₹2.5 Lakh/year.`;
    }

    return `Based on your profile as a ${userProfile.occupation} in ${userProfile.state}, you may be eligible for multiple schemes. Please visit the "Schemes for You" tab to view personalized deterministic matches. For complete details, always verify with the respective official government portal.`;
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceError(t('voice_unsupported'));
      setTimeout(() => setVoiceError(null), 4000);
      return;
    }

    setVoiceError(null);
    setIsListening(true);

    recognitionRef.current = startSpeechRecognition(language, {
      onStart: () => setIsListening(true),
      onResult: (transcript) => {
        recognitionRef.current = null;
        setIsListening(false);
        setInputText(transcript);
        handleSend(transcript);
      },
      onError: (err) => {
        recognitionRef.current = null;
        setIsListening(false);
        setVoiceError(err);
        setTimeout(() => setVoiceError(null), 4000);
      },
      onEnd: () => {
        recognitionRef.current = null;
        setIsListening(false);
      }
    });
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      stopSpeaking();
      speakText(text, language);
      setSpeakingMsgId(msgId);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-[#1b4332] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white border border-[#40916c]">
            <Sparkles className="w-4 h-4 text-[#d8f3dc]" />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-tight">{t('assistant')}</h3>
            <p className="text-[11px] text-[#d8f3dc]">
              Plain scheme explanation grounded in verified data
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            stopSpeaking();
            setMessages([
              {
                id: 'msg-welcome-reset',
                sender: 'assistant',
                text: `Conversation cleared. Ask me any question about government schemes!`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }}
          className="p-1.5 text-[#d8f3dc] hover:text-white hover:bg-[#235841] rounded transition-colors"
          title="Reset chat"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Questions Strip */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-gray-500 shrink-0">Try:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-white border border-gray-200 hover:border-[#2d6a4f] hover:text-[#1b4332] rounded-full text-xs text-gray-700 whitespace-nowrap shadow-2xs transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fcfbf9]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeaking = speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  GS
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-lg p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#1b4332] text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-200 shadow-2xs rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-black/5 text-[10px] opacity-75">
                  <span>{msg.timestamp}</span>
                  {!isUser && isSpeechSynthesisSupported() && (
                    <button
                      onClick={() => handleToggleSpeak(msg.id, msg.text)}
                      className="p-1 hover:text-[#1b4332] flex items-center gap-1 font-medium transition-colors"
                      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3 text-[#b91c1c]" />
                          <span className="text-[#b91c1c]">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-[#2d6a4f]" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg p-3 w-fit">
            <div className="w-2 h-2 rounded-full bg-[#2d6a4f] animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-[#2d6a4f] animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-[#2d6a4f] animate-bounce [animation-delay:-0.3s]" />
            <span>Formulating verified scheme response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice listening strip / error */}
      {isListening && (
        <div className="bg-[#d8f3dc] border-t border-[#b7e4c7] px-4 py-2 text-xs text-[#1b4332] font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2d6a4f] animate-ping" />
            <span>{t('listening')}</span>
          </div>
          <button 
            onClick={() => setIsListening(false)}
            className="text-[11px] underline"
          >
            Cancel
          </button>
        </div>
      )}

      {voiceError && (
        <div className="bg-red-50 border-t border-red-200 px-4 py-1.5 text-xs text-[#b91c1c]">
          {voiceError}
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('ask_placeholder')}
          className="flex-1 text-xs sm:text-sm p-2.5 bg-[#f8f9fa] border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6a4f] focus:outline-none"
        />

        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-2.5 rounded-lg border transition-colors ${
            isListening 
              ? 'bg-[#b91c1c] text-white border-[#b91c1c] animate-pulse' 
              : 'bg-[#f8f9fa] text-gray-700 border-gray-300 hover:bg-[#d8f3dc] hover:text-[#1b4332]'
          }`}
          title={t('speak')}
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white rounded-lg disabled:opacity-40 transition-colors shadow-xs"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
