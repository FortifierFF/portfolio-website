'use client';

import { useState, useCallback, useEffect } from 'react';

// Types for our game
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type GameMode = 'timed' | 'survival' | 'precision';

export interface Problem {
  question: string;
  answer: number;
  options?: number[]; // For multiple choice
  difficulty: Difficulty;
  operation: OperationType;
}

export interface GameSettings {
  difficulty: Difficulty;
  operations: OperationType[];
  gameMode: GameMode;
  duration: number; // in seconds, for timed mode
  questionLimit: number; // for precision/progressive mode
}

export interface GameStats {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  timeRemaining: number;
}

// Default game settings
const defaultSettings: GameSettings = {
  difficulty: 'easy',
  operations: ['addition', 'subtraction'],
  gameMode: 'timed',
  duration: 60,
  questionLimit: 10,
};

// Local storage keys
const BEST_SCORE_KEY = 'math-challenge-best-score';
const GAME_SETTINGS_KEY = 'math-challenge-settings';

export function useGameState() {
  // Game settings - initialize with default, then load from localStorage in a useEffect
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  
  // Game state
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Game statistics
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    timeRemaining: defaultSettings.duration,
  });

  // Best score - initialize with 0, then load from localStorage in a useEffect
  const [bestScore, setBestScore] = useState<number>(0);
  
  // Load saved settings and best score from localStorage
  useEffect(() => {
    // Load game settings
    try {
      const savedSettings = localStorage.getItem(GAME_SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        // Update timeRemaining based on loaded settings
        setStats(prevStats => ({
          ...prevStats,
          timeRemaining: parsedSettings.duration
        }));
      }
    } catch (e) {
      console.error('Failed to load saved settings', e);
    }
    
    // Load best score
    try {
      const savedBestScore = localStorage.getItem(BEST_SCORE_KEY);
      if (savedBestScore) {
        setBestScore(parseInt(savedBestScore, 10));
      }
    } catch (e) {
      console.error('Failed to load best score', e);
    }
  }, []);

  // Timer for timed/survival modes
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isGameActive && !isGameOver && 
        (settings.gameMode === 'timed' || settings.gameMode === 'survival')) {
      timer = setInterval(() => {
        setStats(prevStats => {
          const newTimeRemaining = prevStats.timeRemaining - 1;
          
          // Check if time is up
          if (newTimeRemaining <= 0) {
            setIsGameOver(true);
            if (timer) clearInterval(timer);
          }
          
          return {
            ...prevStats,
            timeRemaining: Math.max(0, newTimeRemaining)
          };
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameActive, isGameOver, settings.gameMode]);

  // Update best score when game ends
  useEffect(() => {
    if (isGameOver && stats.score > bestScore) {
      setBestScore(stats.score);
      try {
        localStorage.setItem(BEST_SCORE_KEY, stats.score.toString());
      } catch (e) {
        console.error('Failed to save best score', e);
      }
    }
  }, [isGameOver, stats.score, bestScore]);

  // Save settings when they change
  useEffect(() => {
    try {
      localStorage.setItem(GAME_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // Generate a random number based on difficulty
  const getRandomNumber = useCallback((difficulty: Difficulty): number => {
    switch (difficulty) {
      case 'easy':
        return Math.floor(Math.random() * 10); // 0-9
      case 'medium':
        return Math.floor(Math.random() * 20); // 0-19
      case 'hard':
        return Math.floor(Math.random() * 50); // 0-49
      case 'expert':
        return Math.floor(Math.random() * 100); // 0-99
    }
  }, []);

  // Generate a math problem based on settings
  const generateProblem = useCallback((): Problem => {
    const { difficulty, operations } = settings;
    
    // Pick a random operation from the allowed operations
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer, question;
    
    switch (operation) {
      case 'addition':
        num1 = getRandomNumber(difficulty);
        num2 = getRandomNumber(difficulty);
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
        
      case 'subtraction':
        // Ensure num1 >= num2 to avoid negative answers for easier difficulties
        num1 = getRandomNumber(difficulty);
        num2 = difficulty === 'easy' || difficulty === 'medium' 
          ? Math.min(num1, getRandomNumber(difficulty)) 
          : getRandomNumber(difficulty);
        answer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
        
      case 'multiplication':
        // Make multipliers smaller for easier calculation
        num1 = difficulty === 'easy' ? Math.floor(Math.random() * 5) + 1 : getRandomNumber(difficulty);
        num2 = difficulty === 'easy' ? Math.floor(Math.random() * 5) + 1 : getRandomNumber(difficulty);
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
        
      case 'division':
        // Generate division problems that result in whole numbers
        num2 = difficulty === 'easy' 
          ? Math.floor(Math.random() * 5) + 1 // divisor between 1-5 for easy
          : Math.floor(Math.random() * 9) + 1; // divisor between 1-9 for others
        
        answer = difficulty === 'easy' || difficulty === 'medium'
          ? Math.floor(Math.random() * 10) // quotient between 0-9
          : Math.floor(Math.random() * 20); // quotient between 0-19
          
        num1 = answer * num2; // dividend that ensures whole number result
        question = `${num1} ÷ ${num2} = ?`;
        break;
        
      default:
        // Default to addition if something goes wrong
        num1 = getRandomNumber(difficulty);
        num2 = getRandomNumber(difficulty);
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
    }
    
    // Generate multiple choice options if needed
    const options = generateOptions(answer, difficulty);
    
    return {
      question,
      answer,
      options,
      difficulty,
      operation,
    };
  }, [settings, getRandomNumber]);

  // Generate multiple choice options
  const generateOptions = useCallback((correctAnswer: number, difficulty: Difficulty): number[] => {
    const options: number[] = [correctAnswer];
    
    // Determine the range for incorrect options based on difficulty
    let range;
    switch (difficulty) {
      case 'easy':
        range = 5;
        break;
      case 'medium':
        range = 10;
        break;
      case 'hard':
        range = 20;
        break;
      case 'expert':
        range = 50;
        break;
    }
    
    // Generate 3 incorrect options
    while (options.length < 4) {
      const wrongAnswer = correctAnswer + Math.floor(Math.random() * range * 2) - range;
      if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  }, []);

  // Start a new game
  const startGame = useCallback(() => {
    setIsGameActive(true);
    setIsGameOver(false);
    
    // Set initial time based on game mode
    const initialTime = settings.gameMode === 'survival' ? 10 : settings.duration;
    
    setStats({
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
      timeRemaining: initialTime,
    });
    setUserAnswer('');
    setIsCorrect(null);
    
    const newProblem = generateProblem();
    setCurrentProblem(newProblem);
  }, [settings, generateProblem]);

  // Reset the game (return to settings screen)
  const resetGame = useCallback(() => {
    setIsGameActive(false);
    setIsGameOver(false);
    setCurrentProblem(null);
    setUserAnswer('');
    setIsCorrect(null);
  }, []);

  // Submit an answer to the current problem
  const submitAnswer = useCallback((answer: string) => {
    if (!currentProblem || !isGameActive || isGameOver) return;
    
    const parsedAnswer = parseInt(answer, 10);
    const isAnswerCorrect = !isNaN(parsedAnswer) && parsedAnswer === currentProblem.answer;
    
    setIsCorrect(isAnswerCorrect);
    
    // Update game stats
    setStats(prevStats => {
      const newStreak = isAnswerCorrect ? prevStats.streak + 1 : 0;
      const newBestStreak = Math.max(prevStats.bestStreak, newStreak);
      
      // Calculate score based on difficulty and streak
      let pointsForProblem = isAnswerCorrect ? 10 : 0;
      if (isAnswerCorrect) {
        switch (currentProblem.difficulty) {
          case 'easy':
            pointsForProblem = 10;
            break;
          case 'medium':
            pointsForProblem = 20;
            break;
          case 'hard':
            pointsForProblem = 30;
            break;
          case 'expert':
            pointsForProblem = 50;
            break;
        }
        
        // Apply streak multiplier
        if (newStreak >= 10) {
          pointsForProblem *= 3; // Triple points for 10+ streak
        } else if (newStreak >= 5) {
          pointsForProblem *= 2; // Double points for 5+ streak
        } else if (newStreak >= 3) {
          pointsForProblem = Math.round(pointsForProblem * 1.5); // 1.5x points for 3+ streak
        }
      }
      
      // Add time for correct answers in survival mode
      let additionalTime = 0;
      if (settings.gameMode === 'survival' && isAnswerCorrect) {
        // Add time based on difficulty
        switch (currentProblem.difficulty) {
          case 'easy':
            additionalTime = 3; // 3 seconds for easy
            break;
          case 'medium':
            additionalTime = 4; // 4 seconds for medium
            break;
          case 'hard':
            additionalTime = 5; // 5 seconds for hard
            break;
          case 'expert':
            additionalTime = 6; // 6 seconds for expert
            break;
        }
      }
      
      return {
        ...prevStats,
        score: prevStats.score + pointsForProblem,
        questionsAnswered: prevStats.questionsAnswered + 1,
        correctAnswers: prevStats.correctAnswers + (isAnswerCorrect ? 1 : 0),
        streak: newStreak,
        bestStreak: newBestStreak,
        timeRemaining: prevStats.timeRemaining + additionalTime
      };
    });
    
    // After a shorter delay, show the next problem
    setTimeout(() => {
      // Check if game should be over (reached question limit in precision mode)
      if (settings.gameMode === 'precision' && stats.questionsAnswered + 1 >= settings.questionLimit) {
        setIsGameOver(true);
        return;
      }
      
      // Reset for next problem
      setUserAnswer('');
      setIsCorrect(null);
      
      // Generate a new problem
      const newProblem = generateProblem();
      setCurrentProblem(newProblem);
    }, 800); // Reduced from 1500ms to 800ms for faster gameplay
  }, [currentProblem, isGameActive, isGameOver, generateProblem, settings.gameMode, settings.questionLimit, stats.questionsAnswered, settings.difficulty]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // Reset timeRemaining if duration changed
      if (newSettings.duration !== undefined && newSettings.duration !== prev.duration) {
        setStats(prevStats => ({
          ...prevStats,
          timeRemaining: newSettings.duration!
        }));
      }
      return updated;
    });
  }, []);
  
  return {
    settings,
    isGameActive,
    isGameOver,
    currentProblem,
    userAnswer,
    isCorrect,
    stats,
    bestScore,
    setUserAnswer,
    startGame,
    resetGame,
    submitAnswer,
    updateSettings,
  };
} 