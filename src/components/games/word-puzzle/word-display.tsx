'use client';

interface WordDisplayProps {
  word: string;
  targetLength: number;
  onLetterClick?: (index: number) => void;
}

// Component to display the user's current word input with placeholder slots
export const WordDisplay = ({ word, targetLength, onLetterClick }: WordDisplayProps) => {
  // Create array of letters and empty slots
  const displaySlots = [];
  
  for (let i = 0; i < targetLength; i++) {
    if (i < word.length) {
      // Show actual letter - clickable for deselection
      displaySlots.push(
        <button 
          key={i}
          onClick={() => onLetterClick?.(i)}
          className="w-12 h-12 bg-blue-600 border-2 border-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg hover:bg-blue-700 hover:border-blue-300 transition-colors cursor-pointer"
          title="Click to remove this letter"
        >
          {word[i]}
        </button>
      );
    } else {
      // Show empty slot
      displaySlots.push(
        <div 
          key={i}
          className="w-12 h-12 bg-gray-700 border-2 border-gray-600 rounded-lg flex items-center justify-center text-gray-500 font-bold text-xl"
        >
          _
        </div>
      );
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-200 mb-4 text-center">
        Your Word
      </h3>
      <div className="flex justify-center gap-2">
        {displaySlots}
      </div>
      <p className="text-center text-gray-400 mt-3 text-sm">
        {word.length}/{targetLength} letters
      </p>
    </div>
  );
}; 