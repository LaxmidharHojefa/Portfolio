import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Problems } from './components/Problems';
import { Services } from './components/Services';
import { Projects } from './components/Projects';
import { CaseStudies } from './components/CaseStudies';
import { TechStack } from './components/TechStack';
import { Experience } from './components/Experience';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { syncSectionFromCurrentPath } from './utils/navigation';

export default function App() {
  useEffect(() => {
    // Align initial scroll position with the clean path URL (/about, /contact, etc.).
    syncSectionFromCurrentPath();

    const onPopState = () => {
      // Handle browser back/forward navigation for section routes.
      syncSectionFromCurrentPath();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Problems />
      <Services />
      <Projects />
      <CaseStudies />
      <TechStack />
      <Experience />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
