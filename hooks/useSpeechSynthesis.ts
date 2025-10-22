
import { useState, useEffect, useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const setVoiceOnLoad = () => {
        const voices = window.speechSynthesis.getVoices();
        // Prioritize a native Telugu voice if available
        const teluguVoice = voices.find(v => v.lang === 'te-IN');
        setVoice(teluguVoice || voices.find(v => v.default) || voices[0]);
      };

      // Voices can load asynchronously.
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoiceOnLoad();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoiceOnLoad;
      }
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      console.warn("Speech synthesis is not supported by this browser.");
      return;
    }
    if (!voice) {
      console.warn("No speech synthesis voice has been loaded yet.");
      return;
    }
    
    // Cancel any speech that is currently in progress to prevent overlap.
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.pitch = 1;
    utterance.rate = 0.8; // Slightly slower for better clarity for kids
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
  }, [voice, isSupported]);

  return { speak, isSupported };
};
