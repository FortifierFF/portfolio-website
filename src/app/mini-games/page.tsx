'use client';

import { Button } from '@/components/ui/button';
import { GameCard } from '@/components/game-card';
import { MessageSquarePlus } from 'lucide-react';

// Games data
const games = [
  {
    title: 'Memory Match',
    description: 'Test your memory by matching pairs of cards in this classic game.',
    link: '/games/memory-match',
    image: '/images/memory-match.jpg'
  },
  {
    title: '2048',
    description: 'Combine tiles to reach 2048 in this addictive puzzle game.',
    link: '/games/2048',
    image: '/images/2048.png'
  },
  {
    title: 'Color Guess',
    description: 'Test your knowledge of colors and RGB values in this challenging game.',
    link: '/games/color-guess',
    image: '/images/color-guess.webp'
  },
  {
    title: 'Math Challenge',
    description: 'Solve math problems against the clock to improve your mental math.',
    link: '/games/math-challenge',
    image: '/images/math-challenge.webp'
  },
  {
    title: 'Word Puzzle',
    description: 'Rearrange letters to form words and test your vocabulary skills.',
    link: '/games/word-puzzle',
    image: '/images/wordPuzzle.jpg'
  }
];

const MiniGamesPage = () => {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-between mb-12">
          <h1 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Mini Games Collection
            </span>
          </h1>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            onClick={() => window.location.href = 'mailto:your.email@example.com?subject=Game Suggestion'}
          >
            <MessageSquarePlus />
            Suggest a Game
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {games.map((game) => (
            <GameCard
              key={game.title}
              title={game.title}
              description={game.description}
              link={game.link}
              image={game.image}
            />
          ))}
        </div>

        <p className="text-center text-gray-400 italic">
          More games coming soon! Check back regularly for updates.
        </p>
      </div>
    </main>
  );
};

export default MiniGamesPage; 