'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProjectCard } from '@/components/project-card';
import { GameCard } from '@/components/game-card';
import { useToast } from '@/components/ui/toast';
import { Github, Linkedin, FileCode, Copy } from 'lucide-react';

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
    link: '#',
    isComingSoon: true
  }
];

// Skills grouped by category
const skillCategories = [
  {
    name: 'Front-End',
    skills: ['JavaScript (ES6+)', 'TypeScript', 'React.js', 'Next.js', 'HTML5', 'CSS3', 'SCSS']
  },
  {
    name: 'UI Libraries',
    skills: ['Tailwind CSS', 'Bootstrap', 'Chakra UI', 'Material UI', 'Shadcn UI']
  },
  {
    name: 'State & APIs',
    skills: ['Redux Toolkit', 'React Query', 'Formik', 'REST APIs', 'Axios', 'i18n']
  },
  {
    name: 'Tools & Build',
    skills: ['Webpack', 'Babel', 'Vite', 'Git', 'GitHub', 'GitLab', 'Jest', 'Postman']
  },
  {
    name: 'Frameworks',
    skills: ['Agile', 'Jira', 'Trello', 'Pair Programming', 'Code Reviews']
  },
  {
    name: 'Other Expertise',
    skills: ['Java', 'C++', 'Blockchain', 'Web3', 'Unreal Engine', 'Figma']
  }
];

// Social links
const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/FortifierFF',
    icon: <Github />
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/lyusien-nistorov-428a48253',
    icon: <Linkedin />
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to/fortifier',
    icon: <FileCode />
  },
  {
    name: 'Discord',
    action: 'copy',
    value: 'fortifier',
    icon: <Copy />
  }
];

export default function Home() {
  const { showToast } = useToast();

  const handleDiscordClick = () => {
    navigator.clipboard.writeText('fortifier')
      .then(() => {
        showToast({
          message: 'Discord username copied to clipboard!',
          type: 'success',
          duration: 3000
        });
      })
      .catch(() => {
        showToast({
          message: 'Failed to copy Discord username',
          type: 'error',
          duration: 3000
        });
      });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <section id="home" className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <div className="max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-blue-500">Hello, I&apos;m</span> <br />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Lyusien Nistorov
            </span>
          </h1>
          <h2 className="mb-8 text-2xl font-medium text-gray-300">
            Front-End Developer | Web3 Enthusiast | Game Developer
          </h2>
          <p className="mb-8 text-lg text-gray-400">
            Crafting exceptional digital experiences with React, Next.js, and modern JavaScript. 
            Building fast, scalable, and user-friendly applications with a passion for 
            blockchain technologies and game development.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="#projects">View My Work</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-500 hover:bg-blue-950">
              <Link href="#contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          
          <div className="space-y-6 text-gray-300">
            <p>
              Front-End Developer with almost <span className="text-blue-400 font-semibold">3 years of experience</span> building 
              fast, scalable, and user-friendly web applications using React, Next.js, and modern JavaScript frameworks. 
              Passionate about creating intuitive interfaces, optimizing performance, and delivering seamless digital experiences.
            </p>
            
            <p>
              I thrive in Agile environments, collaborating closely with designers and backend developers to 
              transform concepts into reality. My approach combines technical expertise with a keen eye for design 
              details, ensuring pixel-perfect implementations that delight users.
            </p>
            
            <p>
              Beyond front-end development, I explore the exciting world of <span className="text-blue-400 font-semibold">blockchain and Web3 technologies</span>, 
              constantly investigating how decentralized applications can shape our future. My background in Java and C++ 
              provides me with versatility across different technical domains.
            </p>
            
            <p>
              As a creative outlet, I develop games with <span className="text-blue-400 font-semibold">Unreal Engine</span>, blending artistic vision with 
              technical skill to craft immersive experiences. Whether building responsive web apps or engaging virtual worlds, 
              I&apos;m passionate about solving complex problems and pushing technological boundaries.
            </p>
            
            <p>
              Always eager to learn and innovate, I stay current with industry trends to continuously refine my skills 
              and deliver cutting-edge solutions that make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
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
      </section>

      {/* Mini Games Section */}
      <section id="mini-games" className="py-20 px-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Mini Games
            </span>
          </h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            A collection of fun, interactive games I&apos;ve developed. Play directly in your browser!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {games.map((game) => (
              <GameCard
                key={game.title}
                title={game.title}
                description={game.description}
                link={game.link}
                image={game.image}
                isComingSoon={game.isComingSoon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Technical Expertise
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category) => (
              <div key={category.name} className="bg-gray-800 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-blue-400">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="text-sm px-3 py-1 bg-gray-700 text-gray-300 rounded-full hover:bg-blue-900 hover:text-blue-100 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-8 bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <p className="text-gray-300 mb-8 text-center">
              I&apos;m currently open to new opportunities and collaborations. Whether you have a project in mind,
              want to discuss emerging technologies, or just want to connect, I&apos;d love to hear from you!
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <a href="mailto:your.email@example.com">Let&apos;s Connect</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-8 flex justify-center gap-8">
            {socialLinks.map((link) => (
              link.action === 'copy' ? (
                <button 
                  key={link.name}
                  onClick={handleDiscordClick}
                  className="flex items-center gap-2 hover:text-blue-500 transition-colors text-lg"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </button>
              ) : (
                <a 
                  key={link.name}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-500 transition-colors text-lg"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </a>
              )
            ))}
          </div>
          <p>© {new Date().getFullYear()} Lyusien Nistorov. All rights reserved.</p>
          <p className="mt-4 text-sm text-gray-500">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
}
