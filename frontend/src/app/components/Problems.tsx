import { motion } from 'motion/react';
import { AlertCircle, Clock, TrendingDown, Repeat, Globe } from 'lucide-react';

export function Problems() {
  const problems = [
    {
      icon: Repeat,
      title: 'Too Many Repetitive Manual Tasks',
      description: 'Spending hours on tasks that could be automated',
    },
    {
      icon: AlertCircle,
      title: 'Manual Lead Management',
      description: 'Losing potential clients due to slow response times',
    },
    {
      icon: TrendingDown,
      title: 'Inefficient Workflows',
      description: 'Outdated processes slowing down your business growth',
    },
    {
      icon: Clock,
      title: 'No Automation in Operations',
      description: 'Wasting valuable time on routine operational tasks',
    },
    {
      icon: Globe,
      title: 'Outdated Web Systems',
      description: 'Legacy systems that can\'t keep up with modern demands',
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
            Are You Facing These <span className="text-[#6366f1]">Challenges?</span>
          </h2>
          <p className="text-lg text-[#e2e8f0]/70 max-w-3xl mx-auto">
            Many businesses struggle with these common problems. Let me help you overcome them.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#1e293b] p-6 rounded-xl border border-[#1e293b] hover:border-[#6366f1]/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#6366f1]/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-[#6366f1]" />
                </div>
                <h3 className="text-xl text-[#e2e8f0] mb-3">{problem.title}</h3>
                <p className="text-[#e2e8f0]/70">{problem.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-[#6366f1]/10 to-[#22c55e]/10 p-8 rounded-xl border border-[#6366f1]/20 text-center"
        >
          <p className="text-lg sm:text-xl text-[#e2e8f0]">
            I help businesses solve these problems by building{' '}
            <span className="text-[#6366f1]">AI-powered automation systems</span> and{' '}
            <span className="text-[#22c55e]">scalable web applications</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
