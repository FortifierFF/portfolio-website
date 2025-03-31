'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GameQuestion } from './use-game-state';

interface MixTheColorProps {
  question: GameQuestion;
  mixedColor: { r: number; g: number; b: number };
  updateMixedColor: (color: { r: number; g: number; b: number }) => void;
  onSubmit: (similarityPercentage: number) => void;
  selectedOption: number | null; // Will be used to store similarity percentage
  isCorrect: boolean | null;
}

export function MixTheColor({ 
  question, 
  mixedColor,
  updateMixedColor,
  onSubmit, 
  selectedOption, 
  isCorrect 
}: MixTheColorProps) {
  const [showTarget, setShowTarget] = useState(false);
  
  // Extract RGB values from the correct color
  const targetColor = {
    r: parseInt(question.correctColor.rgb.match(/\d+/g)![0]),
    g: parseInt(question.correctColor.rgb.match(/\d+/g)![1]),
    b: parseInt(question.correctColor.rgb.match(/\d+/g)![2])
  };
  
  // Handle slider change
  const handleColorChange = (component: 'r' | 'g' | 'b', value: number) => {
    updateMixedColor({
      ...mixedColor,
      [component]: value
    });
  };
  
  // Calculate similarity between colors
  const calculateSimilarity = (): number => {
    const rDiff = mixedColor.r - targetColor.r;
    const gDiff = mixedColor.g - targetColor.g;
    const bDiff = mixedColor.b - targetColor.b;
    
    const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    const maxDistance = Math.sqrt(3 * 255 * 255);
    
    const similarity = 100 * (1 - distance / maxDistance);
    
    return Math.round(similarity);
  };
  
  // Determine if we should show the answer
  const showAnswer = isCorrect !== null;
  
  // When component unmounts or question changes, reset state
  useEffect(() => {
    return () => {
      setShowTarget(false);
    };
  }, [question]);
  
  // Show solution
  const handleHint = () => {
    setShowTarget(true);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-xl text-gray-400 mb-4">
          Mix the colors to match the target color
        </h2>
        
        {/* Color Display Area */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
          {/* Your Mixed Color */}
          <div>
            <p className="text-gray-400 mb-2">Your Color</p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 rounded-lg border-4 border-gray-700 shadow-lg"
              style={{ backgroundColor: `rgb(${mixedColor.r}, ${mixedColor.g}, ${mixedColor.b})` }}
            />
            <p className="text-xs font-mono mt-2">
              rgb({mixedColor.r}, {mixedColor.g}, {mixedColor.b})
            </p>
          </div>
          
          {/* Target Color (only shown after hint or submission) */}
          {(showTarget || showAnswer) && (
            <>
              <div className="text-gray-400">
                <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              
              <div>
                <p className="text-gray-400 mb-2">Target Color</p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-32 h-32 rounded-lg border-4 border-gray-700 shadow-lg"
                  style={{ backgroundColor: question.correctColor.rgb }}
                />
                <p className="text-xs font-mono mt-2">
                  rgb({targetColor.r}, {targetColor.g}, {targetColor.b})
                </p>
              </div>
            </>
          )}
        </div>
        
        {/* RGB Sliders */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          {/* Red Slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-red-400 font-medium">Red</label>
              <span className="text-gray-300 font-mono">{mixedColor.r}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={mixedColor.r}
              onChange={(e) => handleColorChange('r', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(0, ${mixedColor.g}, ${mixedColor.b}), rgb(255, ${mixedColor.g}, ${mixedColor.b}))`,
              }}
              disabled={showAnswer}
            />
          </div>
          
          {/* Green Slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-green-400 font-medium">Green</label>
              <span className="text-gray-300 font-mono">{mixedColor.g}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={mixedColor.g}
              onChange={(e) => handleColorChange('g', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(${mixedColor.r}, 0, ${mixedColor.b}), rgb(${mixedColor.r}, 255, ${mixedColor.b}))`,
              }}
              disabled={showAnswer}
            />
          </div>
          
          {/* Blue Slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-blue-400 font-medium">Blue</label>
              <span className="text-gray-300 font-mono">{mixedColor.b}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={mixedColor.b}
              onChange={(e) => handleColorChange('b', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(${mixedColor.r}, ${mixedColor.g}, 0), rgb(${mixedColor.r}, ${mixedColor.g}, 255))`,
              }}
              disabled={showAnswer}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between gap-4 mt-8">
            <Button
              onClick={handleHint}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              disabled={showTarget || showAnswer}
            >
              Show Target
            </Button>
            
            <Button
              onClick={() => {
                const similarity = calculateSimilarity();
                onSubmit(similarity);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={showAnswer}
            >
              Submit
            </Button>
          </div>
        </div>
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
          <div className="text-xl font-bold mb-2">
            {isCorrect 
              ? '✅ Great job!' 
              : '❌ Not quite right'}
          </div>
          <div>
            Your match was <span className="font-bold">{selectedOption}%</span> similar to the target color.
            {isCorrect 
              ? ' You have a good eye for color!' 
              : ' Keep practicing to improve your color perception.'}
          </div>
        </motion.div>
      )}
    </div>
  );
} 