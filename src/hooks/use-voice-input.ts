import { useState, useCallback } from 'react';

interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  transcript: string;
  resetTranscript: () => void;
}

export const useVoiceInput = (): UseVoiceInputReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Check if speech recognition is supported
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const startListening = useCallback(async () => {
    if (!isSupported) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    try {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      recognitionInstance.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      throw error;
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    resetTranscript
  };
}; 