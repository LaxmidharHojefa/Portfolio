import { motion } from 'motion/react';
import { User, Sparkles } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0f172a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#e2e8f0] mb-6">
            About <span className="text-[#6366f1]">Me</span>
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#1e293b] to-[#1e293b]/50 p-8 sm:p-12 rounded-2xl border border-[#1e293b] relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6366f1]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#22c55e]/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[#6366f1]/10 rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-[#6366f1]" />
                </div>
                <h3 className="text-2xl sm:text-3xl text-[#e2e8f0]">Hojefa Laxmidhar</h3>
              </div>

              <div className="space-y-6 text-[#e2e8f0]/80 text-lg leading-relaxed">
                <p>
                  My name is <span className="text-[#6366f1] font-medium">Hojefa Laxmidhar</span>, and I am currently in the final year of{' '}
                  <span className="text-[#22c55e] font-medium">AI and Data Science Engineering</span> at GEC Rajkot.
                </p>

                <p>
                  I specialize in building <span className="text-[#6366f1] font-medium">AI automation systems</span> and{' '}
                  <span className="text-[#22c55e] font-medium">full stack web applications</span> that help businesses automate workflows and improve efficiency.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-[#1e293b]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#6366f1]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-[#6366f1]" />
                    </div>
                    <div>
                      <h4 className="text-[#e2e8f0] font-medium mb-2">Focus Areas</h4>
                      <ul className="space-y-1 text-[#e2e8f0]/70 text-base">
                        <li>- AI Automation</li>
                        <li>- Workflow Automation</li>
                        <li>- Web Development</li>
                        <li>- Business Process Automation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#22c55e]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#22c55e]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[#e2e8f0] font-medium mb-2">Mission</h4>
                      <p className="text-[#e2e8f0]/70 text-base">
                        Helping businesses leverage modern technology to scale efficiently and automate repetitive tasks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

