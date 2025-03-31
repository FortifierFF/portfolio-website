'use client';

import { useState, useCallback, useEffect } from 'react';

// Types for our game
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type GameMode = 'code_to_color' | 'color_to_code' | 'mix_the_color';
export type ColorFormat = 'rgb' | 'hex' | 'hsl';

export interface ColorOption {
  rgb: string;  // "rgb(255, 0, 0)"
  hex: string;  // "#ff0000"
  hsl: string;  // "hsl(0, 100%, 50%)"
}

export interface GameQuestion {
  correctColor: ColorOption;
  options?: ColorOption[];
  difficulty: Difficulty;
  format: ColorFormat;
}

export interface GameSettings {
  difficulty: Difficulty;
  gameMode: GameMode;
  colorFormat: ColorFormat;
  questionsPerRound: number;
  timePerQuestion: number; // in seconds
}

export interface GameStats {
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  timeRemaining: number;
  roundsPlayed: number;
}

// Default game settings
const defaultSettings: GameSettings = {
  difficulty: 'easy',
  gameMode: 'code_to_color',
  colorFormat: 'rgb',
  questionsPerRound: 10,
  timePerQuestion: 15,
};

// Local storage keys
const BEST_SCORE_KEY = 'color-guess-best-score';
const GAME_SETTINGS_KEY = 'color-guess-settings';

