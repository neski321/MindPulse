import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Mail, Lock, User, Chrome, UserCheck, Sparkles } from "lucide-react"
import { useAuth } from "@/AuthContext"
import { PrivacyPolicy } from "./privacy-policy"
import { TermsConditions } from "./terms-conditions"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { login, signUp, loginWithGoogle, signInAsGuest, resetPassword, loading, user, logout } = useAuth()
  const [mode, setMode] = useState<"login" | "signup" | "forgot-password">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [showTermsConditions, setShowTermsConditions] = useState(false)
  const [shouldReopenAuth, setShouldReopenAuth] = useState(false)
  const [showReminder, setShowReminder] = useState(false)
  const [wasSignedIn, setWasSignedIn] = useState(false)
  const [hasSignedOut, setHasSignedOut] = useState(false)

  const handlePrivacyPolicyOpen = () => {
    setShowPrivacyPolicy(true)
    onOpenChange(false) // Close auth modal
    setShouldReopenAuth(true)
  }

  const handleTermsConditionsOpen = () => {
    setShowTermsConditions(true)
    onOpenChange(false) // Close auth modal
    setShouldReopenAuth(true)
  }

  const handlePrivacyPolicyClose = () => {
    setShowPrivacyPolicy(false)
    if (shouldReopenAuth) {
      setTimeout(() => {
        onOpenChange(true) // Reopen auth modal
        setShouldReopenAuth(false)
      }, 100) // Small delay for smoother transition
    }
  }

  const handleTermsConditionsClose = () => {
    setShowTermsConditions(false)
    if (shouldReopenAuth) {
      setTimeout(() => {
        onOpenChange(true) // Reopen auth modal
        setShouldReopenAuth(false)
      }, 100) // Small delay for smoother transition
    }
  }

  const handleReminderClose = () => {
    setShowReminder(false)
    if (shouldReopenAuth) {
      setTimeout(() => {
        onOpenChange(true) // Reopen auth modal
        setShouldReopenAuth(false)
      }, 100) // Small delay for smoother transition
    }
  }

  // Reset shouldReopenAuth when auth modal is closed manually
  useEffect(() => {
    if (!open) {
      setShouldReopenAuth(false)
    }
  }, [open])

  // Track when user signs out
  useEffect(() => {
    if (user && !wasSignedIn) {
      setWasSignedIn(true)
    }
    if (!user && wasSignedIn) {
      setHasSignedOut(true)
    }
  }, [user, wasSignedIn])

  const handleAuthModalClose = () => {
    // Check if user has attempted any action (has email, password, or is in signup mode)
    // OR if they were previously signed in (signed out case)
    const hasAttemptedAction = email.trim() || password || mode === "signup" || mode === "forgot-password" || hasSignedOut
    
    if (hasAttemptedAction) {
      setShowReminder(true)
    } else {
      onOpenChange(false)
    }
  }

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
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
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

  const handleResetPassword = async () => {
    setError(null)
    setSuccess(null)
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }
    try {
      await resetPassword(email.trim())
      setSuccess("Password reset email sent! Check your inbox.")
      setTimeout(() => {
        switchMode("login")
      }, 3000)
    } catch (e: any) {
      setError(e.message || "Failed to send reset email")
    }
  }

  const clearForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setName("")
    setError(null)
    setSuccess(null)
  }

  const switchMode = (newMode: "login" | "signup" | "forgot-password") => {
    setMode(newMode)
    clearForm()
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
    <>
      {!showPrivacyPolicy && !showTermsConditions && !showReminder && (
        <Dialog open={open} onOpenChange={handleAuthModalClose}>
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
                  {mode === "login" ? "Welcome Back" : mode === "signup" ? "Join MindPulse" : "Reset Password"}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  {mode === "login" ? "Continue your wellness journey" : 
                   mode === "signup" ? "Start your mental wellness journey today" : 
                   "Enter your email to receive a password reset link"}
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
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-600 text-sm text-center"
                  >
                    {success}
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

              <AnimatePresence mode="wait">
                {(mode === "login" || mode === "signup") && (
                  <motion.div
                    key="password-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="confirm-password-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        className={`pl-10 rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 backdrop-blur-sm ${
                          confirmPassword && password !== confirmPassword ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                        }`}
                      />
                      {confirmPassword && password !== confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-6 left-0 text-xs text-red-500"
                        >
                          Passwords do not match
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={
                    mode === "login" ? handleLogin : 
                    mode === "signup" ? handleSignup : 
                    handleResetPassword
                  }
                  disabled={
                    loading || 
                    (mode === "signup" && (!email || !password || !confirmPassword || !name.trim() || password !== confirmPassword)) ||
                    (mode === "login" && (!email || !password)) ||
                    (mode === "forgot-password" && !email.trim())
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-2xl py-3 font-medium shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : 
                       mode === "signup" ? "Create Account" : 
                       "Send Reset Email"}
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>

              <AnimatePresence mode="wait">
                {(mode === "login" || mode === "signup") && (
                  <motion.div
                    key="social-login"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants} className="text-center text-sm text-gray-500">
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                      onClick={() => switchMode("signup")}
                    >
                      Sign Up
                    </motion.button>
                    <br />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                      onClick={() => switchMode("forgot-password")}
                    >
                      Forgot Password?
                    </motion.button>
                  </>
                ) : mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                      onClick={() => switchMode("login")}
                    >
                      Sign In
                    </motion.button>
                  </>
                ) : (
                  <>
                    Remember your password?{" "}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                      onClick={() => switchMode("login")}
                    >
                      Sign In
                    </motion.button>
                  </>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="text-xs text-gray-400 text-center leading-relaxed">
                By continuing, you agree to our{" "}
                <span 
                  className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  onClick={handleTermsConditionsOpen}
                >
                  Terms of Service
                </span> and{" "}
                <span 
                  className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  onClick={handlePrivacyPolicyOpen}
                >
                  Privacy Policy
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </DialogContent>

      </Dialog>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicy onClose={handlePrivacyPolicyClose} />
      )}

      {/* Terms & Conditions Modal */}
      {showTermsConditions && (
        <TermsConditions onClose={handleTermsConditionsClose} />
      )}

      {/* Reminder Modal */}
      {showReminder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[80]"
          onClick={handleReminderClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with calming gradient */}
            <div className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100">
              <div className="flex items-center justify-center space-x-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  }}
                  className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-center">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Take a Moment
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Your wellness journey awaits</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-3"
              >
                {hasSignedOut ? (
                  <>
                    <p className="text-gray-700 leading-relaxed">
                      We noticed you signed out of your wellness journey. 
                      Your mental health matters, and we're here to support you whenever you're ready.
                    </p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-sm text-gray-600 italic">
                        "Taking breaks is part of self-care. When you're ready, your wellness journey will be waiting for you."
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm">
                      Would you like to sign back in and continue your wellness journey?
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 leading-relaxed">
                      We noticed you started your wellness journey but haven't completed it yet. 
                      Taking care of your mental health is a beautiful act of self-love.
                    </p>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-sm text-gray-600 italic">
                        "Every step you take towards your mental wellness is a step towards a brighter, more balanced life."
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm">
                      Would you like to continue where you left off?
                    </p>
                  </>
                )}
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 pt-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      setShowReminder(false)
                      if (shouldReopenAuth) {
                        setTimeout(() => {
                          onOpenChange(true)
                          setShouldReopenAuth(false)
                        }, 100)
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-2xl py-3 font-medium shadow-lg transition-all duration-300"
                  >
                    {hasSignedOut ? "Sign Back In" : "Continue My Journey"}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex space-x-3"
                >
                  <Button
                    onClick={() => {
                      setShowReminder(false)
                      handleGuest()
                    }}
                    variant="outline"
                    className="flex-1 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl py-3 font-medium transition-all duration-300"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Try as Guest
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setShowReminder(false)
                      onOpenChange(false)
                      setShouldReopenAuth(false)
                    }}
                    variant="ghost"
                    className="flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl py-3 font-medium transition-all duration-300"
                  >
                    Maybe Later
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
