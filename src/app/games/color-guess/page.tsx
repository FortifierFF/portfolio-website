'use client';

import { GameBoard } from '@/components/games/color-guess/game-board';

export default function ColorGuessPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 mt-10">
        <GameBoard />
      </div>
    </div>
  );
} 