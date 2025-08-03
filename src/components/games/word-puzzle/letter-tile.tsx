'use client';

interface LetterTileProps {
  letter: string;
  onClick: () => void;
  isUsed: boolean;
}

// Component for individual letter tiles that can be clicked
export const LetterTile = ({ letter, onClick, isUsed }: LetterTileProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-12 h-12 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105
        ${isUsed 
          ? 'bg-green-600 text-white cursor-pointer shadow-lg hover:shadow-xl hover:bg-green-700' 
          : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-lg hover:shadow-xl'
        }
        border-2 ${isUsed ? 'border-green-400 hover:border-green-300' : 'border-blue-400 hover:border-blue-300'}
      `}
    >
      {letter}
    </button>
  );
}; 