import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, User, Shield } from "lucide-react"
import { useAuth } from "@/AuthContext"
import { useLocation } from "wouter"

interface ProfilePopupProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

export function ProfilePopup({ isOpen, onClose, triggerRef }: ProfilePopupProps) {
  const { user, logout } = useAuth()
  const [, setLocation] = useLocation()
  const popupRef = useRef<HTMLDivElement>(null)

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose, triggerRef])

  const handleSettings = () => {
    onClose()
    setLocation("/settings")
  }

  const handleSignOut = async () => {
    onClose()
    await logout()
  }

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 z-50 overflow-hidden"
          style={{
            filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))",
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-white">
                  {user?.isGuest ? "G" : (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.isGuest ? "Guest User" : user?.name || user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.isGuest ? "Limited access" : "Full account"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <motion.div
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 rounded-none"
                onClick={handleSettings}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
            </motion.div>

            {user?.isGuest && (
              <motion.div
                custom={1}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 text-sm hover:bg-orange-50 hover:text-orange-600 rounded-none"
                  onClick={() => {
                    onClose()
                    window.dispatchEvent(new CustomEvent('open-auth-modal'))
                  }}
                >
                  <Shield className="w-4 h-4 mr-3" />
                  Create Account
                </Button>
              </motion.div>
            )}

            <motion.div
              custom={user?.isGuest ? 2 : 1}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600 rounded-none"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-3" />
                {user?.isGuest ? "Exit Guest Mode" : "Sign Out"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 