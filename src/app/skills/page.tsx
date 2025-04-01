'use client';

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

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Technical Expertise
          </span>
        </h1>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          A comprehensive overview of my technical skills and expertise across various domains
          in software development and design.
        </p>
        
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
    </main>
  );
} 