import { motion } from 'motion/react';
import { Github, ExternalLink } from 'lucide-react';

export function Projects() {
  const projects = [
    {
      name: 'AI Personal Assistant',
      description: 'Intelligent personal assistant powered by AI to help manage daily tasks, schedule meetings, and provide smart recommendations using natural language processing.',
      technologies: ['Python', 'AI APIs', 'Natural Language Processing', 'Automation'],
      github: 'https://github.com/LaxmidharHojefa',
    },
    {
      name: 'AI Job Outreach Automation',
      description: 'Automated system for job applications and outreach. Streamlines the job search process by automatically finding relevant positions and sending personalized applications.',
      technologies: ['Python', 'n8n', 'AI APIs', 'Web Scraping', 'Email Automation'],
      github: 'https://github.com/LaxmidharHojefa',
    },
    {
      name: 'Lead Generation Automation System',
      description: 'Complete automation workflow for lead generation and management. Automatically collects, qualifies, and nurtures leads from multiple sources.',
      technologies: ['n8n', 'Python', 'AI', 'CRM Integration', 'API'],
      github: 'https://github.com/LaxmidharHojefa',
    },
    {
      name: 'Business Workflow Automation',
      description: 'Enterprise-grade workflow automation solution that connects multiple business tools and automates repetitive tasks across departments.',
      technologies: ['n8n', 'Python', 'API Integration', 'Database'],
      github: 'https://github.com/LaxmidharHojefa',
    },
    {
      name: 'MERN Stack SaaS Platform',
      description: 'Full-stack SaaS application with user authentication, subscription management, and real-time features built with modern MERN stack.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
      github: 'https://github.com/LaxmidharHojefa',
    },
    {
      name: 'Portfolio Website',
      description: 'Modern, responsive portfolio website showcasing projects and skills with smooth animations and professional design.',
      technologies: ['React', 'Tailwind CSS', 'Motion', 'Responsive Design'],
      github: 'https://github.com/LaxmidharHojefa',
    },
  ];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#e2e8f0] mb-6">
            Featured <span className="text-[#6366f1]">Projects</span>
          </h2>
          <p className="text-lg text-[#e2e8f0]/70 max-w-3xl mx-auto">
            A selection of my recent work in AI automation and web development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#1e293b] rounded-xl border border-[#1e293b] hover:border-[#6366f1]/50 transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center group-hover:bg-[#6366f1]/20 transition-colors duration-300">
                    <Github className="w-6 h-6 text-[#6366f1]" />
                  </div>
                </div>

                <h3 className="text-xl text-[#e2e8f0] mb-3 group-hover:text-[#6366f1] transition-colors duration-300">
                  {project.name}
                </h3>
                <p className="text-[#e2e8f0]/70 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#0f172a] text-[#e2e8f0]/80 rounded text-xs border border-[#0f172a]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-3 py-1 bg-[#0f172a] text-[#6366f1] rounded text-xs border border-[#0f172a]">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#6366f1] hover:text-[#5558e3] transition-colors duration-300 group/link"
                >
                  <span>View Code</span>
                  <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/LaxmidharHojefa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1e293b] hover:bg-[#334155] text-[#e2e8f0] rounded-lg font-medium transition-all duration-300 border border-[#1e293b] hover:border-[#6366f1]"
          >
            <Github className="w-5 h-5" />
            View All Projects on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
