import { motion } from 'motion/react';
import { Code2, Bot, CheckCircle } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: Code2,
      title: 'Web Development',
      description: 'Build scalable web applications using the MERN stack',
      examples: [
        'Business websites',
        'SaaS platforms',
        'Admin dashboards',
        'Custom web apps',
        'API development',
      ],
      technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
      color: '#6366f1',
    },
    {
      icon: Bot,
      title: 'AI Automation',
      description: 'Automate repetitive business workflows with AI',
      examples: [
        'Workflow automation',
        'Lead generation automation',
        'Email automation',
        'AI agents',
        'Business process automation',
        'API integrations',
      ],
      technologies: ['Python', 'n8n', 'AI APIs'],
      color: '#22c55e',
    },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f172a] to-[#1e293b]/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#e2e8f0] mb-6">
            What I <span className="text-[#6366f1]">Offer</span>
          </h2>
          <p className="text-lg text-[#e2e8f0]/70 max-w-3xl mx-auto">
            Professional services to help your business grow and succeed in the digital age
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-[#1e293b] p-8 rounded-xl border border-[#1e293b] hover:border-[#6366f1]/50 transition-all duration-300 group"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${service.color}20` }}
                >
                  <Icon className="w-8 h-8" style={{ color: service.color }} />
                </div>

                <h3 className="text-2xl sm:text-3xl text-[#e2e8f0] mb-4">{service.title}</h3>
                <p className="text-[#e2e8f0]/70 mb-6 text-lg">{service.description}</p>

                <div className="mb-6">
                  <h4 className="text-[#e2e8f0] mb-3 font-medium">What I can build:</h4>
                  <div className="space-y-2">
                    {service.examples.map((example, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span className="text-[#e2e8f0]/80">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[#e2e8f0] mb-3 font-medium">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-[#0f172a] text-[#e2e8f0] rounded-lg text-sm border border-[#1e293b] hover:border-[#6366f1]/50 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
