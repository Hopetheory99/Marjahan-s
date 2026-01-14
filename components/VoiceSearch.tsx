import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface VoiceSearchProps {
  onResult: (transcript: string, confidence: number) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onStop?: () => void;
  language?: string;
  continuous?: boolean;
  className?: string;
  placeholder?: string;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onResult,
  onError,
  onStart,
  onStop,
  language = 'en-US',
  continuous = false,
  className = '',
  placeholder = 'Click to speak...',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Check browser support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        onStart?.();
        startAudioVisualization();
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let confidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            confidence = result[0].confidence;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);

        if (finalTranscript) {
          onResult(finalTranscript, confidence);
          if (!continuous) {
            stopListening();
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'Speech recognition error occurred';

        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied.';
            setPermissionGranted(false);
            break;
          case 'network':
            errorMessage = 'Network error. Check your connection.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed.';
            break;
        }

        onError?.(errorMessage);
        stopListening();
      };

      recognition.onend = () => {
        setIsListening(false);
        onStop?.();
        stopAudioVisualization();
      };
    } else {
      setIsSupported(false);
      onError?.('Speech recognition is not supported in this browser');
    }

    return () => {
      stopListening();
      stopAudioVisualization();
    };
  }, [language, continuous, onResult, onError, onStart, onStop]);

  // Request microphone permission
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream immediately
    } catch (error) {
      setPermissionGranted(false);
      onError?.('Microphone permission denied');
    }
  }, [onError]);

  // Start audio visualization
  const startAudioVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255); // Normalize to 0-1

        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    } catch (error) {
      console.warn('Audio visualization not available:', error);
    }
  }, []);

  // Stop audio visualization
  const stopAudioVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      onError?.('Speech recognition is not supported in this browser');
      return;
    }

    if (permissionGranted === false) {
      onError?.('Microphone permission is required for voice search');
      return;
    }

    if (permissionGranted === null) {
      requestPermission().then(() => {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      });
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  }, [isSupported, permissionGranted, onError, requestPermission]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  if (!isSupported) {
    return (
      <div
        className={`flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🎤</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Voice search is not supported in this browser
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Try using Chrome, Edge, or Safari for voice search
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Voice Search Button */}
      <button
        onClick={toggleListening}
        disabled={permissionGranted === false}
        className={`relative flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-gold/30 ${
          isListening
            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 animate-pulse'
            : permissionGranted === false
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-not-allowed'
              : 'bg-brand-ivory dark:bg-dark-surface border-brand-gold/50 hover:border-brand-gold hover:bg-brand-cream dark:hover:bg-dark-surface-elevated'
        }`}
        aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
      >
        {/* Microphone Icon */}
        <div className="relative">
          <svg
            className={`w-8 h-8 transition-all duration-300 ${
              isListening
                ? 'text-red-600 scale-110'
                : permissionGranted === false
                  ? 'text-gray-400'
                  : 'text-brand-charcoal dark:text-dark-text'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>

          {/* Audio Level Indicator */}
          {isListening && (
            <div className="absolute -inset-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-1 bg-red-500 rounded-full animate-pulse"
                  style={{
                    height: `${20 + audioLevel * 30}px`,
                    left: `${8 + i * 8}px`,
                    bottom: '0',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status Text */}
        <div className="ml-4 text-left flex-1">
          <div
            className={`font-medium transition-colors ${
              isListening
                ? 'text-red-700 dark:text-red-400'
                : permissionGranted === false
                  ? 'text-gray-500'
                  : 'text-brand-charcoal dark:text-dark-text'
            }`}
          >
            {isListening
              ? 'Listening...'
              : permissionGranted === false
                ? 'Permission Required'
                : 'Voice Search'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isListening
              ? 'Speak now or click to stop'
              : permissionGranted === false
                ? 'Allow microphone access'
                : placeholder}
          </div>
        </div>

        {/* Permission Status */}
        {permissionGranted === false && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              requestPermission();
            }}
            className="ml-2 px-3 py-1 text-xs bg-brand-gold text-brand-charcoal rounded-full hover:bg-brand-gold-light transition-colors"
          >
            Allow
          </button>
        )}
      </button>

      {/* Transcript Display */}
      {(transcript || isListening) && (
        <div className="mt-4 p-4 bg-white dark:bg-dark-surface border border-brand-cream dark:border-dark-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-brand-charcoal dark:text-dark-text">
              {isListening ? 'Listening...' : 'Heard:'}
            </span>
            {transcript && !isListening && (
              <button
                onClick={clearTranscript}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear
              </button>
            )}
          </div>

          <div
            className={`text-sm ${
              isListening
                ? 'text-red-600 dark:text-red-400 italic'
                : 'text-brand-charcoal dark:text-dark-text'
            }`}
          >
            {transcript || 'Say something...'}
          </div>

          {/* Confidence Indicator */}
          {transcript && !isListening && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div
                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(20, Math.random() * 100)}%` }} // Mock confidence
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">High confidence</span>
            </div>
          )}
        </div>
      )}

      {/* Voice Commands Help */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <div className="w-4 h-4 text-blue-600 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Voice Commands</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Try: "Show me diamond rings" • "Find gold necklaces" • "Search for earrings under
              $500"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSearch;
