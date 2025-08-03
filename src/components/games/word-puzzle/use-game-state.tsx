'use client';

import { useState, useEffect, useCallback } from 'react';
import { isValidAnagram } from '@/lib/word-validator';

// Word lists for different difficulty levels
const wordLists = {
  easy: [
    'CAT', 'DOG', 'HAT', 'RUN', 'SUN', 'BIG', 'RED', 'BLUE', 'GREEN', 'BOOK',
    'TREE', 'FISH', 'BIRD', 'STAR', 'MOON', 'CAKE', 'BALL', 'GAME', 'PLAY', 'WORK',
    'CAR', 'MAP', 'TOP', 'BAG', 'PEN', 'KEY', 'BOX', 'CUP', 'TEA', 'BED',
    'FAN', 'LAP', 'JAM', 'PIG', 'COW', 'FOX', 'ANT', 'BEE', 'OWL', 'APE',
    'ARM', 'LEG', 'EYE', 'NOSE', 'MOUTH', 'HAND', 'FOOT', 'HEAD', 'BACK', 'SIDE',
    'FIRE', 'WATER', 'EARTH', 'WIND', 'TIME', 'SPACE', 'LIGHT', 'DARK', 'HOT', 'COLD',
    'FAST', 'SLOW', 'HIGH', 'LOW', 'NEW', 'OLD', 'GOOD', 'BAD', 'YES', 'NO'
  ],
  medium: [
    'PUZZLE', 'GARDEN', 'WINDOW', 'COFFEE', 'SUNSET', 'WINTER', 'SUMMER', 'SPRING',
    'AUTUMN', 'MUSIC', 'DANCER', 'WRITER', 'ARTIST', 'DOCTOR', 'TEACHER', 'ENGINEER',
    'PROGRAM', 'COMPUTER', 'INTERNET', 'TELEPHONE', 'BEAUTIFUL', 'WONDERFUL',
    'ANIMAL', 'FLOWER', 'FOREST', 'MOUNTAIN', 'OCEAN', 'RIVER', 'STREAM', 'BRIDGE',
    'SCHOOL', 'OFFICE', 'HOSPITAL', 'LIBRARY', 'MUSEUM', 'THEATER', 'RESTAURANT', 'MARKET',
    'FRIEND', 'FAMILY', 'BROTHER', 'SISTER', 'FATHER', 'MOTHER', 'GRANDPA', 'GRANDMA',
    'COUNTRY', 'CITY', 'VILLAGE', 'STREET', 'ROAD', 'PATH', 'TRAIN', 'PLANE',
    'BICYCLE', 'MOTORCYCLE', 'AUTOMOBILE', 'AIRPLANE', 'SHIP', 'BOAT', 'ROCKET', 'SPACESHIP',
    'BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DESSERT', 'COOKIE', 'CANDY', 'CHOCOLATE'
  ],
  hard: [
    'ADVENTURE', 'CHALLENGE', 'EXCELLENT', 'FANTASTIC', 'IMPORTANT', 'INTERESTING',
    'KNOWLEDGE', 'LANGUAGE', 'MAGNIFICENT', 'NATURAL', 'OPPORTUNITY', 'PERFECT',
    'QUALITY', 'REALISTIC', 'SIGNIFICANT', 'TECHNOLOGY', 'UNDERSTAND', 'VALUABLE',
    'WONDERFUL', 'EXPERIENCE', 'EDUCATION', 'INFORMATION', 'COMMUNICATION',
    'BEAUTIFUL', 'DANGEROUS', 'DIFFICULT', 'EASY', 'EXPENSIVE', 'CHEAP', 'STRONG', 'WEAK',
    'INTELLIGENT', 'CREATIVE', 'ORGANIZED', 'CONFIDENT', 'SUCCESSFUL', 'PROFESSIONAL', 'AMBITIOUS', 'DETERMINED',
    'ENVIRONMENT', 'SUSTAINABLE', 'RENEWABLE', 'CONSERVATION', 'POLLUTION', 'CLIMATE', 'WEATHER', 'TEMPERATURE',
    'GOVERNMENT', 'DEMOCRACY', 'POLITICS', 'ECONOMY', 'SOCIETY', 'CULTURE', 'TRADITION', 'HISTORY',
    'SCIENTIFIC', 'MATHEMATICAL', 'PHYSICAL', 'CHEMICAL', 'BIOLOGICAL', 'ASTRONOMICAL', 'GEOLOGICAL', 'PSYCHOLOGICAL',
    'INTERNATIONAL', 'MULTINATIONAL', 'TRANSCONTINENTAL', 'INTERCONTINENTAL', 'SUPRANATIONAL', 'TRANSNATIONAL', 'INTERCULTURAL', 'MULTICULTURAL'
  ]
};

// Remove preloading to avoid API rate limits
// preloadCommonAnagrams().catch(console.error);

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'playing' | 'completed' | 'gameOver';

