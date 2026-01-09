import { motion } from 'framer-motion'
import { Heart, Users, Sparkles, Download, FileText, Image as ImageIcon, ExternalLink, Hand, Shield, Target, Settings, Wifi, MousePointer, Sliders, Accessibility, Play, Video } from 'lucide-react'
import { ASSETS, getAssetUrl, shuffleArray } from '../utils/assetHelper'
import { useState } from 'react'

const About = () => {
  // Shuffle images for random display
  const [fieldVisitImages] = useState(() => shuffleArray(ASSETS.fieldVisits))
  const [productImages] = useState(() => shuffleArray(ASSETS.productDesign))
  const [prototypeImages] = useState(() => shuffleArray(ASSETS.prototypes))
  const fieldVisitVideos = ASSETS.fieldVisitVideos

  const handleDownloadPDF = () => {
    try {
      const pdfUrl = getAssetUrl(ASSETS.pdf)
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = 'Airis-SH-Presentation.pdf'
      link.click()
    } catch (error) {
      console.error('Failed to load PDF:', error)
      alert('PDF file not found. Please ensure the file is accessible.')
    }
  }

  const handleViewPDF = () => {
    try {
      const pdfUrl = getAssetUrl(ASSETS.pdf)
      window.open(pdfUrl, '_blank')
    } catch (error) {
      console.error('Failed to load PDF:', error)
      alert('PDF file not found. Please ensure the file is accessible.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">About Airis-SH</h1>
        <p className="text-gray-600 text-lg">Empowering independence through innovative technology</p>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
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
              className="w-32 h-32 mx-auto md:mx-0 mb-6 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 shadow-2xl flex items-center justify-center"
            >
              <Sparkles size={48} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-teal-500 bg-clip-text text-transparent mb-4">
              Airis-SH Air Mouse
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              A revolutionary gesture-based air mouse designed specifically for autistic and physically-disabled individuals. 
              Airis-SH enables natural, touchless computer interaction through intuitive hand movements, making technology 
              accessible to everyone.
            </p>
          </div>
          <div className="flex-shrink-0">
            <img
              src={getAssetUrl(ASSETS.logo)}
              alt="Airis-SH Logo"
              className="w-48 h-48 object-contain rounded-2xl shadow-lg"
              onError={(e) => {
                console.error('Failed to load logo image:', getAssetUrl(ASSETS.logo))
                // Don't hide, show error placeholder instead
                const target = e.target as HTMLImageElement
                target.style.border = '2px dashed #ccc'
                target.alt = 'Image not found'
              }}
              onLoad={() => {
                console.log('Logo image loaded successfully:', getAssetUrl(ASSETS.logo))
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Mission & Vision */}
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
                to interact with computers naturally and comfortably, promoting independence and accessibility 
                in the digital world.
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
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Caregivers and support professionals
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-8"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Gesture Control', desc: 'Natural hand movements for precise control', icon: Hand, color: 'text-blue-500' },
            { title: 'Comfort Mode', desc: 'Calming settings for autistic users', icon: Heart, color: 'text-purple-500' },
            { title: 'SOS Integration', desc: 'Emergency alert system for safety', icon: Shield, color: 'text-red-500' },
            { title: 'Anti-Shake Tech', desc: 'Stabilization for unsteady hands', icon: Target, color: 'text-green-500' },
            { title: 'Customizable', desc: 'Adapt to individual needs and preferences', icon: Settings, color: 'text-orange-500' },
            { title: 'Wireless & Wired', desc: 'Flexible connectivity options', icon: Wifi, color: 'text-teal-500' },
            { title: 'BLE HID Mouse', desc: 'Works as standard mouse on any device', icon: MousePointer, color: 'text-indigo-500' },
            { title: 'Real-Time Calibration', desc: 'Adjust sensitivity on the fly', icon: Sliders, color: 'text-pink-500' },
            { title: 'Accessibility First', desc: 'Designed with accessibility in mind', icon: Accessibility, color: 'text-primary-500' }
          ].map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-4 glass-panel-dark text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-2">
                  <div className={`p-3 rounded-xl bg-gray-100`}>
                    <IconComponent size={32} className={feature.color} />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Presentation PDF */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-panel p-6 bg-gradient-to-br from-blue-50 to-teal-50"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <FileText size={32} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Project Presentation</h3>
            <p className="text-gray-600">
              Download or view the complete Airis-SH project presentation with technical details, 
              design specifications, and implementation roadmap.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button
            onClick={handleViewPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
          >
            <ExternalLink size={20} />
            View Presentation
          </motion.button>
          <motion.button
            onClick={handleDownloadPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={20} />
            Download PDF
          </motion.button>
        </div>
      </motion.div>

      {/* Product Images */}
      {productImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-panel p-6"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ImageIcon size={24} className="text-primary-500" />
            Product Design
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={getAssetUrl(img)}
                  alt={`Product Design ${index + 1}`}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Failed to load product image:', getAssetUrl(img), 'Original path:', img)
                    const target = e.target as HTMLImageElement
                    target.style.border = '2px dashed #ccc'
                    target.alt = 'Image not found'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Prototype Images */}
      {prototypeImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-panel p-6"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ImageIcon size={24} className="text-purple-500" />
            Prototype Development
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prototypeImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={getAssetUrl(img)}
                  alt={`Prototype ${index + 1}`}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Failed to load prototype image:', getAssetUrl(img), 'Original path:', img)
                    const target = e.target as HTMLImageElement
                    target.style.border = '2px dashed #ccc'
                    target.alt = 'Image not found'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Field Visit Gallery */}
      {fieldVisitImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-panel p-6"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ImageIcon size={24} className="text-green-500" />
            Field Visits & Testing
          </h3>
          <p className="text-gray-600 mb-4">
            Real-world testing and field visits to understand user needs and validate the Airis-SH system 
            with actual users and caregivers.
          </p>
          
          {/* Field Visit Videos */}
          {fieldVisitVideos && fieldVisitVideos.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Video size={20} className="text-blue-500" />
                Demonstration Videos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldVisitVideos.map((video, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.95 + index * 0.1 }}
                    className="rounded-xl overflow-hidden shadow-lg bg-black"
                  >
                    <video
                      src={getAssetUrl(video)}
                      controls
                      className="w-full h-auto"
                      onError={(e) => {
                        console.error('Failed to load video:', getAssetUrl(video))
                        const target = e.target as HTMLVideoElement
                        target.style.border = '2px dashed #ccc'
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Field Visit Images - Randomly Shuffled */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fieldVisitImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + index * 0.05 }}
                className="rounded-xl overflow-hidden shadow-lg aspect-square"
              >
                <img
                  src={getAssetUrl(img)}
                  alt={`Field Visit ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => {
                    window.open(getAssetUrl(img), '_blank')
                  }}
                  onError={(e) => {
                    console.error('Failed to load field visit image:', getAssetUrl(img), 'Original path:', img)
                    const target = e.target as HTMLImageElement
                    target.style.border = '2px dashed #ccc'
                    target.alt = 'Image not found'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Real-Time Simulation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="glass-panel p-6 bg-gradient-to-br from-blue-50 to-teal-50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Play size={32} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Real-Time Simulation</h3>
              <p className="text-gray-600">
                Experience the Air Mouse H-System in action with our interactive real-time simulation
              </p>
            </div>
          </div>
          <motion.a
            href="https://airis-sh.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-gradient-to-r from-primary-400 to-teal-400 text-white hover:shadow-lg transition-shadow flex items-center gap-2"
            title="Open Real-Time Simulation in new tab"
          >
            <ExternalLink size={24} />
            <span className="font-medium">Try Live Demo</span>
          </motion.a>
        </div>
        <div className="mt-4 p-4 bg-white/50 rounded-xl">
          <p className="text-sm text-gray-700">
            Click the button above to open the interactive Air Mouse H-System simulation. 
            Experience real-time cursor tracking, gesture visualization, and the full 3D interface 
            that demonstrates how Airis-SH works in practice.
          </p>
        </div>
      </motion.div>

      {/* Technical Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="glass-panel p-6"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Hardware</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                ESP32 DevKit V1 Microcontroller
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                MPU6050 Gyroscope & Accelerometer
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                BLE 5.0 Connectivity
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                HID Mouse Protocol Support
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Software</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                React + TypeScript Web Application
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Web Bluetooth API Integration
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Real-Time Gesture Recognition
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                Cross-Platform Compatibility
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="glass-panel p-8 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Credits</h3>
        <div className="text-center space-y-2 text-gray-600">
          <p className="text-lg">Designed and developed with care for accessibility</p>
          <p className="text-sm">© 2024 Airis-SH. All rights reserved.</p>
          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-sm font-semibold text-gray-700 mb-2">Special Thanks</p>
            <p className="text-sm text-gray-600">
              To all the users, caregivers, and field test participants who helped shape Airis-SH into 
              a truly accessible assistive technology solution.
            </p>
          </div>
          <p className="text-xs mt-4 text-gray-500">Version 1.0.0</p>
        </div>
      </motion.div>
    </div>
  )
}

export default About
