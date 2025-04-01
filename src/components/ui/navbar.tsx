'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navSections, getSectionOffsets, getActiveSectionId } from '@/lib/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Handle scroll event to change navbar background and track active section
  useEffect(() => {
    const handleScroll = () => {
      // Change navbar background when scrolled
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Only update active section on home page
      if (isHomePage) {
        const sectionOffsets = getSectionOffsets();
        const newActiveSection = getActiveSectionId(sectionOffsets, window.scrollY);
        setActiveSection(newActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Handle contact section scroll
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-blue-500 font-bold text-xl">
              Lyusien<span className="text-white">.dev</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navSections.map((section) => (
                section.id === 'contact' ? (
                  <a
                    key={section.id}
                    href={section.path}
                    onClick={handleContactClick}
                    className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                      activeSection === section.id ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {section.label}
                  </a>
                ) : (
                  <Link
                    key={section.id}
                    href={section.path}
                    className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                      pathname === section.path ? 'text-blue-500' : 'text-gray-400'
                    }`}
                  >
                    {section.label}
                  </Link>
                )
              ))}
              <a 
                href="/resume.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
              >
                Resume
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-md">
          {navSections.map((section) => (
            section.id === 'contact' ? (
              <a
                key={`mobile-${section.id}`}
                href={section.path}
                onClick={(e) => {
                  handleContactClick(e);
                  setIsMobileMenuOpen(false);
                }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
              >
                {section.label}
              </a>
            ) : (
              <Link
                key={`mobile-${section.id}`}
                href={section.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === section.path ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {section.label}
              </Link>
            )
          ))}
          <div className="px-3 py-2">
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
            >
              Resume
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
} 