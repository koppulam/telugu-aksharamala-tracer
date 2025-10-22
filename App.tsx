
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { achulu, hallulu } from './constants';
import TracingCanvas, { TracingCanvasHandle } from './components/TracingCanvas';
import Controls from './components/Controls';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import LetterPickerModal from './components/LetterPickerModal';
import { useToast } from './components/Toast';

const App: React.FC = () => {
  const [setType, setSetType] = useState<'achulu' | 'hallulu'>('achulu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<TracingCanvasHandle>(null);
  const { speak } = useSpeechSynthesis();
  const { showToast } = useToast();
  const [pickerOpen, setPickerOpen] = useState(false);

  const letters = setType === 'achulu' ? achulu : hallulu;
  const currentLetter = letters[currentIndex];

  useEffect(() => {
    canvasRef.current?.clear();
    // Temporarily disable TTS auto speak until audio files are provided
    // speak(currentLetter.phonetic);
  }, [currentIndex, setType]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % letters.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + letters.length) % letters.length);
  };

  const handleClear = useCallback(() => {
    canvasRef.current?.clear();
  }, []);

  const handleSpeak = useCallback(() => {
    showToast('Coming soon: recorded pronunciation', 'info');
    // speak(currentLetter.phonetic);
  }, [showToast]);

  const handleHint = useCallback(() => {
    if (currentLetter.path && currentLetter.path.length > 0) {
      canvasRef.current?.animateTrace(currentLetter.path);
    } else {
      showToast('Hint coming soon for this letter', 'warning');
    }
  }, [currentLetter, showToast]);

  const switchSet = (type: 'achulu' | 'hallulu') => {
    setSetType(type);
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-[100svh] w-full flex flex-col items-center justify-center p-3 sm:p-4 text-center bg-gradient-to-b from-sky-50 to-blue-50 text-slate-800 overflow-x-hidden">
      <header className="mb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-transparent bg-clip-text drop-shadow">Telugu Aksharamala</h1>
        <p className="text-lg sm:text-xl text-slate-600 mt-2">Trace the letters and learn!</p>

        <div className="mt-4 inline-flex rounded-2xl overflow-hidden border-2 border-sky-300 bg-white shadow">
          <button
            className={`px-4 py-2 text-sm font-bold ${setType === 'achulu' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => switchSet('achulu')}
          >
            Achulu
          </button>
          <button
            className={`px-4 py-2 text-sm font-bold ${setType === 'hallulu' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => switchSet('hallulu')}
          >
            Hallulu
          </button>
        </div>
      </header>
      
      <main className="flex flex-col items-center w-full">
        <div 
          className="relative w-[90vw] max-w-[340px] aspect-square bg-white rounded-3xl shadow-2xl border-4 border-sky-200"
          style={{ touchAction: 'none' }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-sky-100 text-[40vw] sm:text-[250px] font-extrabold select-none pointer-events-none">
            {currentLetter?.letter}
          </div>
          <TracingCanvas ref={canvasRef} width={320} height={320} />
        </div>
        <div className="mt-4 text-2xl sm:text-3xl font-extrabold text-orange-500 drop-shadow">
          {currentLetter?.letter} - {currentLetter?.name}
        </div>
      </main>

      <footer className="mt-6 sm:mt-8">
        <Controls 
          onPrevious={handlePrevious} 
          onNext={handleNext} 
          onClear={handleClear} 
          onSpeak={handleSpeak}
          onHint={handleHint}
          onPick={() => setPickerOpen(true)}
        />
      </footer>

      <LetterPickerModal
        open={pickerOpen}
        achulu={achulu}
        hallulu={hallulu}
        activeSet={setType}
        onClose={() => setPickerOpen(false)}
        onTabChange={(t) => setSetType(t)}
        onSelect={(t, i) => {
          setSetType(t);
          setCurrentIndex(i);
          setPickerOpen(false);
        }}
      />
    </div>
  );
};

export default App;
