import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Shield, UserPlus, X, ArrowRight, Database, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GuestDataWarningProps {
  onClose: () => void
  onCreateAccount: () => void
}

const GuestDataWarning: React.FC<GuestDataWarningProps> = ({ onClose, onCreateAccount }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 via-black/50 to-black/60 backdrop-blur-sm z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 50, rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30, rotateX: 10 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.6,
          }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
        >
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-yellow-50/30 to-red-50/50 rounded-3xl" />

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4 text-gray-600" />
          </motion.button>

          {/* Main Content */}
          <div className="relative z-10">
            {/* Warning Icon Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="mb-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 via-yellow-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl mb-4"
              >
                <AlertTriangle className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.8,
                type: "spring",
                stiffness: 150,
              }}
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600 bg-clip-text text-transparent"
            >
              Guest Mode Active
            </motion.h2>

            {/* Warning Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200"
            >
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-orange-800 font-medium mb-2">
                    Your data will not be saved
                  </p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    In guest mode, your mood entries, progress, and wellness activities will be lost when you leave the page.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Benefits of Creating Account */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Create an account to:</h3>
              <div className="space-y-3">
                {[
                  { icon: Save, text: "Save your progress and mood history", color: "from-green-400 to-emerald-500" },
                  { icon: Shield, text: "Get personalized recommendations", color: "from-blue-400 to-cyan-500" },
                  { icon: UserPlus, text: "Track your wellness journey over time", color: "from-purple-400 to-indigo-500" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-md`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="space-y-3"
            >
              {/* Create Account Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onCreateAccount}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 rounded-2xl py-4 text-lg font-semibold shadow-2xl transition-all duration-300 group"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>

              {/* Continue as Guest Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-2xl py-3 text-base font-medium bg-transparent"
                >
                  Continue as Guest
                </Button>
              </motion.div>
            </motion.div>

            {/* Bottom Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="mt-4 text-xs text-gray-500"
            >
              You can create an account anytime from Settings
            </motion.p>
          </div>

          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-red-500/20 p-[1px]">
            <div className="w-full h-full bg-white/95 rounded-3xl" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default GuestDataWarning 