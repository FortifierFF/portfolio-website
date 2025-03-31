'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Problem } from './use-game-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MathProblemProps {
  problem: Problem;
  onSubmit: (answer: string) => void;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isCorrect: boolean | null;
  timeRemaining?: number;
  useMultipleChoice?: boolean;
}

export function MathProblem({
  problem,
  onSubmit,
  userAnswer,
  setUserAnswer,
  isCorrect,
  timeRemaining,
  useMultipleChoice = false,
}: MathProblemProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Handle keydown events for number input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow numbers, backspace, delete, arrow keys
    if (
      !/^\d$/.test(e.key) && // Not a digit
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'Enter' &&
      e.key !== '-' // Allow negative numbers
    ) {
      e.preventDefault();
    }

    // Submit on Enter
    if (e.key === 'Enter' && userAnswer.length > 0) {
      handleSubmit();
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input (can be negative)
    if (/^-?\d*$/.test(e.target.value)) {
      setUserAnswer(e.target.value);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (userAnswer.length > 0) {
      onSubmit(userAnswer);
      setShowFeedback(true);
      
      // Hide feedback after 1 second
      setTimeout(() => {
        setShowFeedback(false);
      }, 1000);
    }
  };

  // Handle multiple choice selection
  const handleOptionClick = (option: number) => {
    setUserAnswer(option.toString());
    onSubmit(option.toString());
    setShowFeedback(true);

    // Hide feedback after 1 second
    setTimeout(() => {
      setShowFeedback(false);
    }, 1000);
  };

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !useMultipleChoice) {
      inputRef.current.focus();
    }
  }, [problem, useMultipleChoice]);

  return (
    <div className="w-full">
      {/* Problem Display */}
      <div className="bg-gray-800 rounded-lg p-8 mb-6 text-center relative overflow-hidden">
        {/* Timer Bar (if applicable) */}
        {timeRemaining !== undefined && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: '100%' }}
              animate={{ width: `${(timeRemaining / 60) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        {/* Math Problem */}
        <motion.div
          key={problem.question}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="text-4xl font-bold mb-6"
        >
          {problem.question}
        </motion.div>

        {/* User Input - Multiple Choice or Text Input */}
        {useMultipleChoice && problem.options ? (
          <div className="grid grid-cols-2 gap-4">
            {problem.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={cn(
                  "text-xl py-4 border border-gray-700",
                  isCorrect !== null && Number(userAnswer) === option
                    ? isCorrect
                      ? "bg-green-700 border-green-500"
                      : "bg-red-700 border-red-500"
                    : "bg-gray-700 hover:bg-gray-600"
                )}
                disabled={isCorrect !== null}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={userAnswer}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "bg-gray-700 text-white text-2xl py-3 px-4 rounded-lg w-full max-w-xs text-center focus:outline-none focus:ring-2",
                isCorrect === null
                  ? "focus:ring-blue-500"
                  : isCorrect
                  ? "ring-2 ring-green-500 bg-green-900/30"
                  : "ring-2 ring-red-500 bg-red-900/30"
              )}
              placeholder="Your answer"
              disabled={isCorrect !== null}
            />
            <Button
              onClick={handleSubmit}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              disabled={userAnswer.length === 0 || isCorrect !== null}
            >
              Submit
            </Button>
          </div>
        )}
      </div>

      {/* Feedback Animation */}
      <AnimatePresence>
        {showFeedback && isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={cn(
              "text-center text-xl font-bold py-4 rounded-lg mb-4",
              isCorrect ? "text-green-400" : "text-red-400"
            )}
          >
            {isCorrect ? "Correct!" : `Wrong! The answer is ${problem.answer}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 