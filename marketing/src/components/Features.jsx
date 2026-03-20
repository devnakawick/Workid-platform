import { motion } from 'framer-motion'
import { 
  Smartphone, 
  Target, 
  Wallet, 
  Shield, 
  TrendingUp, 
  MessageCircle,
  Award,
  BookOpen,
  Globe
} from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'Digital Identity',
      description: 'Secure, verified digital profiles with OTP authentication and document verification',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      icon: Target,
      title: 'AI Job Matching',
      description: '92% match accuracy using hybrid recommendation algorithms for perfect job fits',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.2
    },
    {
      icon: Wallet,
      title: 'Digital Wallet',
      description: 'Secure payments, instant transfers, and automatic savings for financial freedom',
      gradient: 'from-amber-500 to-orange-500',
      delay: 0.3
    },
    {
      icon: Shield,
      title: 'Fair Wages',
      description: 'AI-powered wage prediction ensures you get paid what you deserve',
      gradient: 'from-green-500 to-emerald-500',
      delay: 0.4
    },
    {
      icon: TrendingUp,
      title: 'Reputation Score',
      description: 'Build your professional reputation with verified reviews and ratings',
      gradient: 'from-red-500 to-rose-500',
      delay: 0.5
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Connect directly with employers or workers through secure messaging',
      gradient: 'from-indigo-500 to-purple-500',
      delay: 0.6
    },
    {
      icon: Globe,
      title: 'Multilingual',
      description: 'Available in English, Sinhala, and Tamil for inclusive accessibility',
      gradient: 'from-teal-500 to-cyan-500',
      delay: 0.7
    },
    {
      icon: BookOpen,
      title: 'Skill Development',
      description: 'Free courses and certifications to enhance your skills and earnings',
      gradient: 'from-violet-500 to-purple-500',
      delay: 0.8
    },
    {
      icon: Award,
      title: 'Achievement Badges',
      description: 'Earn badges and showcase your expertise to attract better opportunities',
      gradient: 'from-pink-500 to-rose-500',
      delay: 0.9
    }
  ]

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-4"
          >
            <span className="text-primary-700 font-semibold text-sm">🚀 POWERFUL FEATURES</span>
          </motion.div>
          
          <h2 className="section-title">
            Everything You Need to
            <span className="block gradient-text">Succeed</span>
          </h2>
          
          <p className="section-subtitle">
            WorkID combines cutting-edge AI technology with human-centered design to create the most comprehensive platform for informal workers
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Gradient Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-full group-hover:scale-150 transition-transform duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className={`w-8 h-8 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-lg">→</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:gap-4 transition-all"
          >
            See How It Works
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
