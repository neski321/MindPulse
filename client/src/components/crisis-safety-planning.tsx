import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Phone, 
  Users, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Plus,
  Trash2,
  Save,
  Download
} from "lucide-react";

interface CrisisSafetyPlanningProps {
  onClose: () => void;
  onComplete: (safetyData: SafetyData) => void;
}

interface SafetyData {
  warningSigns: string[];
  copingStrategies: string[];
  emergencyContacts: Contact[];
  safePlaces: string[];
  professionalHelp: string[];
  notes?: string;
  timestamp: Date;
}

interface Contact {
  name: string;
  relationship: string;
  phone: string;
  isEmergency: boolean;
}

const defaultCopingStrategies = [
  "Deep breathing exercises",
  "Call a trusted friend or family member",
  "Go for a walk in nature",
  "Listen to calming music",
  "Write in a journal",
  "Take a warm bath or shower",
  "Practice grounding techniques (5-4-3-2-1)",
  "Use progressive muscle relaxation",
  "Call a crisis hotline",
  "Remove yourself from triggering situations"
];

const defaultSafePlaces = [
  "Your bedroom",
  "A local park",
  "A friend's house",
  "A library",
  "A coffee shop",
  "A place of worship",
  "A community center"
];

const defaultProfessionalHelp = [
  "National Suicide Prevention Lifeline: 988",
  "Crisis Text Line: Text HOME to 741741",
  "Your therapist or counselor",
  "Your primary care doctor",
  "Local mental health crisis center",
  "Emergency services: 911"
];

export function CrisisSafetyPlanning({ onClose, onComplete }: CrisisSafetyPlanningProps) {
  const [step, setStep] = useState(1);
  const [warningSigns, setWarningSigns] = useState<string[]>([]);
  const [currentWarningSign, setCurrentWarningSign] = useState("");
  const [copingStrategies, setCopingStrategies] = useState<string[]>(defaultCopingStrategies.slice(0, 5));
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([]);
  const [safePlaces, setSafePlaces] = useState<string[]>(defaultSafePlaces.slice(0, 3));
  const [professionalHelp, setProfessionalHelp] = useState<string[]>(defaultProfessionalHelp.slice(0, 3));
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactIsEmergency, setContactIsEmergency] = useState(false);

  const handleAddWarningSign = () => {
    if (currentWarningSign.trim()) {
      setWarningSigns([...warningSigns, currentWarningSign.trim()]);
      setCurrentWarningSign("");
    }
  };

  const handleRemoveWarningSign = (index: number) => {
    setWarningSigns(warningSigns.filter((_, i) => i !== index));
  };

  const handleAddContact = () => {
    if (contactName.trim() && contactPhone.trim()) {
      const newContact: Contact = {
        name: contactName.trim(),
        relationship: contactRelationship.trim(),
        phone: contactPhone.trim(),
        isEmergency: contactIsEmergency
      };
      setEmergencyContacts([...emergencyContacts, newContact]);
      setContactName("");
      setContactRelationship("");
      setContactPhone("");
      setContactIsEmergency(false);
    }
  };

  const handleRemoveContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const safetyData: SafetyData = {
      warningSigns,
      copingStrategies,
      emergencyContacts,
      safePlaces,
      professionalHelp,
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(safetyData);
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Shield className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Crisis Safety Planning</h2>
                <p className="text-sm text-gray-600">Create your personalized safety plan</p>
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
        <div className="p-6 space-y-6">
          {/* Step 1: Warning Signs */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <AlertTriangle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Warning Signs</h3>
                <p className="text-sm text-gray-600">What are your early warning signs that you're struggling?</p>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="e.g., Increased anxiety, trouble sleeping, isolating..."
                    value={currentWarningSign}
                    onChange={(e) => setCurrentWarningSign(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddWarningSign}
                    disabled={!currentWarningSign.trim()}
                    className="px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {warningSigns.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Your warning signs:</h4>
                    {warningSigns.map((sign, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200"
                      >
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-700">{sign}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveWarningSign(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
                  <h4 className="font-medium text-gray-900 mb-2">Common warning signs:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Increased anxiety",
                      "Trouble sleeping",
                      "Isolating from others",
                      "Loss of appetite",
                      "Feeling hopeless",
                      "Thoughts of self-harm"
                    ].map((sign) => (
                      <Badge key={sign} variant="secondary" className="text-xs">
                        {sign}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={warningSigns.length === 0}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Coping Strategies */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Coping Strategies</h3>
                <p className="text-sm text-gray-600">What helps you feel better when you're struggling?</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {defaultCopingStrategies.map((strategy, index) => (
                    <motion.div
                      key={strategy}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer border-2 transition-all duration-200 ${
                          copingStrategies.includes(strategy)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => {
                          if (copingStrategies.includes(strategy)) {
                            setCopingStrategies(copingStrategies.filter(s => s !== strategy));
                          } else {
                            setCopingStrategies([...copingStrategies, strategy]);
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm text-gray-700">{strategy}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={copingStrategies.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 rounded-xl py-3 font-medium disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Emergency Contacts */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Emergency Contacts</h3>
                <p className="text-sm text-gray-600">Who can you reach out to when you need support?</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Contact name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                  <Input
                    placeholder="Relationship"
                    value={contactRelationship}
                    onChange={(e) => setContactRelationship(e.target.value)}
                  />
                  <Input
                    placeholder="Phone number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emergency"
                      checked={contactIsEmergency}
                      onChange={(e) => setContactIsEmergency(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="emergency" className="text-sm text-gray-700">
                      Emergency contact
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleAddContact}
                  disabled={!contactName.trim() || !contactPhone.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>

                {emergencyContacts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Your contacts:</h4>
                    {emergencyContacts.map((contact, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
                      >
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                            <p className="text-xs text-gray-600">{contact.relationship} • {contact.phone}</p>
                            {contact.isEmergency && (
                              <Badge className="text-xs mt-1">Emergency</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContact(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Safe Places & Professional Help */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Safe Places & Professional Help</h3>
                <p className="text-sm text-gray-600">Where can you go and who can you call for help?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Safe Places</h4>
                  <div className="space-y-2">
                    {defaultSafePlaces.map((place, index) => (
                      <motion.div
                        key={place}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer border-2 transition-all duration-200 ${
                            safePlaces.includes(place)
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                          onClick={() => {
                            if (safePlaces.includes(place)) {
                              setSafePlaces(safePlaces.filter(p => p !== place));
                            } else {
                              setSafePlaces([...safePlaces, place]);
                            }
                          }}
                        >
                          <CardContent className="p-3">
                            <span className="text-sm text-gray-700">{place}</span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Professional Help</h4>
                  <div className="space-y-2">
                    {defaultProfessionalHelp.map((help, index) => (
                      <motion.div
                        key={help}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer border-2 transition-all duration-200 ${
                            professionalHelp.includes(help)
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                          onClick={() => {
                            if (professionalHelp.includes(help)) {
                              setProfessionalHelp(professionalHelp.filter(h => h !== help));
                            } else {
                              setProfessionalHelp([...professionalHelp, help]);
                            }
                          }}
                        >
                          <CardContent className="p-3">
                            <span className="text-sm text-gray-700">{help}</span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                <Textarea
                  placeholder="Any other important information for your safety plan?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Safety Plan
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 