'use client';

import { useEffect } from 'react';
import { Tile } from './tile';
import { useGameState } from './use-game-state';
import { Button } from '@/components/ui/button';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Smartphone 
} from 'lucide-react';

export function GameBoard() {
  const { 
    board, 
    score, 
    bestScore, 
    gameOver, 
    gameWon,
    moveUp, 
    moveDown, 
    moveLeft, 
    moveRight, 
    resetGame 
  } = useGameState();

  // Handle keyboard events for arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || gameWon) return;

      switch (e.key) {
        case 'ArrowUp':
          moveUp();
          e.preventDefault();
          break;
        case 'ArrowDown':
          moveDown();
          e.preventDefault();
          break;
        case 'ArrowLeft':
          moveLeft();
          e.preventDefault();
          break;
        case 'ArrowRight':
          moveRight();
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveUp, moveDown, moveLeft, moveRight, gameOver, gameWon]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Score and controls */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <div className="bg-gray-800 px-4 py-2 rounded-md">
            <span className="block text-sm text-gray-400">Score</span>
            <span className="block text-2xl font-bold text-blue-400">{score}</span>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-md">
            <span className="block text-sm text-gray-400">Best</span>
            <span className="block text-2xl font-bold text-blue-400">{bestScore}</span>
          </div>
        </div>
        <Button 
          onClick={resetGame} 
          variant="outline" 
          className="border-blue-600 text-blue-500"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
      </div>

      {/* Game status message */}
      {(gameOver || gameWon) && (
        <div className={`mb-4 p-4 rounded-md text-center ${gameWon ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'}`}>
          <h3 className="text-xl font-bold mb-2 text-blue-400">
            {gameWon ? 'You Win!' : 'Game Over!'}
          </h3>
          <p className="text-gray-300">
            {gameWon 
              ? 'Congratulations! You reached 2048!' 
              : 'No more moves available. Try again!'}
          </p>
        </div>
      )}

      {/* Mobile controls notice */}
      <div className="sm:hidden bg-gray-800 mb-4 p-3 rounded-md">
        <div className="flex items-center text-gray-400 text-sm">
          <Smartphone className="w-4 h-4 mr-2" />
          <span>Use the arrow buttons below or swipe to play</span>
        </div>
      </div>

      {/* Game board */}
      <div className="relative bg-gray-800 p-2 rounded-md">
        <div className="grid grid-cols-4 gap-2">
          {/* Background grid */}
          {Array.from({ length: 16 }).map((_, index) => (
            <div key={`cell-${index}`} className="bg-gray-700 w-full h-16 sm:h-20 rounded-md"></div>
          ))}

          {/* Tiles */}
          <div className="absolute top-2 left-2 right-2 bottom-2">
            <div className="relative w-full h-full">
              {board.flatMap((row, rowIndex) => 
                row.map((value, colIndex) => (
                  value ? (
                    <Tile 
                      key={`${rowIndex}-${colIndex}-${value}`}
                      value={value} 
                      position={{ row: rowIndex, col: colIndex }}
                    />
                  ) : null
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 mt-4 sm:hidden">
        <div className="col-start-2">
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={moveUp}
            disabled={gameOver || gameWon}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
        <div className="col-span-3 grid grid-cols-3 gap-2">
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={moveLeft}
            disabled={gameOver || gameWon}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={moveDown}
            disabled={gameOver || gameWon}
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={moveRight}
            disabled={gameOver || gameWon}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 