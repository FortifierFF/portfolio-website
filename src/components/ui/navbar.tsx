'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { navSections, getSectionOffsets, getActiveSectionId } from '@/lib/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll event to change navbar background and track active section
  useEffect(() => {
    const sectionOffsets = getSectionOffsets();
    
    const handleScroll = () => {
      // Change navbar background when scrolled
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Update active section based on scroll position
      const newActiveSection = getActiveSectionId(sectionOffsets, window.scrollY);
      setActiveSection(newActiveSection);
    };

    // Initial call to set correct active section on mount
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Common styles for nav links
  const baseNavLinkStyles = "px-3 py-2 text-sm font-medium transition-colors";
  const activeLinkStyles = "text-blue-400";
  const inactiveLinkStyles = "text-gray-300 hover:text-white";
  
  // Link data for better maintainability
  const navLinks = navSections.map(section => ({
    id: section.id,
    href: section.id === 'home' ? '/' : `#${section.id}`,
    label: section.label
  }));

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
              {navLinks.map((link) => (
                <Link 
                  key={link.id}
                  href={link.href} 
                  className={`${baseNavLinkStyles} ${activeSection === link.id ? activeLinkStyles : inactiveLinkStyles}`}
                >
                  {link.label}
                </Link>
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
              {/* Icon when menu is closed */}
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link 
              key={`mobile-${link.id}`}
              href={link.href} 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activeSection === link.id ? 'text-blue-400' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
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