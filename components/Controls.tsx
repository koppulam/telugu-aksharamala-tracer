
import React from 'react';

interface ControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onClear: () => void;
  onSpeak: () => void;
  onHint: () => void;
  onPick: () => void;
}

const BackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ForwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const ClearIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
  </svg>
);

const SpeakIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

const HintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a7 7 0 00-4.95 11.95c.64.64 1.24 1.71 1.54 2.64.12.35.45.58.82.58h5.18c.37 0 .7-.23.82-.58.3-.93.9-2 1.54-2.64A7 7 0 0012 2zm-2 18a1 1 0 000 2h4a1 1 0 100-2H10z" />
  </svg>
);

const GridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
  </svg>
);


const ControlButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; ariaLabel: string }> = ({ onClick, children, className, ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-transform duration-150 ease-in-out hover:scale-110 active:scale-100 focus:outline-none focus:ring-4 ${className}`}
  >
    {children}
  </button>
);


const Controls: React.FC<ControlsProps> = ({ onPrevious, onNext, onClear, onSpeak, onHint, onPick }) => {
  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-3">
      <ControlButton onClick={onPrevious} className="bg-orange-500 focus:ring-orange-300" ariaLabel="Previous letter">
        <BackIcon className="w-7 h-7 md:w-8 md:h-8"/>
      </ControlButton>
      <ControlButton onClick={onPick} className="bg-pink-500 focus:ring-pink-300" ariaLabel="Pick a letter">
        <GridIcon className="w-7 h-7 md:w-8 md:h-8"/>
      </ControlButton>
      <ControlButton onClick={onClear} className="bg-red-500 focus:ring-red-300" ariaLabel="Clear drawing">
        <ClearIcon className="w-7 h-7 md:w-8 md:h-8"/>
      </ControlButton>
      <ControlButton onClick={onHint} className="bg-purple-500 focus:ring-purple-300" ariaLabel="Show hint">
        <HintIcon className="w-7 h-7 md:w-8 md:h-8"/>
      </ControlButton>
      <ControlButton onClick={onSpeak} className="bg-green-500 focus:ring-green-300" ariaLabel="Speak letter sound">
        <SpeakIcon className="w-7 h-7 md:w-8 md:h-8"/>
      </ControlButton>
      <ControlButton onClick={onNext} className="bg-orange-500 focus:ring-orange-300" ariaLabel="Next letter">
        <ForwardIcon className="w-7 h-7 md:w-8 md:h-8"/>
      </ControlButton>
    </div>
  );
};

export default Controls;
