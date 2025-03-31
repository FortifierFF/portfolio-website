import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  emoji: string;
  tags: string[];
  link: string;
}

export function ProjectCard({
  title,
  description,
  emoji,
  tags,
  link,
}: ProjectCardProps) {
  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group transition-all hover:border-blue-900/50 hover:shadow-lg hover:shadow-blue-900/10">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-400">{title}</h3>
          <span className="text-3xl" role="img" aria-label="Project icon">
            {emoji}
          </span>
        </div>
        <p className="text-gray-400 mb-4">{description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-4 bg-gray-900 flex justify-end">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" className="text-blue-500 hover:text-blue-400 hover:bg-blue-900/20">
            View Project <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  );
} 