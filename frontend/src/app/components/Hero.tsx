import { motion } from 'motion/react';
import { Github, Linkedin, ArrowRight } from 'lucide-react';
import profilePhoto from '@/assets/profile-photo.jpg';
import { navigateToSection } from '@/app/utils/navigation';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#22c55e]/10"></div>
      
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block"
            >
              <span className="px-4 py-2 rounded-full bg-[#1e293b] text-[#22c55e] text-sm border border-[#22c55e]/20">
                Full Stack Developer & AI Automation Engineer
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl text-[#e2e8f0] leading-tight text-center lg:text-left"
            >
              Build Powerful Web Applications & Automate Business Workflows with{' '}
              <span className="text-[#6366f1]">AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 text-lg text-[#e2e8f0]/80 leading-relaxed text-center lg:text-left"
            >
              Hi, I'm <span className="text-[#6366f1]">Hojefa Laxmidhar</span>, a Full Stack Developer and AI Automation Engineer helping businesses build scalable web platforms and automate repetitive workflows using AI and modern technologies.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection('contact');
                }}
                className="group px-8 py-4 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-[#6366f1]/30 hover:shadow-[#6366f1]/50 hover:scale-105 flex items-center gap-2"
              >
                Start a Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="/projects"
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection('projects');
                }}
                className="px-8 py-4 bg-[#1e293b] hover:bg-[#334155] text-[#e2e8f0] rounded-lg font-medium transition-all duration-300 border border-[#1e293b] hover:border-[#6366f1]"
              >
                View My Work
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 flex items-center gap-6 justify-center lg:justify-start"
            >
              <span className="text-[#e2e8f0]/60 text-sm">Connect with me:</span>
              <a
                href="https://github.com/LaxmidharHojefa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e2e8f0] hover:text-[#6366f1] transition-colors duration-300"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/hojefa-laxmidhar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e2e8f0] hover:text-[#6366f1] transition-colors duration-300"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </motion.div>
          </motion.div>

          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-center xl:justify-end lg:pr-4"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] to-[#22c55e] rounded-full blur-3xl opacity-30 animate-pulse"></div>
              
              {/* Profile Image */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[22rem] lg:h-[22rem] xl:w-96 xl:h-96 rounded-full overflow-hidden border-4 border-[#1e293b] shadow-2xl">
                <img
                  src={profilePhoto}
                  alt="Hojefa Laxmidhar"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-top scale-110"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#6366f1] rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#22c55e] rounded-full opacity-20 blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
