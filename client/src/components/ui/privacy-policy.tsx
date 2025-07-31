import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Shield, Eye, Lock, Users, Database, Globe } from "lucide-react";

interface PrivacyPolicyProps {
  onClose: () => void;
}

export function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[70]"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Shield className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Privacy Policy
                  </h2>
                  <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div 
            ref={contentRef}
            className="p-6 overflow-y-auto max-h-[calc(80vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <div className="space-y-6 text-gray-700">
              
              {/* Introduction */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-blue-500" />
                  Introduction
                </h3>
                <p className="leading-relaxed">
                  MindPulse ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mental wellness application and related services.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-blue-500" />
                  Information We Collect
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Personal Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Name and email address (for account creation)</li>
                      <li>Profile information and preferences</li>
                      <li>Mental health assessments and mood tracking data</li>
                      <li>Wellness tool usage and progress data</li>
                      <li>Communication with our support team</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Usage Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>App usage patterns and feature interactions</li>
                      <li>Device information and technical logs</li>
                      <li>Performance and error data</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  How We Use Your Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Provide and maintain our mental wellness services</li>
                  <li>Personalize your experience and recommendations</li>
                  <li>Track your progress and provide insights</li>
                  <li>Improve our app functionality and user experience</li>
                  <li>Respond to your support requests and feedback</li>
                  <li>Send important updates and notifications</li>
                  <li>Ensure app security and prevent abuse</li>
                </ul>
              </section>

              {/* Data Security */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-blue-500" />
                  Data Security
                </h3>
                <p className="leading-relaxed mb-3">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Secure data storage with access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information by staff</li>
                  <li>Secure transmission protocols (HTTPS)</li>
                </ul>
              </section>

              {/* Data Sharing */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-500" />
                  Data Sharing and Disclosure
                </h3>
                <p className="leading-relaxed mb-3">
                  We do not sell your personal information. We may share your information only in these circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>With your consent:</strong> When you explicitly agree to share data</li>
                  <li><strong>Service providers:</strong> Trusted partners who help us operate our services</li>
                  <li><strong>Legal requirements:</strong> When required by law or to protect rights</li>
                  <li><strong>Emergency situations:</strong> If we believe there's a risk of harm to you or others</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Your Privacy Rights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Access & Control</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• View and download your data</li>
                      <li>• Update your information</li>
                      <li>• Delete your account</li>
                      <li>• Opt-out of communications</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Data Protection</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Request data correction</li>
                      <li>• Restrict data processing</li>
                      <li>• Data portability</li>
                      <li>• Object to processing</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Retention */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Data Retention</h3>
                <p className="leading-relaxed">
                  We retain your information for as long as your account is active or as needed to provide services. 
                  You can request deletion of your data at any time. Some information may be retained for legal, 
                  security, or business purposes as required by law.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Children's Privacy</h3>
                <p className="leading-relaxed">
                  MindPulse is not intended for children under 13. We do not knowingly collect personal information 
                  from children under 13. If you believe we have collected information from a child under 13, 
                  please contact us immediately.
                </p>
              </section>

              {/* International Users */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">International Users</h3>
                <p className="leading-relaxed">
                  If you are using MindPulse from outside the United States, please be aware that your information 
                  may be transferred to, stored, and processed in the United States where our servers are located. 
                  By using our services, you consent to this transfer.
                </p>
              </section>

              {/* Changes to Policy */}
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Changes to This Policy</h3>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to 
                  review this Privacy Policy periodically.
                </p>
              </section>

                             {/* Contact Information */}
               <section className="bg-gray-50 p-4 rounded-lg">
                 <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Us</h3>
                 <p className="leading-relaxed mb-3">
                   If you have any questions about this Privacy Policy or our data practices, please contact us:
                 </p>
                 <div className="space-y-2 text-sm">
                   <p><strong>Email:</strong> privacy@mindpulse.app</p>
                   <p><strong>Support:</strong> support@mindpulse.app</p>
                   <p><strong>Address:</strong> MindPulse Inc., [Address]</p>
                 </div>
               </section>

               {/* Close Button */}
               <div className="flex justify-center pt-6">
                 <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                   <Button
                     onClick={onClose}
                     className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 rounded-2xl px-8 py-3 font-medium shadow-lg transition-all duration-300"
                   >
                     Close
                   </Button>
                 </motion.div>
               </div>
             </div>
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 