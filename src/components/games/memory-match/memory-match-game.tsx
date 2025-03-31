'use client';

import { Card } from './card';
import { useGameState, BoardSize, getGridCols } from './use-game-state';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CardData {
  emoji: string;
  id: number;
}

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
    boardSize,
    changeBoardSize,
  } = useGameState();

  const [showSettings, setShowSettings] = useState(false);

  // Define board size options
  const boardSizeOptions: { value: BoardSize; label: string }[] = [
    { value: '4x4', label: 'Easy (4×4)' },
    { value: '6x6', label: 'Medium (6×6)' },
    { value: '8x8', label: 'Hard (8×8)' },
  ];

  const handleBoardSizeChange = (size: BoardSize) => {
    changeBoardSize(size);
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
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
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowSettings(!showSettings)} 
            variant="outline"
            className="border-blue-600 text-blue-500"
          >
            Difficulty
          </Button>
          <Button onClick={() => resetGame()} variant="outline" className="border-blue-600 text-blue-500">
            New Game
          </Button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-6 w-full bg-gray-800 p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-200 mb-3">Board Size</h3>
          <div className="flex flex-wrap gap-2">
            {boardSizeOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleBoardSizeChange(option.value)}
                variant={boardSize === option.value ? "default" : "secondary"}
                className={boardSize === option.value ? "bg-blue-600" : ""}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Game completion message */}
      {gameCompleted && (
        <div className="mb-6 w-full bg-blue-900/20 border border-blue-800 p-4 rounded-md text-center">
          <h3 className="text-xl font-bold text-blue-400 mb-2">Congratulations!</h3>
          <p className="text-gray-300">
            You completed the {boardSize} board in {moves} moves and {secondsElapsed} seconds.
          </p>
        </div>
      )}

      {/* Game board */}
      <div className={`grid ${getGridCols(boardSize)} ${boardSize === '8x8' ? 'gap-1' : 'gap-2'} w-full mx-auto justify-center`}>
        {cards.map((card: CardData, index: number) => (
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
            boardSize={boardSize}
          />
        ))}
      </div>
    </div>
  );
} 