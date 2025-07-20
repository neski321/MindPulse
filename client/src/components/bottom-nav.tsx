import { Link, useLocation } from "wouter";
import { Home, TrendingUp, BookOpen, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/resources", label: "Resources", icon: BookOpen },
  { path: "/community", label: "Community", icon: Users },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex flex-col items-center p-2 transition-colors",
                  isActive 
                    ? "text-[hsl(207,90%,54%)]" 
                    : "text-gray-400 hover:text-[hsl(207,90%,54%)]"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
