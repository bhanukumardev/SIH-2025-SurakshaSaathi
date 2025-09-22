'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface SpeechInputProps {
  onResult: (transcript: string) => void;
  disabled?: boolean;
  className?: string;
}

export function SpeechInput({ onResult, disabled = false, className = '' }: SpeechInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-IN';

        recognitionInstance.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onResult(transcript);
        };

        recognitionInstance.onerror = (event: any) => {
          setError(event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setIsSupported(false);
      }
    }
  }, [onResult]);

  const startListening = () => {
    if (recognition && !isListening && !disabled) {
      try {
        recognition.start();
      } catch (error) {
        setError('Speech recognition failed to start');
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={className}>
      <Button
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      {isListening && (
        <div className="text-sm text-blue-600 mt-1 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          Listening... Speak now
        </div>
      )}
      {error && (
        <div className="text-sm text-red-600 mt-1">
          Speech recognition error: {error}
        </div>
      )}
    </div>
  );
}
