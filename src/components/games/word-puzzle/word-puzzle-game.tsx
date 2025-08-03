'use client';

import { Button } from '@/components/ui/button';
import { useGameState } from './use-game-state';
import { useState } from 'react';
import { WordDisplay } from './word-display';
import { LetterTile } from './letter-tile';
import { GameSettings } from './game-settings';
import { WordLog } from './word-log';

// Main game component that orchestrates the word puzzle game
export const WordPuzzleGame = () => {
  const {
    currentWord,
    scrambledLetters,
    userInput,
    score,
    level,
    timeRemaining,
    gameStatus,
    usedLetters,
    isChecking,
    hintUsed,
    wordLog,
    handleLetterClick,
    handleWordLetterClick,
    handleSubmit,
    handleSkip,
    useHint,
    shuffleLetters,
    resetGame,
    changeDifficulty,
  } = useGameState();

  const [showSettings, setShowSettings] = useState(false);
  const [showWordLog, setShowWordLog] = useState(false);

  const difficultyOptions = [
    { value: 'easy', label: 'Easy (4-5 letters)' },
    { value: 'medium', label: 'Medium (6-7 letters)' },
    { value: 'hard', label: 'Hard (8+ letters)' },
  ];

  const handleDifficultyChange = (difficulty: string) => {
    changeDifficulty(difficulty as 'easy' | 'medium' | 'hard');
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="w-full mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="bg-gray-800 px-4 py-2 rounded-md shadow-inner">
            <span className="text-sm text-gray-400">Score</span>
            <p className="text-2xl font-bold text-blue-400">{score}</p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-md shadow-inner">
            <span className="text-sm text-gray-400">Level</span>
            <p className="text-2xl font-bold text-blue-400">{level}</p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-md shadow-inner">
            <span className="text-sm text-gray-400">Time</span>
            <p className="text-2xl font-bold text-blue-400">{timeRemaining}s</p>
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
        <GameSettings 
          difficultyOptions={difficultyOptions}
          currentDifficulty={level}
          onDifficultyChange={handleDifficultyChange}
        />
      )}

      {/* Game completion message */}
      {gameStatus === 'completed' && (
        <div className="mb-6 w-full bg-blue-900/20 border border-blue-800 p-6 rounded-md text-center">
          <h3 className="text-xl font-bold text-blue-400 mb-2">Congratulations!</h3>
          <p className="text-gray-300 mb-4">
            You completed the word puzzle with a score of {score}!
          </p>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="text-gray-400 text-sm mb-2">Final word:</p>
            <div className="text-2xl font-bold text-green-400 tracking-wider mb-3">
              {currentWord}
            </div>
            {userInput && (
              <>
                <p className="text-gray-400 text-sm mb-2">You solved it as:</p>
                <div className="text-xl font-bold text-blue-400 tracking-wider">
                  {userInput}
                </div>
              </>
            )}
          </div>
          
          {/* Session Log Toggle */}
          <div className="mb-4">
            <Button 
              onClick={() => setShowWordLog(!showWordLog)}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white"
            >
              {showWordLog ? '📋 Hide Session Log' : '📋 Show Session Log'}
            </Button>
          </div>
          
          {/* Word Log */}
          {showWordLog && (
            <div className="mt-4">
              <WordLog wordLog={wordLog} />
            </div>
          )}
        </div>
      )}

      {/* Game over message */}
      {gameStatus === 'gameOver' && (
        <div className="mb-6 w-full bg-orange-900/20 border border-orange-800 p-6 rounded-md text-center">
          <h3 className="text-xl font-bold text-orange-400 mb-2">Oops! Time&apos;s Up! 😅</h3>
          <p className="text-gray-300 mb-4">
            Don&apos;t worry, word puzzles can be tricky! Your final score: <span className="text-orange-400 font-bold">{score}</span>
          </p>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="text-gray-400 text-sm mb-2">The word was:</p>
            <div className="text-2xl font-bold text-green-400 tracking-wider mb-3">
              {currentWord}
            </div>
            {userInput && userInput !== currentWord && (
              <>
                <p className="text-gray-400 text-sm mb-2">You typed:</p>
                <div className="text-xl font-bold text-red-400 tracking-wider">
                  {userInput}
                </div>
              </>
            )}
          </div>
          
          {/* Session Log Toggle */}
          <div className="mb-4">
            <Button 
              onClick={() => setShowWordLog(!showWordLog)}
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white"
            >
              {showWordLog ? '📋 Hide Session Log' : '📋 Show Session Log'}
            </Button>
          </div>
          
          {/* Word Log */}
          {showWordLog && (
            <div className="mt-4">
              <WordLog wordLog={wordLog} />
            </div>
          )}
          
          <p className="text-gray-400 text-sm">
            Tip: Try clicking letters again to deselect them if you make a mistake!
          </p>
        </div>
      )}

      {/* Main Game Area */}
      {gameStatus === 'playing' && (
        <div className="w-full space-y-8">
          {/* Scrambled Letters */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-200">
                Scrambled Letters
              </h3>
              <div className="flex gap-2">
                <Button 
                  onClick={shuffleLetters}
                  size="sm"
                  variant="outline"
                  className="border-purple-600 text-purple-500 hover:bg-purple-600 hover:text-white"
                >
                  🔄 Shuffle
                </Button>
                <Button 
                  onClick={useHint}
                  disabled={hintUsed}
                  size="sm"
                  variant="outline"
                  className="border-yellow-600 text-yellow-500 hover:bg-yellow-600 hover:text-white"
                >
                  {hintUsed ? 'Hint Used' : '💡 Hint'}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {scrambledLetters.map((letter, index) => (
                <LetterTile
                  key={index}
                  letter={letter}
                  onClick={() => handleLetterClick(index)}
                  isUsed={usedLetters.includes(index)}
                />
              ))}
            </div>
          </div>

          {/* User Input Display */}
          <WordDisplay 
            word={userInput}
            targetLength={currentWord.length}
            onLetterClick={handleWordLetterClick}
          />

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleSubmit}
              disabled={userInput.length !== currentWord.length || isChecking}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isChecking ? 'Checking...' : 'Submit'}
            </Button>
            <Button 
              onClick={handleSkip}
              variant="outline"
              className="border-orange-600 text-orange-500 hover:bg-orange-600 hover:text-white"
            >
              Skip Word
            </Button>
          </div>
        </div>
      )}

      {/* Start Game Button */}
      {gameStatus === 'idle' && (
        <div className="text-center">
          <Button 
            onClick={() => resetGame()}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
          >
            Start Game
          </Button>
        </div>
      )}
    </div>
  );
}; 