'use client';

import { Card } from './card';
import { useGameState } from './use-game-state';
import { Button } from '@/components/ui/button';

export function MemoryMatchGame() {
  const {
    cards,
    flippedIndexes,
    matchedIndexes,
    moves,
    gameCompleted,
    handleCardClick,
    resetGame,
    secondsElapsed,
  } = useGameState();

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="w-full mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="bg-gray-800 px-4 py-2 rounded-md shadow-inner">
            <span className="text-sm text-gray-400">Moves</span>
            <p className="text-2xl font-bold text-blue-400">{moves}</p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-md shadow-inner">
            <span className="text-sm text-gray-400">Time</span>
            <p className="text-2xl font-bold text-blue-400">{secondsElapsed}s</p>
          </div>
        </div>
        <Button onClick={resetGame} variant="outline" className="border-blue-600 text-blue-500">
          New Game
        </Button>
      </div>

      {/* Game completion message */}
      {gameCompleted && (
        <div className="mb-6 w-full bg-blue-900/20 border border-blue-800 p-4 rounded-md text-center">
          <h3 className="text-xl font-bold text-blue-400 mb-2">Congratulations!</h3>
          <p className="text-gray-300">
            You completed the game in {moves} moves and {secondsElapsed} seconds.
          </p>
        </div>
      )}

      {/* Game board */}
      <div className="grid grid-cols-4 gap-2 w-full max-w-md mx-auto">
        {cards.map((card, index: number) => (
          <Card
            key={index}
            emoji={card.emoji}
            isFlipped={flippedIndexes.includes(index) || matchedIndexes.includes(index)}
            isMatched={matchedIndexes.includes(index)}
            onClick={() => handleCardClick(index)}
            disabled={
              flippedIndexes.length >= 2 ||
              flippedIndexes.includes(index) ||
              matchedIndexes.includes(index)
            }
          />
        ))}
      </div>
    </div>
  );
} 