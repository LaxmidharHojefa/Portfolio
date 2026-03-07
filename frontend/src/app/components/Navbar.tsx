import { useState, useEffect } from 'react';
import { Github, Linkedin, Menu, X } from 'lucide-react';
import { navigateToSection } from '@/app/utils/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', section: 'services' },
    { name: 'Projects', section: 'projects' },
    { name: 'Experience', section: 'experience' },
    { name: 'About', section: 'about' },
    { name: 'Contact', section: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0f172a]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateToSection('home');
              setIsMobileMenuOpen(false);
            }}
            className="text-xl md:text-2xl font-bold text-[#e2e8f0]"
          >
            Hojefa<span className="text-[#6366f1]">.</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`/${link.section}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection(link.section);
                }}
                className="text-[#e2e8f0] hover:text-[#6366f1] transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-[#1e293b]">
              <a
                href="https://github.com/LaxmidharHojefa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e2e8f0] hover:text-[#6366f1] transition-colors duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/hojefa-laxmidhar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e2e8f0] hover:text-[#6366f1] transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#e2e8f0] p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-[#1e293b] rounded-lg mt-2 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`/${link.section}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection(link.section);
                  setIsMobileMenuOpen(false);
                }}
                className="block px-4 py-3 text-[#e2e8f0] hover:text-[#6366f1] hover:bg-[#0f172a] transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center space-x-6 px-4 pt-4 mt-4 border-t border-[#0f172a]">
              <a
                href="https://github.com/LaxmidharHojefa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e2e8f0] hover:text-[#6366f1] transition-colors duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/hojefa-laxmidhar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e2e8f0] hover:text-[#6366f1] transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
