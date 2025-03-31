'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Difficulty, 
  OperationType, 
  GameMode, 
  GameSettings as GameSettingsType 
} from './use-game-state';

interface GameSettingsProps {
  settings: GameSettingsType;
  onSettingsChange: (settings: GameSettingsType) => void;
  onStartGame: () => void;
}

export function GameSettings({ 
  settings, 
  onSettingsChange, 
  onStartGame 
}: GameSettingsProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Update specific settings
  const updateSettings = <K extends keyof GameSettingsType>(
    key: K,
    value: GameSettingsType[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  // Toggle operation types
  const toggleOperation = (operation: OperationType) => {
    const newOperations = [...settings.operations];
    
    if (newOperations.includes(operation)) {
      // Don't allow removing the last operation
      if (newOperations.length > 1) {
        newOperations.splice(newOperations.indexOf(operation), 1);
      }
    } else {
      newOperations.push(operation);
    }
    
    updateSettings('operations', newOperations);
  };

  // Array of all difficulty levels - using string literals instead of enums
  const difficultyLevels: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  
  // Array of all game modes - using string literals instead of enums
  const gameModes: GameMode[] = ['timed', 'survival', 'precision'];
  
  // Array of all operation types - using string literals instead of enums
  const operationTypes: OperationType[] = [
    'addition',
    'subtraction',
    'multiplication',
    'division'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-800 rounded-lg p-6 w-full max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Game Settings</h2>
      
      {/* Difficulty Selection */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-300">Difficulty</label>
        <div className="grid grid-cols-4 gap-2">
          {difficultyLevels.map((diff) => (
            <button
              key={diff}
              onClick={() => updateSettings('difficulty', diff)}
              className={`py-2 rounded-md text-sm font-medium transition-colors
                ${settings.difficulty === diff
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Game Mode Selection */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-300">Game Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {gameModes.map((mode) => (
            <button
              key={mode}
              onClick={() => updateSettings('gameMode', mode)}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
                ${settings.gameMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Operation Types */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-300">Operations</label>
        <div className="grid grid-cols-4 gap-2">
          {operationTypes.map((op) => (
            <button
              key={op}
              onClick={() => toggleOperation(op)}
              className={`py-2 rounded-md text-sm font-medium transition-colors
                ${settings.operations.includes(op)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {op === 'addition' ? '+' : 
               op === 'subtraction' ? '-' : 
               op === 'multiplication' ? '×' : '÷'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className="flex items-center justify-center w-full text-sm text-gray-400 hover:text-gray-300 mb-4"
      >
        {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Settings
        <svg
          className={`w-4 h-4 ml-1 transform transition-transform ${
            isAdvancedOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {/* Advanced Settings */}
      {isAdvancedOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-6 space-y-4"
        >
          {/* Duration (for timed mode) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Duration: {settings.duration} seconds
            </label>
            <input
              type="range"
              min="30"
              max="180"
              step="30"
              value={settings.duration}
              onChange={(e) => updateSettings('duration', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30s</span>
              <span>180s</span>
            </div>
          </div>
          
          {/* Question Limit (for precision/progressive mode) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Question Limit: {settings.questionLimit}
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={settings.questionLimit}
              onChange={(e) => updateSettings('questionLimit', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5</span>
              <span>30</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Start Game Button */}
      <Button
        onClick={onStartGame}
        className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg transition-colors"
      >
        Start Game
      </Button>
    </motion.div>
  );
} 