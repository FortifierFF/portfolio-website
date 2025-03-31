// Navigation sections with their IDs and display names
export const navSections = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "mini-games", label: "Mini Games" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

// Function to determine active section based on scroll position
export function getActiveSectionId(sectionsOffsets: Record<string, number>, scrollY: number): string {
  // Sort section IDs by their offsets (to handle proper sequence)
  const sortedSectionIds = Object.keys(sectionsOffsets).sort(
    (a, b) => sectionsOffsets[a] - sectionsOffsets[b]
  );
  
  // Default to home section
  if (sortedSectionIds.length === 0 || scrollY < 100) {
    return "home";
  }
  
  // Find the last section that starts before current scroll position
  for (let i = sortedSectionIds.length - 1; i >= 0; i--) {
    const sectionId = sortedSectionIds[i];
    if (sectionsOffsets[sectionId] <= scrollY + 100) { // Adding offset for better UX
      return sectionId;
    }
  }
  
  // Fallback to first section
  return sortedSectionIds[0];
}

// Get section offsets from DOM
export function getSectionOffsets(): Record<string, number> {
  const offsets: Record<string, number> = {};
  
  navSections.forEach(({ id }) => {
    const element = document.getElementById(id);
    if (element) {
      offsets[id] = element.offsetTop;
    }
  });
  
  return offsets;
} 