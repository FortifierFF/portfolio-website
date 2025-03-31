import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  link: string;
}

export function GameCard({ title, description, link }: GameCardProps) {
  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group transition-all hover:border-blue-900/50 hover:shadow-lg hover:shadow-blue-900/10">
      {/* Game Preview Area */}
      <div className="h-48 bg-gray-800 flex items-center justify-center text-gray-700 group-hover:text-gray-600 transition-colors">
        <span className="text-sm">Game Preview</span>
      </div>
      
      {/* Game Info */}
      <div className="p-6 border-t border-gray-800">
        <h3 className="text-xl font-bold mb-2 text-blue-400">{title}</h3>
        <p className="text-gray-400 mb-4">
          {description}
        </p>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Button variant="link" className="text-blue-500 hover:text-blue-400 p-0 flex items-center">
            Play Now <ExternalLink className="ml-1 h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  );
} 