'use client';

import { Button } from '@/components/ui/button';

interface DifficultyOption {
  value: string;
  label: string;
}

interface GameSettingsProps {
  difficultyOptions: DifficultyOption[];
  currentDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

// Component for game settings and difficulty selection
export const GameSettings = ({ 
  difficultyOptions, 
  currentDifficulty, 
  onDifficultyChange 
}: GameSettingsProps) => {
  return (
    <div className="mb-6 w-full bg-gray-800 p-4 rounded-md">
      <h3 className="text-lg font-medium text-gray-200 mb-3">Difficulty Level</h3>
      <div className="flex flex-wrap gap-2">
        {difficultyOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => onDifficultyChange(option.value)}
            variant={currentDifficulty === option.value ? "default" : "secondary"}
            className={currentDifficulty === option.value ? "bg-blue-600" : ""}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <p className="text-sm text-gray-400 mt-3">
        Choose your difficulty level. Higher difficulties have longer words and less time!
      </p>
    </div>
  );
}; 