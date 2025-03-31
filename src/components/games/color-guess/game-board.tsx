'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from './use-game-state';
import { GameSettings } from './game-settings';
import { CodeToColor } from './code-to-color';
import { ColorToCode } from './color-to-code';
import { MixTheColor } from './mix-the-color';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

// Custom confirmation dialog component
function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
              <h3 className="text-xl font-bold text-blue-400 mb-2">{title}</h3>
              <p className="text-gray-300 mb-6">{message}</p>
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={onClose}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function GameBoard() {
  const {
    settings,
    isGameActive,
    isGameOver,
    currentQuestion,
    selectedOption,
    isCorrect,
    mixedColor,
    stats,
    bestScore,
    updateMixedColor,
    startGame,
    resetGame,
    submitAnswer,
    updateSettings,
  } = useGameState();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">Color Guess</h1>
        
        <AnimatePresence mode="wait">
          {!isGameActive && !isGameOver ? (
            <GameSettings 
              key="settings" 
              settings={settings} 
              onSettingsChange={updateSettings} 
              onStartGame={startGame} 
            />
          ) : isGameActive && !isGameOver ? (
            <ActiveGame 
              key="active-game" 
              currentQuestion={currentQuestion!}
              selectedOption={selectedOption}
              isCorrect={isCorrect}
              mixedColor={mixedColor}
              updateMixedColor={updateMixedColor}
              onSubmit={submitAnswer}
              stats={stats}
              settings={settings}
              resetGame={resetGame}
            />
          ) : (
            <GameOver 
              key="game-over" 
              stats={stats} 
              bestScore={bestScore}
              onPlayAgain={() => {
                resetGame();
                startGame();
              }}
              onNewGame={() => {
                resetGame();
                // This will show the settings screen
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ActiveGameProps {
  currentQuestion: NonNullable<ReturnType<typeof useGameState>['currentQuestion']>;
  selectedOption: number | null;
  isCorrect: boolean | null;
  mixedColor: { r: number; g: number; b: number };
  updateMixedColor: (color: { r: number; g: number; b: number }) => void;
  onSubmit: (selectedIndex: number | null) => void;
  stats: ReturnType<typeof useGameState>['stats'];
  settings: ReturnType<typeof useGameState>['settings'];
  resetGame: () => void;
}

function ActiveGame({
  currentQuestion,
  selectedOption,
  isCorrect,
  mixedColor,
  updateMixedColor,
  onSubmit,
  stats,
  settings,
  resetGame,
}: ActiveGameProps) {
  // State for controlling the confirmation dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  if (!currentQuestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={resetGame}
        title="Quit Game"
        message="Are you sure you want to quit the current game? Your progress will be lost."
      />
      
      {/* Game Stats */}
      <div className="flex justify-between mb-6 text-gray-300">
        <div className="flex space-x-4">
          <div>
            <span className="text-xs block">Score</span>
            <span className="text-2xl font-bold text-blue-400">{stats.score}</span>
          </div>
          
          <div>
            <span className="text-xs block">Correct</span>
            <span className="text-2xl font-bold text-green-400">
              {stats.correctAnswers}/{stats.questionsAnswered}
            </span>
          </div>
          
          <div>
            <span className="text-xs block">Streak</span>
            <span className="text-2xl font-bold text-amber-400">{stats.streak}</span>
          </div>
        </div>
        
        <div>
          <span className="text-xs block text-right">Time</span>
          <span className="text-2xl font-bold text-red-400">{stats.timeRemaining}s</span>
        </div>
      </div>

      {/* Back to Settings Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsConfirmDialogOpen(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-1.5 rounded-md flex items-center gap-1"
          size="sm"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Settings
        </Button>
      </div>
      
      {/* Game Content */}
      {settings.gameMode === 'code_to_color' && (
        <CodeToColor
          question={currentQuestion}
          onSelect={onSubmit}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
        />
      )}
      
      {settings.gameMode === 'color_to_code' && (
        <ColorToCode
          question={currentQuestion}
          onSelect={onSubmit}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
        />
      )}
      
      {settings.gameMode === 'mix_the_color' && (
        <MixTheColor
          question={currentQuestion}
          mixedColor={mixedColor}
          updateMixedColor={updateMixedColor}
          onSubmit={onSubmit}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
        />
      )}
    </motion.div>
  );
}

interface GameOverProps {
  stats: ReturnType<typeof useGameState>['stats'];
  bestScore: number;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

function GameOver({ stats, bestScore, onPlayAgain, onNewGame }: GameOverProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-800 rounded-lg p-8 w-full max-w-xl text-center"
    >
      <h2 className="text-3xl font-bold mb-6 text-blue-400">Game Over!</h2>
      
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Final Score:</span>
          <span className="text-2xl font-bold text-blue-400">{stats.score}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Best Score:</span>
          <span className={`text-2xl font-bold ${stats.score >= bestScore ? 'text-yellow-400' : 'text-blue-400'}`}>
            {Math.max(stats.score, bestScore)}
            {stats.score > bestScore && stats.score > 0 && ' 🏆'}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Colors Guessed:</span>
          <span className="text-2xl font-bold text-green-400">{stats.correctAnswers}/{stats.questionsAnswered}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Accuracy:</span>
          <span className="text-2xl font-bold text-amber-400">
            {stats.questionsAnswered > 0 
              ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100) 
              : 0}%
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-gray-300">Best Streak:</span>
          <span className="text-2xl font-bold text-purple-400">{stats.bestStreak}</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Button
          onClick={onPlayAgain}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg"
        >
          Play Again
        </Button>
        
        <Button
          onClick={onNewGame}
          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium text-lg"
        >
          Change Settings
        </Button>
      </div>
    </motion.div>
  );
} 