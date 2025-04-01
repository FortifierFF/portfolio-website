// Navigation sections with their IDs and display names
export const navSections = [
  {
    id: 'home',
    label: 'Home',
    path: '/'
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects'
  },
  {
    id: 'mini-games',
    label: 'Mini Games',
    path: '/mini-games'
  },
  {
    id: 'skills',
    label: 'Skills',
    path: '/skills'
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/#contact' // Keep this as a section link
  }
];

// Helper function to get section offsets for scroll behavior
export const getSectionOffsets = () => {
  const sections = document.querySelectorAll('section[id]');
  const offsets: { [key: string]: number } = {};
  
  sections.forEach(section => {
    const id = section.getAttribute('id');
    if (id) {
      offsets[id] = section.getBoundingClientRect().top + window.scrollY;
    }
  });
  
  return offsets;
};

// Helper function to determine active section based on scroll position
export const getActiveSectionId = (offsets: { [key: string]: number }, scrollY: number) => {
  let activeSection = 'home';
  
  Object.entries(offsets).forEach(([id, offset]) => {
    if (scrollY >= offset - 100) { // 100px offset for better UX
      activeSection = id;
    }
  });
  
  return activeSection;
};

// Helper function to navigate to a section on the homepage
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop,
      behavior: 'smooth'
    });
  }
} 