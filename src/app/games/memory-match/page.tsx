'use client';

import { MemoryMatchGame } from '@/components/games/memory-match/memory-match-game';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MemoryMatchPage() {
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
              Memory Match
            </span>
          </h1>
          <p className="text-center text-gray-400 mb-10">
            Flip cards and find matching pairs. Try to complete the game in as few moves as possible!
          </p>
          
          <MemoryMatchGame />
        </div>
      </div>
    </main>
  );
} 