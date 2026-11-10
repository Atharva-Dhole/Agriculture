import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, X, Bot, Sparkles, AlertCircle } from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { translations } from '../i18n/translations';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  profile: FarmerProfile;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  profile
}) => {
  const t = translations[language];
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      // Initialize Web Speech API Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'mr' ? 'mr-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
          setRecognitionError(null);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          setInputQuery(text);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setRecognitionError(
              language === 'mr' 
                ? 'मायक्रोफोन परवानगी नाकारली गेली आहे. कृपया ब्राउझरमध्ये परवानगी द्या किंवा खाली प्रश्न टाइप करा.' 
                : 'Microphone permission denied. Please allow mic or type your question below.'
            );
          } else {
            setRecognitionError(
              language === 'mr' 
                ? 'आवाज स्पष्ट ऐकू आला नाही. कृपया पुन्हा बोला किंवा टाइप करा.' 
                : 'Could not capture voice clearly. Please try again or type below.'
            );
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, [language]);

  const toggleListening = () => {
    stopSpeaking();
    if (!recognitionRef.current) {
      setRecognitionError(
        language === 'mr'
          ? 'तुमच्या ब्राउझरमध्ये व्हॉइस इनपुट समर्थित नाही. कृपया खाली प्रश्न टाइप करा.'
          : 'Speech recognition not supported in this browser. Please type below.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setRecognitionError(null);
      try {
        recognitionRef.current.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start error:', e);
      }
    }
  };

  const handleAsk = async (queryToAsk?: string) => {
    const q = queryToAsk || inputQuery || transcript;
    if (!q.trim()) return;

    setIsLoading(true);
    setResponse('');
    stopSpeaking();

    try {
      const res = await fetch('/api/ai/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          language,
          farmerContext: {
            village: profile.village,
            district: profile.district,
            land: `${profile.landArea} ${profile.landUnit}`,
            crops: profile.mainCrops.join(', '),
            soilType: profile.soilType
          }
        })
      });

      const data = await res.json();
      if (data.reply) {
        setResponse(data.reply);
        speakText(data.reply);
      } else {
        setResponse(language === 'mr' ? 'माहिती उपलब्ध होऊ शकली नाही.' : 'No advice found.');
      }
    } catch (err) {
      console.error('Ask error:', err);
      setResponse(
        language === 'mr' 
          ? 'माहिती मिळविण्यात अडचण आली. कृपया तुमचे इंटरनेट कनेक्शन तपासा.' 
          : 'Failed to connect. Please check your network connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    stopSpeaking();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'mr' ? 'mr-IN' : 'en-IN';
      utterance.rate = 0.95; // slightly slower for rural clarity
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  const sampleQuestions = [
    t.q1,
    t.q2,
    t.q3,
    t.q4
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-600/80 flex items-center justify-center text-amber-300 border border-emerald-500">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="font-bold text-base flex items-center gap-1.5">
                <span>{t.voiceTitle}</span>
                <Sparkles size={14} className="text-amber-300" />
              </h2>
              <p className="text-xs text-emerald-100">{t.voiceSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 text-emerald-200 hover:text-white rounded-full hover:bg-emerald-600/50 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          
          {/* Animated Microphone Area */}
          <div className="flex flex-col items-center justify-center py-5 bg-emerald-50/70 rounded-2xl border border-emerald-100">
            <div className="relative">
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60"></div>
                  <div className="absolute -inset-3 rounded-full bg-emerald-300 animate-pulse opacity-40"></div>
                </>
              )}
              <button
                onClick={toggleListening}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                  isListening ? 'bg-rose-600 animate-bounce' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                {isListening ? <MicOff size={34} /> : <Mic size={34} />}
              </button>
            </div>

            <p className="mt-3 text-sm font-semibold text-emerald-950 text-center">
              {isListening ? t.listening : t.tapToSpeak}
            </p>
            <p className="text-xs text-stone-500">
              {language === 'mr' ? 'भाषा: मराठी (mr-IN)' : 'Language: English (en-IN)'}
            </p>

            {transcript && (
              <div className="mt-3 px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-xs text-stone-700 italic max-w-xs text-center">
                "{transcript}"
              </div>
            )}
          </div>

          {recognitionError && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <span>{recognitionError}</span>
            </div>
          )}

          {/* Response Box */}
          {isLoading ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-medium text-emerald-900">
                {language === 'mr' ? 'कृषी मित्र उत्तर तयार करत आहे...' : 'Krishi Mitra is formulating the best advice...'}
              </p>
            </div>
          ) : response ? (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <Bot size={15} />
                  {language === 'mr' ? 'कृषी सल्ला:' : 'Agricultural Advice:'}
                </span>
                <button
                  onClick={() => (isSpeaking ? stopSpeaking() : speakText(response))}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    isSpeaking 
                      ? 'bg-amber-100 text-amber-900 border-amber-300' 
                      : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX size={14} className="text-amber-700" />
                      <span>{language === 'mr' ? 'थांबवा' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} className="text-emerald-700" />
                      <span>{language === 'mr' ? 'ऐका' : 'Listen'}</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-stone-800 whitespace-pre-line leading-relaxed font-sans">
                {response}
              </p>
            </div>
          ) : null}

          {/* Sample Spoken Queries */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 mb-2">{t.suggestedQuestions}</h4>
            <div className="flex flex-wrap gap-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(q);
                    handleAsk(q);
                  }}
                  className="text-xs text-left bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 px-3 py-1.5 rounded-full border border-stone-200 transition-colors"
                >
                  🌾 {q}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Text Input Fallback Footer */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder={t.typeQuestionFallback}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-stone-100 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Send size={15} />
            <span>{t.sendQuestion}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
