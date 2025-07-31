import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsIcon, Bell, Moon, Shield, Heart, HelpCircle, Mail, User, Sparkles, Star, Phone, Trash2, Edit3, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { getAuth, deleteUser, updateEmail, updateProfile } from "firebase/auth"
import { CrisisResources } from "@/components/crisis-resources"
import { PreferencesForm } from "@/components/preferences-form"
import { HelpCenter } from "@/components/help-center"
import { ContactSupport } from "@/components/contact-support"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

export default function Settings() {
  const { toast } = useToast()
  const { user, loading, logout, refreshUser } = useAuth()
  const { cursorEffects, setCursorEffects, magnetEffect, setMagnetEffect } = useSettings()
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [privacyMode, setPrivacyMode] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showCrisisResources, setShowCrisisResources] = useState(false)
  const [showHelpCenter, setShowHelpCenter] = useState(false)
  const [showContactSupport, setShowContactSupport] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || ""
  })

  const handleToggle = (setting: string, value: boolean) => {
    console.log(`${setting} toggled to: ${value}`)
    toast({
      title: `${setting} ${value ? 'enabled' : 'disabled'}`,
      description: `Your ${setting.toLowerCase()} setting has been updated.`,
    })
  }

  const handleSignOut = async () => {
    try {
      await logout()
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditProfile = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || ""
    })
    setIsEditingProfile(true)
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    setEditForm({
      name: user?.name || "",
      email: user?.email || ""
    })
  }

  const handleUpdateProfile = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not found. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }

    setIsUpdatingProfile(true)

    try {
      // Update database first
      const response = await fetch(`/api/users/${user.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          firebaseUid: user.firebaseUid
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const data = await response.json()
      
      // Update Firebase if user has Firebase UID and email changed
      if (user.firebaseUid && editForm.email !== user.email) {
        const auth = getAuth()
        const currentUser = auth.currentUser
        
        if (currentUser) {
          try {
            await updateEmail(currentUser, editForm.email.trim())
            console.log("Firebase email updated successfully")
          } catch (firebaseError: any) {
            console.error("Firebase email update error:", firebaseError)
            // If Firebase update fails, we still have the database update
            // Show a warning but don't fail the entire operation
            toast({
              title: "Profile Updated",
              description: "Profile updated in database. Firebase email update requires recent authentication.",
              variant: "default",
            })
            setIsEditingProfile(false)
            setIsUpdatingProfile(false)
            return
          }
        }
      }

      // Update Firebase display name if name changed
      if (user.firebaseUid && editForm.name !== user.name) {
        const auth = getAuth()
        const currentUser = auth.currentUser
        
        if (currentUser) {
          try {
            await updateProfile(currentUser, { displayName: editForm.name.trim() })
            console.log("Firebase display name updated successfully")
          } catch (firebaseError: any) {
            console.error("Firebase display name update error:", firebaseError)
            // Non-critical error, continue
          }
        }
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      setIsEditingProfile(false)
      
      // Refresh user data
      await refreshUser()
      
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast({
        title: "Invalid confirmation",
        description: "Please type 'DELETE' to confirm account deletion.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)

    try {
      if (!user?.id) {
        throw new Error("User ID not found")
      }

      // First, delete all data from our database
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error("Failed to delete account data from database")
      }

      // Then, delete the Firebase account
      const auth = getAuth()
      const currentUser = auth.currentUser

      if (currentUser) {
        try {
          await deleteUser(currentUser)
          console.log("Firebase account deleted successfully")
        } catch (firebaseError: any) {
          console.error("Firebase deletion error:", firebaseError)
          
          // Handle different Firebase error cases
          if (firebaseError.code === 'auth/requires-recent-login') {
            toast({
              title: "Account data deleted",
              description: "Your data has been deleted from our database. You may need to re-authenticate to complete Firebase account deletion.",
              variant: "default",
            })
          } else if (firebaseError.code === 'auth/user-not-found') {
            // User already deleted or doesn't exist in Firebase
            console.log("Firebase user not found - may have been already deleted")
          } else {
            // For other Firebase errors, still consider it a partial success
            console.warn("Firebase deletion failed but database was cleaned:", firebaseError.message)
            toast({
              title: "Account data deleted",
              description: "Your data has been deleted from our database. Firebase account deletion encountered an issue.",
              variant: "default",
            })
          }
        }
      } else {
        console.log("No Firebase user found - proceeding with database cleanup only")
      }

      toast({
        title: "Account deleted successfully",
        description: "Your account and all data have been permanently deleted.",
      })

      // Sign out after successful deletion
      await logout()
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error deleting account",
        description: error instanceof Error ? error.message : "There was an error deleting your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setDeleteConfirmation("")
    }
  }

  const supportItems = [
    {
      title: "Help Center",
      description: "Find answers to common questions",
      icon: <HelpCircle className="w-5 h-5 text-blue-500" />,
      color: "from-blue-50 to-cyan-50",
      onClick: () => setShowHelpCenter(true),
    },
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: <Mail className="w-5 h-5 text-green-500" />,
      color: "from-green-50 to-emerald-50",
      onClick: () => setShowContactSupport(true),
    },
    {
      title: "Crisis Resources",
      description: "Access emergency mental health support",
      icon: <Phone className="w-5 h-5 text-red-500" />,
      color: "from-red-50 to-pink-50",
      onClick: () => setShowCrisisResources(true),
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md mx-auto px-4 py-6 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 text-lg">Customize your MindEase experience</p>
        </motion.div>

        {/* Account Overview */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {user.isGuest ? "G" : (user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">
                        {user.isGuest ? "Guest User" : user.name || user.email}
                      </p>
                      {!user.isGuest && user.email && <p className="text-sm text-gray-600">{user.email}</p>}
                      <Badge
                        className={`mt-2 ${
                          user.isGuest
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : "bg-green-100 text-green-700 border-green-200"
                        } rounded-full`}
                      >
                        {user.isGuest ? "Guest Account" : "Full Account"}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {!user.isGuest && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleEditProfile}
                          variant="outline"
                          className="w-full rounded-2xl border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </motion.div>
                    )}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full rounded-2xl border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                      >
                        Sign Out
                      </Button>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Please use the Login / Sign Up button in the header.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Profile Dialog */}
        {isEditingProfile && (
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogContent className="bg-white rounded-3xl max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                  Edit Profile
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Update your profile information. Changes will be saved to both your account and Firebase.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="rounded-2xl border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="rounded-2xl border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Changing your email may require recent authentication in Firebase.
                  </p>
                </div>
              </div>
              <DialogFooter className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isUpdatingProfile}
                  className="rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile || !editForm.name.trim() || !editForm.email.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Notifications */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications for mood check-ins and reminders</p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={(value) => {
                    setNotifications(value)
                    handleToggle("Push notifications", value)
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Email Updates</h3>
                    <p className="text-sm text-muted-foreground">Get weekly progress reports and wellness tips</p>
                  </div>
                </div>
                <Switch
                  checked={emailUpdates}
                  onCheckedChange={(value) => {
                    setEmailUpdates(value)
                    handleToggle("Email updates", value)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Privacy Mode</h3>
                    <p className="text-sm text-muted-foreground">Hide sensitive content when screen is shared</p>
                  </div>
                </div>
                <Switch
                  checked={privacyMode}
                  onCheckedChange={(value) => {
                    setPrivacyMode(value)
                    handleToggle("Privacy mode", value)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customize */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Customize
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">Cursor Effects</h3>
                    <p className="text-sm text-muted-foreground">Enable or disable animated cursor effects</p>
                  </div>
                </div>
                <Switch checked={cursorEffects} onCheckedChange={setCursorEffects} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Magnet Effect</h4>
                    <p className="text-xs text-gray-500">Enable or disable the magnetic effect on the mood tracker</p>
                  </div>
                </div>
                <Switch checked={magnetEffect} onCheckedChange={setMagnetEffect} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendation Preferences */}
        <motion.div variants={itemVariants}>
          <PreferencesForm />
        </motion.div>

        {/* Support & Help */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">Support & Help</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${item.color} rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer`}
                  onClick={item.onClick}
                >
                  <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-md">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Account */}
        {user && (
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-3xl overflow-hidden border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Trash2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-red-800">Delete Account</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-red-900 text-lg mb-2">Permanently Delete Account</h4>
                      <p className="text-sm text-red-700 mb-4">
                        This action cannot be undone. All your data including mood entries, progress, and account information will be permanently deleted.
                      </p>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => setShowDeleteDialog(true)}
                          variant="outline"
                          className="w-full rounded-2xl border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
                        >
                          Delete My Account
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* App Information */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-2">MindEase</h3>
                  <p className="text-gray-600 mb-4">Mental Health Companion</p>
                  <Badge className="bg-white/60 text-purple-700 border-purple-200 rounded-full px-4 py-2">
                    <Star className="w-3 h-3 mr-1" />
                    Version 1.0.0
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>© 2024 MindEase. All rights reserved.</p>
                  <div className="flex justify-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hover:text-purple-600 transition-colors font-medium"
                    >
                      Privacy Policy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hover:text-purple-600 transition-colors font-medium"
                    >
                      Terms of Service
                    </motion.button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Crisis Resources Modal */}
        {showCrisisResources && (
          <CrisisResources onClose={() => setShowCrisisResources(false)} />
        )}

        {/* Help Center Modal */}
        {showHelpCenter && (
          <HelpCenter onClose={() => setShowHelpCenter(false)} />
        )}

        {/* Contact Support Modal */}
        {showContactSupport && (
          <ContactSupport onClose={() => setShowContactSupport(false)} />
        )}

        {/* Delete Account Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-white rounded-3xl border-red-200 max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-red-800">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                Delete Account
              </DialogTitle>
              <DialogDescription className="text-red-700">
                This action cannot be undone. All your data will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                <p className="text-sm text-red-700 mb-3">
                  To confirm deletion, please type <strong>DELETE</strong> in the field below:
                </p>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="border-red-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false)
                  setDeleteConfirmation("")
                }}
                className="rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "DELETE" || isDeleting}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
