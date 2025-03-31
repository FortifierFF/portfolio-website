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
      case '4x4': return 'text-5xl';
      case '6x6': return 'text-3xl';
      case '8x8': return 'text-2xl';
      default: return 'text-4xl';
    }
  };

  return (
    <div className="relative aspect-square">
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
          <span className={getEmojiSize()} role="img" aria-label="card emoji">
            {emoji}
          </span>
        </div>
      </motion.div>
    </div>
  );
} 