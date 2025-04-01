'use client';

import { ProjectCard } from '@/components/project-card';

// Project data
const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'A responsive e-commerce platform with cart functionality, user authentication, and payment integration.',
    emoji: '🛒',
    tags: ['Next.js', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS'],
    link: '#',
    isComingSoon: true
  },
  {
    title: 'Web3 DApp',
    description: 'Decentralized application connecting to blockchain networks with wallet integration and smart contract interactions.',
    emoji: '⛓️',
    tags: ['React', 'Ethereum', 'Web3.js', 'Solidity'],
    link: '#',
    isComingSoon: true
  },
  {
    title: 'Immersive Game Experience',
    description: 'An engaging 3D game built with Unreal Engine, featuring dynamic environments and interactive gameplay.',
    emoji: '🎮',
    tags: ['Unreal Engine', 'C++', 'Blueprint', '3D Design'],
    link: '#',
    isComingSoon: true
  }
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Featured Projects
          </span>
        </h1>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          A collection of my recent projects showcasing my skills and expertise in web development,
          blockchain technologies, and game development.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              emoji={project.emoji}
              tags={project.tags}
              link={project.link}
              isComingSoon={project.isComingSoon}
            />
          ))}
        </div>
      </div>
    </main>
  );
} 