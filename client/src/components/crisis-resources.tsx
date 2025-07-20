import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Phone, MessageCircle, Globe, ExternalLink, AlertTriangle } from "lucide-react";

interface CrisisResourcesProps {
  onClose: () => void;
}

export function CrisisResources({ onClose }: CrisisResourcesProps) {
  const { data: resourcesData, isLoading } = useQuery({
    queryKey: ["/api/crisis-resources"],
    queryFn: async () => {
      const response = await fetch("/api/crisis-resources");
      if (!response.ok) throw new Error("Failed to fetch crisis resources");
      return response.json();
    }
  });

  const handleCallResource = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleTextResource = (text: string) => {
    window.location.href = `sms:${text}`;
  };

  const emergencyResources = [
    {
      name: "Emergency Services",
      phone: "911",
      description: "For immediate life-threatening emergencies",
      priority: "highest",
      available: "24/7",
      type: "emergency"
    }
  ];

  const allResources = [...emergencyResources, ...(resourcesData?.resources || [])];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              Crisis Resources
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Emergency Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">
                  If you're in immediate danger
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  Call 911 or go to your nearest emergency room immediately.
                </p>
                <Button
                  onClick={() => handleCallResource("911")}
                  className="bg-red-600 text-white hover:bg-red-700"
                  size="sm"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911
                </Button>
              </div>
            </div>
          </div>

          {/* Crisis Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">24/7 Crisis Support</h3>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-20 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {allResources.map((resource, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {resource.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              variant={resource.priority === "highest" ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {resource.available}
                            </Badge>
                            {resource.type === "emergency" && (
                              <Badge variant="outline" className="text-xs">
                                Emergency
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {resource.phone && (
                          <Button
                            onClick={() => handleCallResource(resource.phone)}
                            className="flex-1 bg-red-500 text-white hover:bg-red-600"
                            size="sm"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call {resource.phone}
                          </Button>
                        )}
                        
                        {resource.text && (
                          <Button
                            onClick={() => handleTextResource(resource.text)}
                            variant="outline"
                            className="flex-1"
                            size="sm"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Text
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Additional Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Additional Support</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <Card className="border border-gray-200 hover:border-[hsl(207,90%,54%)] transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[hsl(207,90%,94%)] rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-[hsl(207,90%,54%)]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Mental Health Resources</h4>
                        <p className="text-sm text-gray-600">Find local mental health services</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 hover:border-[hsl(207,90%,54%)] transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[hsl(142,71%,95%)] rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-[hsl(142,71%,45%)]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Online Chat Support</h4>
                        <p className="text-sm text-gray-600">Anonymous chat with trained counselors</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Safety Planning */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Safety Planning</h3>
            <p className="text-sm text-blue-700 mb-3">
              Consider creating a safety plan with coping strategies, support contacts, and warning signs.
            </p>
            <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
              Learn About Safety Planning
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Important:</strong> This app is not a substitute for professional mental health care or emergency services. If you're experiencing thoughts of self-harm or suicide, please reach out to emergency services or a crisis helpline immediately.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
