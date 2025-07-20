import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InterventionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  gradient: string;
  onStart: () => void;
  children?: React.ReactNode;
}

export function InterventionCard({
  title,
  description,
  icon,
  iconBg,
  gradient,
  onStart,
  children
}: InterventionCardProps) {
  return (
    <Card className={cn("card-shadow", gradient)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", iconBg)}>
              {icon}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <Button
            onClick={onStart}
            className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-50 border border-gray-200 shadow-sm"
            variant="outline"
          >
            Start
          </Button>
        </div>
        
        {children}
      </CardContent>
    </Card>
  );
}
