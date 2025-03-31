'use client';

import { useState, useEffect, useCallback } from 'react';

type Board = number[][];

// Initialize an empty 4x4 board
const createEmptyBoard = (): Board => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

// Local storage keys
const BEST_SCORE_KEY = 'game-2048-best-score';

export function useGameState() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game and load best score from local storage
  useEffect(() => {
    // Load best score from local storage
    const storedBestScore = localStorage.getItem(BEST_SCORE_KEY);
    if (storedBestScore) {
      setBestScore(parseInt(storedBestScore, 10));
    }

    // Start new game
    resetGame();
  }, []);

  // Update best score when score changes
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(BEST_SCORE_KEY, score.toString());
    }
  }, [score, bestScore]);

  // Add a random tile (2 or 4) to an empty cell
  const addRandomTile = useCallback((currentBoard: Board): Board => {
    const newBoard = currentBoard.map(row => [...row]);
    const emptyCells: [number, number][] = [];

    // Find all empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (newBoard[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    // If there are no empty cells, return the board as is
    if (emptyCells.length === 0) return newBoard;

    // Pick a random empty cell
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // Add a 2 (90% chance) or 4 (10% chance)
    newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;

    return newBoard;
  }, []);

  // Check if game is over (no more valid moves)
  const checkGameOver = useCallback((currentBoard: Board): boolean => {
    // Check for empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) {
          return false;
        }
      }
    }

    // Check for possible merges horizontally
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (currentBoard[row][col] === currentBoard[row][col + 1]) {
          return false;
        }
      }
    }

    // Check for possible merges vertically
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (currentBoard[row][col] === currentBoard[row + 1][col]) {
          return false;
        }
      }
    }

    // No valid moves found
    return true;
  }, []);

  // Check if player has won (reached 2048)
  const checkGameWon = useCallback((currentBoard: Board): boolean => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 2048) {
          return true;
        }
      }
    }
    return false;
  }, []);

  // Reset game state
  const resetGame = useCallback(() => {
    let newBoard = createEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  }, [addRandomTile]);

  // Process a move and update the board
  const processMove = useCallback((newBoard: Board, addedScore: number) => {
    if (gameOver || gameWon) return;

    // Add a random tile after a successful move
    const boardWithNewTile = addRandomTile(newBoard);
    setBoard(boardWithNewTile);

    // Update score
    setScore(prevScore => prevScore + addedScore);

    // Check win condition
    if (!gameWon && checkGameWon(boardWithNewTile)) {
      setGameWon(true);
      return;
    }

    // Check game over condition
    if (checkGameOver(boardWithNewTile)) {
      setGameOver(true);
    }
  }, [addRandomTile, checkGameOver, checkGameWon, gameOver, gameWon]);

  // Check if a move is valid (would change the board)
  const isMoveValid = useCallback((newBoard: Board): boolean => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] !== newBoard[row][col]) {
          return true;
        }
      }
    }
    return false;
  }, [board]);

  // Move tiles up
  const moveUp = useCallback(() => {
    const newBoard = createEmptyBoard();
    let addedScore = 0;

    // For each column, process from top to bottom
    for (let col = 0; col < 4; col++) {
      let position = 0;
      
      // Move all non-zero tiles to the top
      for (let row = 0; row < 4; row++) {
        if (board[row][col] !== 0) {
          newBoard[position][col] = board[row][col];
          position++;
        }
      }

      // Merge tiles
      for (let row = 0; row < 3; row++) {
        if (newBoard[row][col] !== 0 && newBoard[row][col] === newBoard[row + 1][col]) {
          newBoard[row][col] *= 2;
          addedScore += newBoard[row][col];
          newBoard[row + 1][col] = 0;
        }
      }

      // Compact again after merging
      const column = newBoard.map(row => row[col]).filter(val => val !== 0);
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = row < column.length ? column[row] : 0;
      }
    }

    if (isMoveValid(newBoard)) {
      processMove(newBoard, addedScore);
    }
  }, [board, isMoveValid, processMove]);

  // Move tiles down
  const moveDown = useCallback(() => {
    const newBoard = createEmptyBoard();
    let addedScore = 0;

    // For each column, process from bottom to top
    for (let col = 0; col < 4; col++) {
      let position = 3;
      
      // Move all non-zero tiles to the bottom
      for (let row = 3; row >= 0; row--) {
        if (board[row][col] !== 0) {
          newBoard[position][col] = board[row][col];
          position--;
        }
      }

      // Merge tiles
      for (let row = 3; row > 0; row--) {
        if (newBoard[row][col] !== 0 && newBoard[row][col] === newBoard[row - 1][col]) {
          newBoard[row][col] *= 2;
          addedScore += newBoard[row][col];
          newBoard[row - 1][col] = 0;
        }
      }

      // Compact again after merging
      const column = newBoard.map(row => row[col]).filter(val => val !== 0);
      const offset = 4 - column.length;
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = row >= offset ? column[row - offset] : 0;
      }
    }

    if (isMoveValid(newBoard)) {
      processMove(newBoard, addedScore);
    }
  }, [board, isMoveValid, processMove]);

  // Move tiles left
  const moveLeft = useCallback(() => {
    const newBoard = createEmptyBoard();
    let addedScore = 0;

    // For each row, process from left to right
    for (let row = 0; row < 4; row++) {
      let position = 0;
      
      // Move all non-zero tiles to the left
      for (let col = 0; col < 4; col++) {
        if (board[row][col] !== 0) {
          newBoard[row][position] = board[row][col];
          position++;
        }
      }

      // Merge tiles
      for (let col = 0; col < 3; col++) {
        if (newBoard[row][col] !== 0 && newBoard[row][col] === newBoard[row][col + 1]) {
          newBoard[row][col] *= 2;
          addedScore += newBoard[row][col];
          newBoard[row][col + 1] = 0;
        }
      }

      // Compact again after merging
      const rowArray = newBoard[row].filter(val => val !== 0);
      for (let col = 0; col < 4; col++) {
        newBoard[row][col] = col < rowArray.length ? rowArray[col] : 0;
      }
    }

    if (isMoveValid(newBoard)) {
      processMove(newBoard, addedScore);
    }
  }, [board, isMoveValid, processMove]);

  // Move tiles right
  const moveRight = useCallback(() => {
    const newBoard = createEmptyBoard();
    let addedScore = 0;

    // For each row, process from right to left
    for (let row = 0; row < 4; row++) {
      let position = 3;
      
      // Move all non-zero tiles to the right
      for (let col = 3; col >= 0; col--) {
        if (board[row][col] !== 0) {
          newBoard[row][position] = board[row][col];
          position--;
        }
      }

      // Merge tiles
      for (let col = 3; col > 0; col--) {
        if (newBoard[row][col] !== 0 && newBoard[row][col] === newBoard[row][col - 1]) {
          newBoard[row][col] *= 2;
          addedScore += newBoard[row][col];
          newBoard[row][col - 1] = 0;
        }
      }

      // Compact again after merging
      const rowArray = newBoard[row].filter(val => val !== 0);
      const offset = 4 - rowArray.length;
      for (let col = 0; col < 4; col++) {
        newBoard[row][col] = col >= offset ? rowArray[col - offset] : 0;
      }
    }

    if (isMoveValid(newBoard)) {
      processMove(newBoard, addedScore);
    }
  }, [board, isMoveValid, processMove]);

  return {
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
  };
} 