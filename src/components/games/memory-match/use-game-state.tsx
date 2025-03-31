'use client';

import { useState, useEffect, useCallback } from 'react';

// Extended emojis collection for larger boards
const emojis = [
  // Animals
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯', '🐨', '🐮',
  '🐷', '🐸', '🐵', '🐔', '🐧', '🦆', '🦉', '🦇', '🐝', '🐢', '🦎', '🐙',
  // Foods
  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥭', '🍍', 
  '🥥', '🥝', '🍅', '🥑', '🍆', '🌽', '🌶️', '🍄', '🥐', '🍕', '🍔', '🍟',
  // Activities
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🎯',
  '🎮', '🎨', '🎭', '🎪', '🎤', '🎧', '🎸', '🎹', '🎬', '🏆', '🏅', '🎖️',
];

export type BoardSize = '4x4' | '6x6' | '8x8';

interface GameOptions {
  boardSize: BoardSize;
}

interface Card {
  emoji: string;
  id: number;
}

// Get number of pairs needed based on board size
const getPairsCount = (size: BoardSize): number => {
  switch (size) {
    case '4x4': return 8;  // 16 cards = 8 pairs
    case '6x6': return 18; // 36 cards = 18 pairs
    case '8x8': return 32; // 64 cards = 32 pairs
    default: return 8;
  }
};

// Get grid columns based on board size
export const getGridCols = (size: BoardSize): string => {
  switch (size) {
    case '4x4': return 'grid-cols-4';
    case '6x6': return 'grid-cols-6';
    case '8x8': return 'grid-cols-8';
    default: return 'grid-cols-4';
  }
};

export function useGameState(initialOptions: GameOptions = { boardSize: '4x4' }) {
  // Game options
  const [options, setOptions] = useState<GameOptions>(initialOptions);
  
  // Game cards - duplicated to create pairs
  const [cards, setCards] = useState<Card[]>([]);
  
  // Track flipped and matched cards by their index
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [matchedIndexes, setMatchedIndexes] = useState<number[]>([]);
  
  // Game statistics
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalPairs, setTotalPairs] = useState(0);
  const [foundPairs, setFoundPairs] = useState(0);

  // Change difficulty/board size
  const changeBoardSize = useCallback((size: BoardSize) => {
    setOptions(prev => ({ ...prev, boardSize: size }));
    resetGame(size);
  }, []);

  // Initialize/reset the game
  const resetGame = useCallback((boardSize: BoardSize = options.boardSize) => {
    const pairsCount = getPairsCount(boardSize);
    
    // Shuffle and create pairs
    const shuffledPairs = [...emojis.slice(0, pairsCount)]
      .flatMap(emoji => [
        { emoji, id: Math.random() },
        { emoji, id: Math.random() },
      ])
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffledPairs);
    setFlippedIndexes([]);
    setMatchedIndexes([]);
    setMoves(0);
    setGameCompleted(false);
    setSecondsElapsed(0);
    setGameStarted(false);
    setTotalPairs(pairsCount);
    setFoundPairs(0);
  }, [options.boardSize]);

  // Initialize game on first render
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameCompleted) {
      timer = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameCompleted]);

  // Check if game is completed
  useEffect(() => {
    // Check if all pairs have been found
    if (foundPairs === totalPairs && totalPairs > 0) {
      setGameCompleted(true);
    }
  }, [foundPairs, totalPairs]);

  // Handle card click logic
  const handleCardClick = (index: number) => {
    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Ignore if 2 cards already flipped or card already matched
    if (flippedIndexes.length >= 2 || matchedIndexes.includes(index)) {
      return;
    }
    
    // Flip the card
    setFlippedIndexes(prev => [...prev, index]);
    
    // If this is the second card
    if (flippedIndexes.length === 1) {
      setMoves(prev => prev + 1);
      
      // Check for a match
      const firstCardIndex = flippedIndexes[0];
      const secondCardIndex = index;
      
      // If cards match
      if (cards[firstCardIndex].emoji === cards[secondCardIndex].emoji) {
        setMatchedIndexes(prev => [...prev, firstCardIndex, secondCardIndex]);
        setFlippedIndexes([]);
        setFoundPairs(prev => prev + 1);
      } else {
        // If cards don't match, flip them back after a delay
        setTimeout(() => {
          setFlippedIndexes([]);
        }, 1000);
      }
    }
  };

  return {
    cards,
    flippedIndexes,
    matchedIndexes,
    moves,
    gameCompleted,
    secondsElapsed,
    handleCardClick,
    resetGame,
    boardSize: options.boardSize,
    changeBoardSize,
  };
} 