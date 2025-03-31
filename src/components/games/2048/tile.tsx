'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TileProps {
  value: number;
  position: {
    row: number;
    col: number;
  };
}

// Color mapping for different tile values
const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: 'bg-blue-100 text-gray-900',
    4: 'bg-blue-200 text-gray-900',
    8: 'bg-blue-300 text-gray-900',
    16: 'bg-blue-400 text-white',
    32: 'bg-blue-500 text-white',
    64: 'bg-blue-600 text-white',
    128: 'bg-blue-700 text-white',
    256: 'bg-purple-500 text-white',
    512: 'bg-purple-600 text-white',
    1024: 'bg-purple-700 text-white',
    2048: 'bg-purple-800 text-white',
  };

  return colors[value] || 'bg-purple-900 text-white';
};

// Font size mapping for different tile values
const getFontSize = (value: number): string => {
  if (value < 100) return 'text-2xl sm:text-3xl';
  if (value < 1000) return 'text-xl sm:text-2xl';
  return 'text-base sm:text-xl';
};

export function Tile({ value, position }: TileProps) {
  // Calculate position based on grid
  const positionStyle = {
    top: `calc(${position.row * 25}% + 2px)`,
    left: `calc(${position.col * 25}% + 2px)`,
    width: 'calc(25% - 4px)',
    height: 'calc(25% - 4px)',
  };

  return (
    <motion.div
      className={cn(
        'absolute rounded-md flex items-center justify-center font-bold shadow-md',
        getTileColor(value)
      )}
      style={positionStyle}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <span className={cn(getFontSize(value))}>
        {value}
      </span>
    </motion.div>
  );
} 