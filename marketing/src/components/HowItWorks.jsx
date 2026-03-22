import { motion } from 'framer-motion'
import { UserPlus, Search, CheckCircle, TrendingUp } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Sign up in 2 minutes with phone verification. Add your skills, experience, and documents.',
      color: 'from-blue-500 to-cyan-500',
      step: '01'
    },
    {
      icon: Search,
      title: 'Get AI Matches',
      description: 'Our smart algorithm finds perfect job matches based on your skills, location, and preferences.',
      color: 'from-purple-500 to-pink-500',
      step: '02'
    },
    {
      icon: CheckCircle,
      title: 'Apply & Get Hired',
      description: 'Apply with one click. Chat directly with employers. Get hired for jobs you love.',
      color: 'from-amber-500 to-orange-500',
      step: '03'
    },
    {
      icon: TrendingUp,
      title: 'Earn & Grow',
      description: 'Get paid securely through digital wallet. Build reputation. Access free courses.',
      color: 'from-green-500 to-emerald-500',
      step: '04'
    }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-40"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full mb-4"
          >
            <span className="text-accent-700 font-semibold text-sm">⚡ SIMPLE PROCESS</span>
          </motion.div>
          
          <h2 className="section-title">
            How <span className="gradient-text">WorkID</span> Works
          </h2>
          
          <p className="section-subtitle">
            Get started in 4 easy steps and join thousands of workers finding fair work every day
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <div className="absolute inset-0 flex items-center">
              <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 via-amber-500 to-green-500 opacity-20"></div>
            </div>
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Step Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full relative overflow-hidden group">
                {/* Step Number Background */}
                <div className="absolute top-4 right-4 text-8xl font-bold text-gray-50 group-hover:text-gray-100 transition-colors">
                  {step.step}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`relative z-10 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Gradient Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color}`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="https://workid-app.vercel.app/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center"
          >
            Start Your Journey Today
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-2"
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
