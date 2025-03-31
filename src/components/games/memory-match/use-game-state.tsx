'use client';

import { useState, useEffect, useCallback } from 'react';

// Card emojis for the game
const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯', '🐨', '🐮'];

interface Card {
  emoji: string;
  id: number;
}

export function useGameState() {
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

  // Initialize/reset the game
  const resetGame = useCallback(() => {
    // Shuffle and create pairs
    const shuffledPairs = [...emojis.slice(0, 8)]
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
    setTotalPairs(8); // 8 pairs of cards
    setFoundPairs(0);
  }, []);

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
  };
} 