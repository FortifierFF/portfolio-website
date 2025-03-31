'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Difficulty, 
  GameMode, 
  ColorFormat,
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

  // Game mode descriptions for tooltip
  const gameModeDescriptions = {
    code_to_color: "Select the color that matches the displayed code",
    color_to_code: "Select the code that matches the displayed color",
    mix_the_color: "Adjust RGB sliders to match the target color"
  };

  // Color format descriptions for tooltip
  const colorFormatDescriptions = {
    rgb: "RGB format (e.g., rgb(255, 0, 0))",
    hex: "HEX format (e.g., #FF0000)",
    hsl: "HSL format (e.g., hsl(0, 100%, 50%))"
  };

  // Array of all difficulty levels
  const difficultyLevels: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  
  // Array of all game modes
  const gameModes: GameMode[] = ['code_to_color', 'color_to_code', 'mix_the_color'];
  
  // Array of all color formats
  const colorFormats: ColorFormat[] = ['rgb', 'hex', 'hsl'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-800 rounded-lg p-6 w-full max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Game Settings</h2>
      
      {/* Game Mode Selection */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-300">Game Mode</label>
        <div className="grid grid-cols-1 gap-2">
          {gameModes.map((mode) => (
            <button
              key={mode}
              onClick={() => updateSettings('gameMode', mode)}
              className={`py-3 px-4 rounded-md text-sm font-medium transition-colors flex flex-col items-start text-left
                ${settings.gameMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              <span className="font-bold mb-1">
                {mode === 'code_to_color' ? 'Code to Color' : 
                 mode === 'color_to_code' ? 'Color to Code' : 
                 'Mix the Color'}
              </span>
              <span className="text-xs opacity-80">{gameModeDescriptions[mode]}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Color Format Selection (only show for code-based modes) */}
      {settings.gameMode !== 'mix_the_color' && (
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-300">Color Format</label>
          <div className="grid grid-cols-3 gap-2">
            {colorFormats.map((format) => (
              <button
                key={format}
                onClick={() => updateSettings('colorFormat', format)}
                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors
                  ${settings.colorFormat === format
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                title={colorFormatDescriptions[format]}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
      
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
          {/* Questions Per Round */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Questions Per Round: {settings.questionsPerRound}
            </label>
            <input
              type="range"
              min="5"
              max="20"
              step="5"
              value={settings.questionsPerRound}
              onChange={(e) => updateSettings('questionsPerRound', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5</span>
              <span>20</span>
            </div>
          </div>
          
          {/* Time Per Question */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Time Per Question: {settings.timePerQuestion} seconds
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={settings.timePerQuestion}
              onChange={(e) => updateSettings('timePerQuestion', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5s</span>
              <span>30s</span>
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