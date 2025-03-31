'use client';

import { GameBoard } from '@/components/games/2048/game-board';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Game2048Page() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center">
          <Link 
            href="/#mini-games" 
            className="text-blue-500 hover:text-blue-400 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              2048
            </span>
          </h1>
          <p className="text-center text-gray-400 mb-10">
            Combine the numbers to reach the 2048 tile! Use arrow keys or swipe to play.
          </p>
          
          <GameBoard />

          <div className="mt-12 bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-blue-400">How to Play</h2>
            <ul className="space-y-2 text-gray-300">
              <li><span className="text-blue-400">➤</span> Use your arrow keys to move the tiles.</li>
              <li><span className="text-blue-400">➤</span> When two tiles with the same number touch, they merge into one!</li>
              <li><span className="text-blue-400">➤</span> Create a tile with the number 2048 to win the game.</li>
              <li><span className="text-blue-400">➤</span> If the board fills up and no more moves are possible, the game is over.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 