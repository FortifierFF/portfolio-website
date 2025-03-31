import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BoardSize } from "./use-game-state";

interface CardProps {
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled: boolean;
  boardSize?: BoardSize;
}

export function Card({ 
  emoji, 
  isFlipped, 
  isMatched, 
  onClick, 
  disabled,
  boardSize = '4x4' 
}: CardProps) {
  // If card is matched, don't render it
  if (isMatched) {
    return (
      <div className="relative aspect-square bg-transparent"></div>
    );
  }

  // Determine emoji size based on board size
  const getEmojiSize = () => {
    switch (boardSize) {
      case '4x4': return 'text-2xl sm:text-3xl';
      case '6x6': return 'text-2xl sm:text-3xl';
      case '8x8': return 'text-2xl sm:text-3xl';
      default: return 'text-5xl';
    }
  };

  // Get card size class based on board size
  const getCardSizeClass = () => {
    switch (boardSize) {
      case '4x4': return 'max-w-none';
      case '6x6': return 'max-w-none';
      case '8x8': return 'max-w-none'; // Default - full width
      default: return 'max-w-[75px] sm:max-w-[85px]';
    }
  };

  return (
    <div className={cn("relative aspect-square mx-auto w-full", getCardSizeClass())}>
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        onClick={!disabled ? onClick : undefined}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Card back */}
        <div
          className={cn(
            "absolute w-full h-full rounded-lg backface-hidden flex items-center justify-center bg-gray-800 border-2",
            !disabled && !isFlipped ? "hover:border-blue-600" : "",
            "border-blue-800 shadow-md"
          )}
        >
          <span className={cn("text-gray-600", boardSize === '4x4' ? 'text-2xl' : 'text-xl')}>?</span>
        </div>

        {/* Card front with emoji */}
        <div
          className={cn(
            "absolute w-full h-full rounded-lg backface-hidden flex items-center justify-center bg-gray-900 border-2 rotateY-180",
            "border-blue-800 shadow-lg"
          )}
        >
          <div className="emoji-container">
            <span 
              className={cn("card-emoji", getEmojiSize())} 
              role="img" 
              aria-label="card emoji"
            >
              {emoji}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 