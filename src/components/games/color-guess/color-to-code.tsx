'use client';

import { motion } from 'framer-motion';
import { ColorOption, GameQuestion, ColorFormat } from './use-game-state';
import { cn } from '@/lib/utils';

interface ColorToCodeProps {
  question: GameQuestion;
  onSelect: (index: number) => void;
  selectedOption: number | null;
  isCorrect: boolean | null;
}

export function ColorToCode({ 
  question, 
  onSelect, 
  selectedOption, 
  isCorrect 
}: ColorToCodeProps) {
  // Get the color code to display based on the format
  const getDisplayCode = (color: ColorOption, format: ColorFormat) => {
    return format === 'rgb' ? color.rgb : 
           format === 'hex' ? color.hex : 
           color.hsl;
  };

  // Determine if we should show the answer
  const showAnswer = isCorrect !== null;

  // Find the index of the correct option for highlighting
  const correctIndex = question.options?.findIndex(
    option => option === question.correctColor
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Color Display */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <h2 className="text-xl text-gray-400 mb-4">Which code matches this color?</h2>
          <div 
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-lg border-4 border-gray-700"
            style={{ backgroundColor: question.correctColor.rgb }}
          />
        </motion.div>
      </div>

      {/* Code Options */}
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0 
            }}
            transition={{ delay: index * 0.1 }}
            disabled={selectedOption !== null}
            onClick={() => onSelect(index)}
            className={cn(
              "py-4 px-6 rounded-lg font-mono text-lg transition-all relative",
              "border-2",
              showAnswer ? (
                index === correctIndex ? "bg-green-900/30 border-green-400 text-green-300" :
                selectedOption === index ? "bg-red-900/30 border-red-400 text-red-300" :
                "bg-gray-800 border-gray-700 text-gray-400"
              ) : (
                "bg-gray-800 border-gray-700 text-white hover:border-blue-400 hover:bg-gray-700"
              ),
              selectedOption === null ? "cursor-pointer" : "cursor-default"
            )}
          >
            {getDisplayCode(option, question.format)}

            {/* Feedback Icons */}
            {showAnswer && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {index === correctIndex && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500 rounded-full p-1"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
                {selectedOption === index && index !== correctIndex && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-red-500 rounded-full p-1"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.div>
                )}
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Feedback Message */}
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mt-6 p-4 rounded-lg ${
            isCorrect ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
          }`}
        >
          {isCorrect 
            ? 'Correct! You identified the right code.' 
            : `Wrong! The correct code was option ${correctIndex! + 1}.`}
        </motion.div>
      )}
    </div>
  );
} 