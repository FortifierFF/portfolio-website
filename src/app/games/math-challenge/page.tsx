'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const GameBoard = dynamic(
  () => import('@/components/games/math-challenge/game-board').then(mod => mod.GameBoard),
  { ssr: false }
);

export default function MathChallengePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-8">
      <div className="container mx-auto px-4 mt-10">
        {/* Navigation back to games section */}
        <div className="mb-8">
          <Link 
            href="/#games" 
            className="inline-flex items-center text-gray-300 hover:text-blue-400 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Games</span>
          </Link>
        </div>
        
        {/* Game component - dynamically loaded with no SSR */}
        <GameBoard />
      </div>
    </main>
  );
} 