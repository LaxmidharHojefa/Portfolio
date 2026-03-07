import { Github, Linkedin, Mail, Instagram } from 'lucide-react';
import { FaRegCopyright } from 'react-icons/fa';
import { navigateToSection } from '@/app/utils/navigation';

export function Footer() {
  const navLinks = [
    { name: 'Services', section: 'services' },
    { name: 'Projects', section: 'projects' },
    { name: 'Experience', section: 'experience' },
    { name: 'About', section: 'about' },
    { name: 'Contact', section: 'contact' },
  ];

  return (
    <footer className="bg-[#1e293b] border-t border-[#0f172a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateToSection('home');
              }}
              className="text-2xl font-bold text-[#e2e8f0] mb-4 block"
            >
              Hojefa<span className="text-[#6366f1]">.</span>
            </a>
            <p className="text-[#e2e8f0]/70 text-sm leading-relaxed">
              Building scalable web platforms and AI automation systems for modern businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#e2e8f0] font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={`/${link.section}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToSection(link.section);
                    }}
                    className="text-[#e2e8f0]/70 hover:text-[#6366f1] transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#e2e8f0] font-medium mb-4">Get in Touch</h3>
            <div className="space-y-3 mb-4">
              <a
                href="mailto:laxmidharhuzaifa.2004@gmail.com"
                className="flex items-center gap-2 text-[#e2e8f0]/70 hover:text-[#6366f1] transition-colors duration-300 text-sm"
              >
                <Mail className="w-4 h-4" />
                laxmidharhuzaifa.2004@gmail.com
              </a>
            </div>
            <div className="flex gap-3">
              <a
                href="https://github.com/LaxmidharHojefa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center text-[#e2e8f0] hover:text-[#6366f1] hover:bg-[#6366f1]/10 transition-all duration-300 border border-[#0f172a] hover:border-[#6366f1]/50"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/hojefa-laxmidhar/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center text-[#e2e8f0] hover:text-[#6366f1] hover:bg-[#6366f1]/10 transition-all duration-300 border border-[#0f172a] hover:border-[#6366f1]/50"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/huzaifa452004"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center text-[#e2e8f0] hover:text-[#e1306c] hover:bg-[#e1306c]/10 transition-all duration-300 border border-[#0f172a] hover:border-[#e1306c]/50"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#0f172a] text-center">
          <p className="text-[#e2e8f0]/60 text-sm inline-flex items-center justify-center gap-1">
            <FaRegCopyright />
            {new Date().getFullYear()} Hojefa Laxmidhar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
