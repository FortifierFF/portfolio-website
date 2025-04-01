import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface GameCardProps {
  title: string;
  description: string;
  link: string;
  image?: string;
  isComingSoon?: boolean;
}

// Generate a consistent color based on game title
function generatePlaceholderColor(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 35%)`;
}

export function GameCard({ title, description, link, image, isComingSoon = false }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const placeholderColor = generatePlaceholderColor(title);
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group transition-all hover:border-blue-900/50 hover:shadow-lg hover:shadow-blue-900/10">
      {/* Game Preview Area */}
      <div className="relative h-48 bg-gray-800 overflow-hidden flex items-center justify-center">
        {image && !imageError ? (
          <Image 
            src={image} 
            alt={`${title} preview`} 
            width={400} 
            height={200} 
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <div 
            className="flex items-center justify-center h-full w-full transition-colors"
            style={{ backgroundColor: placeholderColor }}
          >
            <span className="text-white text-xl font-bold opacity-70">{title}</span>
          </div>
        )}
        
        {/* Coming Soon Overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-blue-600 px-4 py-2 rounded-md rotate-12 shadow-lg text-white font-bold">
              Coming Soon
            </div>
          </div>
        )}
      </div>
      
      {/* Game Info */}
      <div className="p-6 border-t border-gray-800">
        <h3 className="text-xl font-bold mb-2 text-blue-400">{title}</h3>
        <p className="text-gray-400 mb-4">
          {description}
        </p>
        {isComingSoon ? (
          <span className="text-gray-500 italic">In Development</span>
        ) : (
          <Link href={link} className="block">
            <Button variant="link" className="text-blue-500 hover:text-blue-400 p-0 flex items-center">
              Play Now <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
} 