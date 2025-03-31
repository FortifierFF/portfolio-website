'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from './use-game-state';
import { GameSettings } from './game-settings';
import { MathProblem } from './math-problem';
import { Button } from '@/components/ui/button';

export function GameBoard() {
  const {
    settings,
    updateSettings,
    isGameActive,
    isGameOver,
    startGame,
    resetGame,
    currentProblem,
    submitAnswer,
    stats,
    bestScore,
    userAnswer,
    setUserAnswer,
    isCorrect,
  } = useGameState();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">Math Challenge</h1>
        
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
              currentProblem={currentProblem!}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              isCorrect={isCorrect}
              onSubmit={submitAnswer}
              stats={stats}
              settings={settings}
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
  currentProblem: NonNullable<ReturnType<typeof useGameState>['currentProblem']>;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isCorrect: boolean | null;
  onSubmit: (answer: string) => void;
  stats: ReturnType<typeof useGameState>['stats'];
  settings: ReturnType<typeof useGameState>['settings'];
}

function ActiveGame({
  currentProblem,
  userAnswer,
  setUserAnswer,
  isCorrect,
  onSubmit,
  stats,
  settings,
}: ActiveGameProps) {
  if (!currentProblem) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
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
      
      {/* Problem Display */}
      <MathProblem
        problem={currentProblem}
        onSubmit={onSubmit}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        isCorrect={isCorrect}
        timeRemaining={
          settings.gameMode === 'timed' || settings.gameMode === 'survival' 
            ? stats.timeRemaining 
            : undefined
        }
      />
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
          <span className="text-gray-300">Problems Solved:</span>
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