interface GameState {
  currentWord: string;
  scrambledLetters: string[];
  userInput: string;
  score: number;
  level: number;
  timeRemaining: number;
  gameStatus: GameStatus;
  difficulty: Difficulty;
  usedLetters: number[];
  isChecking: boolean;
  hintUsed: boolean;
  wordLog: Array<{
    word: string;
    userAnswer: string;
    level: number;
    isCorrect: boolean;
  }>;
}

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = (array: string[]): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get random word from appropriate difficulty level
const getRandomWord = (difficulty: Difficulty): string => {
  const words = wordLists[difficulty];
  return words[Math.floor(Math.random() * words.length)];
};

// Get time limit based on difficulty and word length
const getTimeLimit = (difficulty: Difficulty, wordLength: number): number => {
  switch (difficulty) {
    case 'easy':
      return Math.max(30, wordLength * 8);
    case 'medium':
      return Math.max(45, wordLength * 7);
    case 'hard':
      return Math.max(60, wordLength * 6);
    default:
      return 60;
  }
};

// Check if two words are anagrams using the API
const areValidAnagrams = async (userWord: string, targetWord: string): Promise<boolean> => {
  return await isValidAnagram(userWord, targetWord);
};

export const useGameState = (initialDifficulty: Difficulty = 'easy') => {
  // Game state
  const [state, setState] = useState<GameState>({
    currentWord: '',
    scrambledLetters: [],
    userInput: '',
    score: 0,
    level: 1,
    timeRemaining: 60,
    gameStatus: 'idle',
    difficulty: initialDifficulty,
    usedLetters: [],
    isChecking: false,
    hintUsed: false,
    wordLog: []
  });

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (state.gameStatus === 'playing' && state.timeRemaining > 0) {
      timer = setTimeout(() => {
        setState(prev => {
          const newTimeRemaining = prev.timeRemaining - 1;
          
          if (newTimeRemaining <= 0) {
            return { ...prev, gameStatus: 'gameOver', timeRemaining: 0 };
          }
          
          return { ...prev, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [state.gameStatus, state.timeRemaining]);

  // Initialize new word
  const initializeWord = useCallback((difficulty: Difficulty) => {
    const word = getRandomWord(difficulty);
    const scrambled = shuffleArray(word.split(''));
    const timeLimit = getTimeLimit(difficulty, word.length);
    
    setState(prev => ({
      ...prev,
      currentWord: word,
      scrambledLetters: scrambled,
      userInput: '',
      timeRemaining: timeLimit,
      usedLetters: [],
      hintUsed: false
    }));
  }, []);

  // Handle letter click - toggle selection
  const handleLetterClick = useCallback((index: number) => {
    setState(prev => {
      if (prev.gameStatus !== 'playing') {
        return prev;
      }

      const letter = prev.scrambledLetters[index];
      const isAlreadyUsed = prev.usedLetters.includes(index);
      
      if (isAlreadyUsed) {
        // Deselect the letter - remove it from the end of userInput
        const letterIndex = prev.usedLetters.indexOf(index);
        const newUserInput = prev.userInput.slice(0, letterIndex) + prev.userInput.slice(letterIndex + 1);
        const newUsedLetters = prev.usedLetters.filter((_, i) => i !== letterIndex);
        
        return {
          ...prev,
          userInput: newUserInput,
          usedLetters: newUsedLetters
        };
      } else {
        // Select the letter
        const newUserInput = prev.userInput + letter;
        
        return {
          ...prev,
          userInput: newUserInput,
          usedLetters: [...prev.usedLetters, index]
        };
      }
    });
  }, []);

  // Handle letter deselection from word display
  const handleWordLetterClick = useCallback((wordIndex: number) => {
    setState(prev => {
      if (prev.gameStatus !== 'playing' || wordIndex >= prev.userInput.length) {
        return prev;
      }

      // Remove the letter from userInput and usedLetters
      const newUserInput = prev.userInput.slice(0, wordIndex) + prev.userInput.slice(wordIndex + 1);
      const newUsedLetters = prev.usedLetters.filter((_, i) => i !== wordIndex);
      
      return {
        ...prev,
        userInput: newUserInput,
        usedLetters: newUsedLetters
      };
    });
  }, []);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    setState(prev => {
      if (prev.gameStatus !== 'playing' || prev.isChecking) return prev;
      
      // Set checking state
      const newState = { ...prev, isChecking: true };
      
      // Start validation process
      const validateAnswer = async () => {
        try {
          // Check if the answer is correct (exact match or valid anagram)
          const isExactMatch = prev.userInput === prev.currentWord;
          const isAnagram = isExactMatch ? false : await areValidAnagrams(prev.userInput, prev.currentWord);
          const isCorrect = isExactMatch || isAnagram;
          
          const timeBonus = Math.floor(prev.timeRemaining / 10);
          const wordBonus = prev.currentWord.length * 10;
          const points = isCorrect ? wordBonus + timeBonus : 0;
          
          const newScore = prev.score + points;
          const newLevel = Math.floor(newScore / 100) + 1;
          
          // Check if game should continue or complete
          const shouldContinue = newLevel <= 10; // 10 levels max
          
          setState(currentState => {
            // Check if this word is already in the log to avoid duplicates
            const wordAlreadyLogged = currentState.wordLog.some(entry => 
              entry.word === currentState.currentWord && entry.level === currentState.level
            );
            
            // Only add to log if this word hasn't been logged yet
            const newWordLog = wordAlreadyLogged 
              ? currentState.wordLog 
              : [...currentState.wordLog, {
                  word: currentState.currentWord,
                  userAnswer: currentState.userInput,
                  level: currentState.level,
                  isCorrect: isCorrect
                }];
            
            if (isCorrect && shouldContinue) {
              // Move to next word
              setTimeout(() => {
                initializeWord(currentState.difficulty);
              }, 1000);
              
              return {
                ...currentState,
                score: newScore,
                level: newLevel,
                userInput: '',
                usedLetters: [],
                isChecking: false,
                wordLog: newWordLog
              };
            } else {
              // Game completed or incorrect answer
              return {
                ...currentState,
                score: newScore,
                level: newLevel,
                gameStatus: isCorrect ? 'completed' : 'gameOver',
                isChecking: false,
                wordLog: newWordLog
              };
            }
          });
        } catch (error) {
          console.error('Error validating answer:', error);
          // On error, treat as incorrect answer
          setState(currentState => ({
            ...currentState,
            gameStatus: 'gameOver',
            isChecking: false
          }));
        }
      };
      
      // Start validation
      validateAnswer();
      
      return newState; // Return state with checking flag
    });
  }, [initializeWord]);

  // Handle skip word
  const handleSkip = useCallback(() => {
    setState(prev => {
      if (prev.gameStatus !== 'playing') return prev;
      
      // Penalty for skipping
      const penalty = Math.max(0, prev.currentWord.length * 5);
      const newScore = Math.max(0, prev.score - penalty);
      
      // Move to next word
      setTimeout(() => {
        initializeWord(prev.difficulty);
      }, 500);
      
      return {
        ...prev,
        score: newScore,
        userInput: '',
        usedLetters: []
      };
    });
  }, [initializeWord]);

  // Reset game
  const resetGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      score: 0,
      level: 1,
      gameStatus: 'playing',
      userInput: '',
      usedLetters: [],
      hintUsed: false,
      wordLog: [] // Clear word log on new game
    }));
    
    // Initialize first word
    setTimeout(() => {
      initializeWord(state.difficulty);
    }, 100);
  }, [initializeWord, state.difficulty]);

  // Use hint - automatically select the first letter of the word
  const useHint = useCallback(() => {
    setState(prev => {
      if (prev.gameStatus !== 'playing' || prev.hintUsed) {
        return prev;
      }
      
      // Find the index of the first letter in the scrambled letters
      const firstLetter = prev.currentWord[0];
      const letterIndex = prev.scrambledLetters.findIndex(letter => letter === firstLetter);
      
      if (letterIndex === -1) {
        return prev; // Letter not found, shouldn't happen
      }
      
      // Add the first letter to user input and mark it as used
      return {
        ...prev,
        userInput: prev.userInput + firstLetter,
        usedLetters: [...prev.usedLetters, letterIndex],
        hintUsed: true
      };
    });
  }, []);

  // Shuffle the scrambled letters
  const shuffleLetters = useCallback(() => {
    setState(prev => {
      if (prev.gameStatus !== 'playing') {
        return prev;
      }
      
      // Reset user input and used letters since we're shuffling
      const shuffledLetters = shuffleArray(prev.scrambledLetters);
      
      return {
        ...prev,
        scrambledLetters: shuffledLetters,
        userInput: '',
        usedLetters: [],
        hintUsed: false // Reset hint since letters are in new order
      };
    });
  }, []);

  // Change difficulty
  const changeDifficulty = useCallback((difficulty: Difficulty) => {
    setState(prev => ({
      ...prev,
      difficulty,
      gameStatus: 'idle',
      score: 0,
      level: 1,
      userInput: '',
      usedLetters: [],
      hintUsed: false,
      wordLog: [] // Clear word log when changing difficulty
    }));
  }, []);

  return {
    // State
    currentWord: state.currentWord,
    scrambledLetters: state.scrambledLetters,
    userInput: state.userInput,
    score: state.score,
    level: state.level,
    timeRemaining: state.timeRemaining,
    gameStatus: state.gameStatus,
    difficulty: state.difficulty,
    usedLetters: state.usedLetters,
    isChecking: state.isChecking,
    hintUsed: state.hintUsed,
    wordLog: state.wordLog,
    
    // Actions
    handleLetterClick,
    handleWordLetterClick,
    handleSubmit,
    handleSkip,
    useHint,
    shuffleLetters,
    resetGame,
    changeDifficulty
  };
}; 