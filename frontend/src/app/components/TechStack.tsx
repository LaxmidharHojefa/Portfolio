import { motion } from 'motion/react';
import { Code, Database, Terminal, Wrench } from 'lucide-react';

export function TechStack() {
  const categories = [
    {
      title: 'Programming',
      icon: Terminal,
      color: '#6366f1',
      technologies: ['Python', 'JavaScript', 'Java'],
    },
    {
      title: 'Web Development',
      icon: Code,
      color: '#22c55e',
      technologies: ['React', 'Node.js', 'Express', 'HTML', 'CSS'],
    },
    {
      title: 'Databases',
      icon: Database,
      color: '#f59e0b',
      technologies: ['MongoDB', 'MySQL'],
    },
    {
      title: 'Tools',
      icon: Wrench,
      color: '#ec4899',
      technologies: ['n8n', 'Git', 'GitHub', 'Postman', 'Power BI'],
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#e2e8f0] mb-6">
            Tech <span className="text-[#6366f1]">Stack</span>
          </h2>
          <p className="text-lg text-[#e2e8f0]/70 max-w-3xl mx-auto">
            Technologies and tools I use to build powerful solutions
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#1e293b] p-6 rounded-xl border border-[#1e293b] hover:border-[#6366f1]/50 transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: category.color }} />
                </div>

                <h3 className="text-xl text-[#e2e8f0] mb-4">{category.title}</h3>

                <div className="space-y-2">
                  {category.technologies.map((tech, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-[#0f172a] text-[#e2e8f0] rounded-lg text-sm border border-[#0f172a] hover:border-[#6366f1]/30 transition-colors duration-300"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
