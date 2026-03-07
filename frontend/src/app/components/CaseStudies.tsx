import { motion } from 'motion/react';
import { Target, Lightbulb, TrendingUp, CheckCircle } from 'lucide-react';

export function CaseStudies() {
  const caseStudy = {
    title: 'Lead Generation Automation',
    problem: {
      icon: Target,
      title: 'The Problem',
      description: 'Manual outreach and lead collection was taking hours every day. The sales team was spending more time on administrative tasks than actually closing deals.',
      points: [
        'Time-consuming manual data entry',
        'Inconsistent follow-up processes',
        'Lost leads due to delayed responses',
        'No centralized lead tracking system',
      ],
    },
    solution: {
      icon: Lightbulb,
      title: 'The Solution',
      description: 'Built an end-to-end automation system using n8n and Python that streamlined the entire lead generation process.',
      points: [
        'Automated lead capture from multiple sources',
        'AI-powered lead qualification',
        'Automatic email sequences',
        'Real-time CRM integration',
        'Smart follow-up scheduling',
      ],
    },
    result: {
      icon: TrendingUp,
      title: 'The Result',
      description: 'The automation system transformed the sales process and delivered measurable results.',
      metrics: [
        { value: '10+', label: 'Hours Saved Weekly' },
        { value: '3x', label: 'More Leads Processed' },
        { value: '85%', label: 'Faster Response Time' },
        { value: '100%', label: 'Lead Tracking' },
      ],
    },
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f172a] to-[#1e293b]/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#e2e8f0] mb-6">
            Case <span className="text-[#6366f1]">Study</span>
          </h2>
          <p className="text-lg text-[#e2e8f0]/70 max-w-3xl mx-auto">
            Real-world example of how automation can transform your business
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1e293b] p-8 rounded-xl border border-[#1e293b]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-2xl text-[#e2e8f0]">{caseStudy.problem.title}</h3>
            </div>
            <p className="text-[#e2e8f0]/80 mb-6 text-lg">{caseStudy.problem.description}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {caseStudy.problem.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-[#e2e8f0]/70">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#1e293b] p-8 rounded-xl border border-[#1e293b]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-[#6366f1]" />
              </div>
              <h3 className="text-2xl text-[#e2e8f0]">{caseStudy.solution.title}</h3>
            </div>
            <p className="text-[#e2e8f0]/80 mb-6 text-lg">{caseStudy.solution.description}</p>
            <div className="space-y-3">
              {caseStudy.solution.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#6366f1] flex-shrink-0 mt-0.5" />
                  <span className="text-[#e2e8f0]/70">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-[#6366f1]/10 to-[#22c55e]/10 p-8 rounded-xl border border-[#6366f1]/20"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#22c55e]/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#22c55e]" />
              </div>
              <h3 className="text-2xl text-[#e2e8f0]">{caseStudy.result.title}</h3>
            </div>
            <p className="text-[#e2e8f0]/80 mb-8 text-lg">{caseStudy.result.description}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {caseStudy.result.metrics.map((metric, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-[#22c55e] mb-2">
                    {metric.value}
                  </div>
                  <div className="text-[#e2e8f0]/70">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
