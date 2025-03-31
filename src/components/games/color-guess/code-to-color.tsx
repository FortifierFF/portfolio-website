'use client';

import { motion } from 'framer-motion';
import { ColorOption, GameQuestion, ColorFormat } from './use-game-state';
import { cn } from '@/lib/utils';

interface CodeToColorProps {
  question: GameQuestion;
  onSelect: (index: number) => void;
  selectedOption: number | null;
  isCorrect: boolean | null;
}

export function CodeToColor({ 
  question, 
  onSelect, 
  selectedOption, 
  isCorrect 
}: CodeToColorProps) {
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
      {/* Color Code Display */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-lg inline-block"
        >
          <h2 className="text-xl text-gray-400 mb-2">Which color matches this code?</h2>
          <div className="font-mono text-3xl font-bold bg-gray-900 p-4 rounded-md">
            {getDisplayCode(question.correctColor, question.format)}
          </div>
        </motion.div>
      </div>

      {/* Color Options Grid */}
      <div className="grid grid-cols-2 gap-6">
        {question.options?.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              borderColor: showAnswer ? 
                (index === correctIndex ? 'rgb(74, 222, 128)' : // Green for correct
                 selectedOption === index ? 'rgb(248, 113, 113)' : // Red for wrong selection
                 'transparent') : 
                'transparent'
            }}
            transition={{ delay: index * 0.1 }}
            disabled={selectedOption !== null}
            onClick={() => onSelect(index)}
            className={cn(
              "h-32 sm:h-40 rounded-lg transition-all relative overflow-hidden",
              "border-4",
              showAnswer ? (
                index === correctIndex ? "border-green-400" :
                selectedOption === index ? "border-red-400" :
                "border-transparent"
              ) : (
                "border-transparent hover:border-blue-400"
              ),
              selectedOption === null ? "cursor-pointer" : "cursor-default"
            )}
            style={{ backgroundColor: option.rgb }}
          >
            {/* Feedback Icons */}
            {showAnswer && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                {index === correctIndex && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-green-500 rounded-full p-2"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
                {selectedOption === index && index !== correctIndex && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-red-500 rounded-full p-2"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            ? 'Correct! You identified the right color.' 
            : `Wrong! The correct color was option ${correctIndex! + 1}.`}
        </motion.div>
      )}
    </div>
  );
} 