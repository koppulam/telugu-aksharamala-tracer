import React from 'react';
import type { TeluguLetter } from '../types';

interface LetterPickerModalProps {
  open: boolean;
  achulu: TeluguLetter[];
  hallulu: TeluguLetter[];
  activeSet: 'achulu' | 'hallulu';
  onClose: () => void;
  onSelect: (setType: 'achulu' | 'hallulu', index: number) => void;
  onTabChange: (setType: 'achulu' | 'hallulu') => void;
}

const LetterPickerModal: React.FC<LetterPickerModalProps> = ({ open, achulu, hallulu, activeSet, onClose, onSelect, onTabChange }) => {
  if (!open) return null;
  const setData = activeSet === 'achulu' ? achulu : hallulu;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85svh] bg-white rounded-2xl shadow-xl border-2 border-sky-200 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-4 py-3 text-lg font-bold">Pick a Letter</div>

        <div className="p-4 overflow-auto">
          <div className="mb-4 inline-flex rounded-lg overflow-hidden border border-slate-300 bg-white">
            <button
              className={`px-4 py-2 text-sm font-semibold ${activeSet === 'achulu' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              onClick={() => onTabChange('achulu')}
            >Achulu</button>
            <button
              className={`px-4 py-2 text-sm font-semibold ${activeSet === 'hallulu' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              onClick={() => onTabChange('hallulu')}
            >Hallulu</button>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {setData.map((l, i) => (
              <button
                key={`${activeSet}-${i}`}
                className="aspect-square rounded-xl border-2 border-slate-200 bg-sky-50 hover:bg-sky-100 text-2xl sm:text-3xl font-extrabold text-slate-700 flex items-center justify-center transition-transform hover:scale-105"
                onClick={() => onSelect(activeSet, i)}
                aria-label={`Select ${l.name}`}
              >
                {l.letter}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterPickerModal;