export function useGameState() {
  // Game settings - initialize with default, then load from localStorage in a useEffect
  const [settings, setSettings] = useState<GameSettings>(defaultSettings);
  
  // Game state
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mixedColor, setMixedColor] = useState<{ r: number; g: number; b: number }>({ r: 128, g: 128, b: 128 });

  // Game statistics
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    timeRemaining: defaultSettings.timePerQuestion,
    roundsPlayed: 0,
  });

  // Best score - initialize with 0, then load from localStorage in a useEffect
  const [bestScore, setBestScore] = useState<number>(0);
  
  // Load saved settings and best score from localStorage
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Load game settings
    try {
      const savedSettings = localStorage.getItem(GAME_SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        // Update timeRemaining based on loaded settings
        setStats(prevStats => ({
          ...prevStats,
          timeRemaining: parsedSettings.timePerQuestion
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

  // Timer for countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isGameActive && !isGameOver) {
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
  }, [isGameActive, isGameOver]);

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

  // Convert between color formats
  const convertColor = useCallback((color: { r: number; g: number; b: number }): ColorOption => {
    const { r, g, b } = color;
    
    // Calculate RGB string
    const rgb = `rgb(${r}, ${g}, ${b})`;
    
    // Calculate HEX string
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    // Calculate HSL values
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / d + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / d + 4;
          break;
      }
      
      h /= 6;
    }
    
    // Convert to degrees and percentages
    const hDeg = Math.round(h * 360);
    const sPercent = Math.round(s * 100);
    const lPercent = Math.round(l * 100);
    
    const hsl = `hsl(${hDeg}, ${sPercent}%, ${lPercent}%)`;
    
    return { rgb, hex, hsl };
  }, []);

  // Generate a random color based on difficulty
  const generateRandomColor = useCallback((difficulty: Difficulty): { r: number; g: number; b: number } => {
    let r, g, b;
    
    switch (difficulty) {
      case 'easy':
        // Primary and secondary colors with clear differences
        const easyColors = [
          { r: 255, g: 0, b: 0 },    // Red
          { r: 0, g: 255, b: 0 },    // Green
          { r: 0, g: 0, b: 255 },    // Blue
          { r: 255, g: 255, b: 0 },  // Yellow
          { r: 255, g: 0, b: 255 },  // Magenta
          { r: 0, g: 255, b: 255 },  // Cyan
          { r: 255, g: 128, b: 0 },  // Orange
          { r: 128, g: 0, b: 255 },  // Purple
        ];
        return easyColors[Math.floor(Math.random() * easyColors.length)];
        
      case 'medium':
        // More varied colors but still distinctive
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
        return { r, g, b };
        
      case 'hard':
        // Generate a base color
        const baseR = Math.floor(Math.random() * 256);
        const baseG = Math.floor(Math.random() * 256);
        const baseB = Math.floor(Math.random() * 256);
        return { r: baseR, g: baseG, b: baseB };
        
      case 'expert':
        // Generate a base color
        const expertBaseR = Math.floor(Math.random() * 256);
        const expertBaseG = Math.floor(Math.random() * 256);
        const expertBaseB = Math.floor(Math.random() * 256);
        return { r: expertBaseR, g: expertBaseG, b: expertBaseB };
        
      default:
        // Default random color
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
        return { r, g, b };
    }
  }, []);

  // Generate similar colors for options based on difficulty
  const generateSimilarColors = useCallback((
    baseColor: { r: number; g: number; b: number },
    difficulty: Difficulty,
    count: number
  ): { r: number; g: number; b: number }[] => {
    const colors: { r: number; g: number; b: number }[] = [baseColor];
    
    // Define the maximum variation based on difficulty
    let variation: number;
    switch (difficulty) {
      case 'easy':
        variation = 100; // Large variation for easy
        break;
      case 'medium':
        variation = 50;  // Medium variation
        break;
      case 'hard':
        variation = 30;  // Small variation for hard
        break;
      case 'expert':
        variation = 15;  // Very small variation for expert
        break;
      default:
        variation = 50;
    }
    
    // Generate similar colors
    while (colors.length < count) {
      // Create a color with variation from the base
      let r = baseColor.r + Math.floor(Math.random() * variation * 2) - variation;
      let g = baseColor.g + Math.floor(Math.random() * variation * 2) - variation;
      let b = baseColor.b + Math.floor(Math.random() * variation * 2) - variation;
      
      // Ensure values are within 0-255 range
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));
      
      // Add the new color
      colors.push({ r, g, b });
    }
    
    // Remove the base color if it's the first one (we'll shuffle later)
    colors.shift();
    
    return colors;
  }, []);

  // Generate a question
  const generateQuestion = useCallback((): GameQuestion => {
    const { difficulty, gameMode, colorFormat } = settings;
    
    // Generate correct color
    const correctColorRGB = generateRandomColor(difficulty);
    const correctColor = convertColor(correctColorRGB);
    
    // Generate options
    let options: ColorOption[] = [];
    
    if (gameMode === 'code_to_color' || gameMode === 'color_to_code') {
      // Generate 3 similar colors as distractors
      const similarColorsRGB = generateSimilarColors(correctColorRGB, difficulty, 4);
      
      // Convert to ColorOption objects
      const similarColors = similarColorsRGB.map(color => convertColor(color));
      
      // Add correct color and shuffle
      options = [correctColor, ...similarColors];
      options = shuffleArray(options);
    }
    
    return {
      correctColor,
      options,
      difficulty,
      format: colorFormat,
    };
  }, [settings, generateRandomColor, generateSimilarColors, convertColor]);

  // Shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Start a new game
  const startGame = useCallback(() => {
    setIsGameActive(true);
    setIsGameOver(false);
    
    setStats({
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
      timeRemaining: settings.timePerQuestion * settings.questionsPerRound, // Total time for all questions
      roundsPlayed: stats.roundsPlayed + 1,
    });
    
    setSelectedOption(null);
    setIsCorrect(null);
    setMixedColor({ r: 128, g: 128, b: 128 }); // Reset mixed color
    
    const newQuestion = generateQuestion();
    setCurrentQuestion(newQuestion);
  }, [settings, generateQuestion, stats.roundsPlayed]);

  // Reset the game (return to settings screen)
  const resetGame = useCallback(() => {
    setIsGameActive(false);
    setIsGameOver(false);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setIsCorrect(null);
  }, []);

  // Calculate color similarity percentage (for Mix the Color mode)
  const calculateColorSimilarity = useCallback((color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number => {
    // Calculate the Euclidean distance in RGB space
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;
    
    const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    
    // Maximum possible distance in RGB space is sqrt(3 * 255^2)
    const maxDistance = Math.sqrt(3 * 255 * 255);
    
    // Convert to similarity percentage (0-100)
    const similarity = 100 * (1 - distance / maxDistance);
    
    return Math.round(similarity);
  }, []);

  // Submit an answer
  const submitAnswer = useCallback((selectedIndex: number | null) => {
    if (!currentQuestion || !isGameActive || isGameOver) return;
    
    let isAnswerCorrect = false;
    
    if (settings.gameMode === 'mix_the_color') {
      // For Mix the Color mode, calculate the similarity percentage
      const similarity = calculateColorSimilarity(
        { r: mixedColor.r, g: mixedColor.g, b: mixedColor.b },
        // Extract RGB values from the correct color
        {
          r: parseInt(currentQuestion.correctColor.rgb.match(/\d+/g)![0]),
          g: parseInt(currentQuestion.correctColor.rgb.match(/\d+/g)![1]),
          b: parseInt(currentQuestion.correctColor.rgb.match(/\d+/g)![2])
        }
      );
      
      // Consider it correct if similarity is above threshold based on difficulty
      const thresholds = {
        easy: 80,
        medium: 85,
        hard: 90,
        expert: 95
      };
      
      isAnswerCorrect = similarity >= thresholds[currentQuestion.difficulty];
      setSelectedOption(similarity);
    } else {
      // For code_to_color and color_to_code modes
      if (selectedIndex === null) return;
      
      setSelectedOption(selectedIndex);
      isAnswerCorrect = currentQuestion.options![selectedIndex] === currentQuestion.correctColor;
    }
    
    setIsCorrect(isAnswerCorrect);
    
    // Update game stats
    setStats(prevStats => {
      const newStreak = isAnswerCorrect ? prevStats.streak + 1 : 0;
      const newBestStreak = Math.max(prevStats.bestStreak, newStreak);
      
      // Calculate score based on difficulty and streak
      let pointsForCorrect = isAnswerCorrect ? 10 : 0;
      if (isAnswerCorrect) {
        switch (currentQuestion.difficulty) {
          case 'easy':
            pointsForCorrect = 10;
            break;
          case 'medium':
            pointsForCorrect = 20;
            break;
          case 'hard':
            pointsForCorrect = 35;
            break;
          case 'expert':
            pointsForCorrect = 50;
            break;
        }
        
        // Bonus for streak
        if (newStreak >= 3) {
          pointsForCorrect = Math.floor(pointsForCorrect * (1 + (newStreak * 0.1)));
        }
      }
      
      return {
        ...prevStats,
        score: prevStats.score + pointsForCorrect,
        questionsAnswered: prevStats.questionsAnswered + 1,
        correctAnswers: prevStats.correctAnswers + (isAnswerCorrect ? 1 : 0),
        streak: newStreak,
        bestStreak: newBestStreak,
      };
    });
    
    // After a short delay, show the next question or end the game
    setTimeout(() => {
      // Check if we've reached the question limit
      if (stats.questionsAnswered + 1 >= settings.questionsPerRound) {
        setIsGameOver(true);
        return;
      }
      
      // Reset for next question
      setSelectedOption(null);
      setIsCorrect(null);
      setMixedColor({ r: 128, g: 128, b: 128 }); // Reset mixed color
      
      // Generate a new question
      const newQuestion = generateQuestion();
      setCurrentQuestion(newQuestion);
    }, 1500);
  }, [
    currentQuestion, 
    isGameActive, 
    isGameOver, 
    settings.gameMode, 
    settings.questionsPerRound,
    mixedColor,
    stats.questionsAnswered,
    calculateColorSimilarity,
    generateQuestion
  ]);

  // Update mixed color (for Mix the Color mode)
  const updateMixedColor = useCallback((color: { r: number; g: number; b: number }) => {
    setMixedColor(color);
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  }, []);
  
  return {
    settings,
    isGameActive,
    isGameOver,
    currentQuestion,
    selectedOption,
    isCorrect,
    mixedColor,
    stats,
    bestScore,
    setSelectedOption,
    updateMixedColor,
    startGame,
    resetGame,
    submitAnswer,
    updateSettings,
    convertColor,
  };
} 