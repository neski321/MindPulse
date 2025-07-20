import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Mail, Lock, User, Chrome, UserCheck, Sparkles } from "lucide-react"
import { useAuth } from "@/AuthContext"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { login, signUp, loginWithGoogle, signInAsGuest, loading } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setError(null)
    try {
      await login(email, password)
      onOpenChange(false)
    } catch (e: any) {
      setError(e.message || "Login failed")
    }
  }

  const handleSignup = async () => {
    setError(null)
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    try {
      await signUp(email, password, name.trim())
      onOpenChange(false)
    } catch (e: any) {
      setError(e.message || "Signup failed")
    }
  }

  const handleGoogle = async () => {
    setError(null)
    try {
      await loginWithGoogle()
      onOpenChange(false)
    } catch (e: any) {
      setError(e.message || "Google login failed")
    }
  }

  const handleGuest = async () => {
    setError(null)
    try {
      await signInAsGuest()
      onOpenChange(false)
    } catch (e: any) {
      setError(e.message || "Guest login failed")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
          <DialogHeader className="text-center space-y-4">
            <motion.div
              variants={itemVariants}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {mode === "login" ? "Welcome Back" : "Join MindEase"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                {mode === "login" ? "Continue your wellness journey" : "Start your mental wellness journey today"}
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <motion.div variants={itemVariants} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="pl-10 rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="pl-10 rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="pl-10 rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={mode === "login" ? handleLogin : handleSignup}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-2xl py-3 font-medium shadow-lg transition-all duration-300"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleGoogle}
                  variant="outline"
                  disabled={loading}
                  className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl py-3 font-medium transition-all duration-300 bg-transparent"
                >
                  <Chrome className="w-5 h-5 mr-2 text-blue-500" />
                  Continue with Google
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleGuest}
                  variant="secondary"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 rounded-2xl py-3 font-medium transition-all duration-300"
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  Continue as Guest
                </Button>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="text-center text-sm text-gray-500">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                    onClick={() => setMode("signup")}
                  >
                    Sign Up
                  </motion.button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                    onClick={() => setMode("login")}
                  >
                    Sign In
                  </motion.button>
                </>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="text-xs text-gray-400 text-center leading-relaxed">
              By continuing, you agree to our{" "}
              <span className="text-blue-500 hover:text-blue-600 cursor-pointer">Terms of Service</span> and{" "}
              <span className="text-blue-500 hover:text-blue-600 cursor-pointer">Privacy Policy</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
