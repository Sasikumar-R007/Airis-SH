import { motion } from 'framer-motion'
import { Heart, Users, Sparkles } from 'lucide-react'

const About = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">About Airis-SH</h1>
        <p className="text-gray-600 text-lg">Empowering independence through innovative technology</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8"
        >
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 shadow-2xl flex items-center justify-center"
            >
              <Sparkles size={48} className="text-white" />
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary-500 to-teal-500 bg-clip-text text-transparent mb-4">
            Airis-SH Air Mouse
          </h2>
          <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
            A revolutionary gesture-based air mouse designed specifically for autistic and physically-disabled individuals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 bg-gradient-to-br from-purple-50 to-pink-50"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-purple-200">
                <Heart size={32} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To create assistive technology that empowers individuals with autism and physical disabilities 
                  to interact with computers naturally and comfortably, promoting independence and accessibility.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 bg-gradient-to-br from-blue-50 to-teal-50"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-200">
                <Users size={32} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Designed For</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Autistic individuals seeking sensory-friendly input
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    People with limited hand mobility
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                    Users requiring customizable interaction modes
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-8"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Gesture Control', desc: 'Natural hand movements for precise control' },
              { title: 'Comfort Mode', desc: 'Calming settings for autistic users' },
              { title: 'SOS Integration', desc: 'Emergency alert system for safety' },
              { title: 'Anti-Shake Tech', desc: 'Stabilization for unsteady hands' },
              { title: 'Customizable', desc: 'Adapt to individual needs and preferences' },
              { title: 'Wireless & Wired', desc: 'Flexible connectivity options' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 glass-panel-dark text-center"
              >
                <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-8 bg-gradient-to-br from-gray-50 to-gray-100"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Credits</h3>
          <div className="text-center space-y-2 text-gray-600">
            <p>Designed and developed with care for accessibility</p>
            <p className="text-sm">© 2024 Airis-SH. All rights reserved.</p>
            <p className="text-xs mt-4 text-gray-500">Version 1.0.0</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
