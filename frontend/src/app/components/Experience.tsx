import { motion } from 'motion/react';
import { Briefcase, Calendar, CheckCircle } from 'lucide-react';

export function Experience() {
  const experiences = [
    {
      title: 'Software Developer Intern',
      company: 'HypenSec',
      duration: '6 Months',
      type: 'Internship',
      responsibilities: [
        'Web application development',
        'Backend API implementation',
        'Debugging and performance improvements',
        'Collaborated with senior developers on enterprise projects',
      ],
    },
    {
      title: 'Freelance Developer',
      company: 'Self-Employed',
      duration: '6 Months',
      type: 'Freelance',
      responsibilities: [
        'Web development projects',
        'AI automation workflows',
        'Business process automation',
        'Client consultation and project delivery',
      ],
    },
  ];

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f172a] to-[#1e293b]/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#e2e8f0] mb-6">
            Work <span className="text-[#6366f1]">Experience</span>
          </h2>
          <p className="text-lg text-[#e2e8f0]/70 max-w-3xl mx-auto">
            My professional journey in software development and AI automation
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[#1e293b] p-8 rounded-xl border border-[#1e293b] hover:border-[#6366f1]/50 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#6366f1]/10 rounded-lg flex items-center justify-center group-hover:bg-[#6366f1]/20 transition-colors duration-300">
                      <Briefcase className="w-5 h-5 text-[#6366f1]" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl text-[#e2e8f0]">{exp.title}</h3>
                      <p className="text-[#6366f1]">{exp.company}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#e2e8f0]/70">
                  <Calendar className="w-4 h-4" />
                  <span>{exp.duration}</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="px-3 py-1 bg-[#6366f1]/10 text-[#6366f1] rounded-full text-sm border border-[#6366f1]/20">
                  {exp.type}
                </span>
              </div>

              <div className="space-y-3">
                {exp.responsibilities.map((responsibility, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
                    <span className="text-[#e2e8f0]/80">{responsibility}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[#6366f1]/10 to-[#22c55e]/10 p-8 rounded-xl border border-[#6366f1]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#6366f1]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-[#6366f1]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl text-[#e2e8f0] mb-2">Education</h3>
                <p className="text-xl text-[#6366f1] mb-2">
                  Bachelor of Engineering in AI and Data Science
                </p>
                <p className="text-[#e2e8f0]/70 mb-1">GEC Rajkot</p>
                <p className="text-[#22c55e]">Final Year</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
