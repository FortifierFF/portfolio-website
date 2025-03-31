import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled: boolean;
}

export function Card({ emoji, isFlipped, isMatched, onClick, disabled }: CardProps) {
  // If card is matched, don't render it
  if (isMatched) {
    return (
      <div className="relative aspect-square bg-transparent"></div>
    );
  }

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
          <span className="text-2xl text-gray-600">?</span>
        </div>

        {/* Card front with emoji */}
        <div
          className={cn(
            "absolute w-full h-full rounded-lg backface-hidden flex items-center justify-center bg-gray-900 border-2 rotateY-180",
            "border-blue-800 shadow-lg"
          )}
        >
          <span className="text-5xl" role="img" aria-label="card emoji">
            {emoji}
          </span>
        </div>
      </motion.div>
    </div>
  );
} 