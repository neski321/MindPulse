import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/bottom-nav";
import { BackgroundAnimation } from "@/components/background-animation";
import SplashCursor from "@/components/splash-cursor";
import Home from "@/pages/home";
import Progress from "@/pages/progress";
import Resources from "@/pages/resources";
import Community from "@/pages/community";
import Settings from "@/pages/settings";
import AdminPage from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "./AuthContext";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";
import { ModalProvider } from "./contexts/ModalContext";
import { AuthModal } from "@/components/ui/auth-modal";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/progress" component={Progress} />
      <Route path="/resources" component={Resources} />
      <Route path="/community" component={Community} />
      <Route path="/settings" component={Settings} />
      <Route path="/admin-neski" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ModalProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <div className="min-h-screen bg-gray-50 relative">
                {/* Background Animation */}
                <BackgroundAnimation />

                {/* Splash Cursor Effect */}
                <SplashCursorWrapper />

                {/* Main Content */}
                <div className="relative z-10">
                  <header className="w-full flex justify-end p-2">
                    <AuthButton />
                  </header>
                  <Router />
                  <BottomNav />
                </div>

                <Toaster />
                <AuthModalWrapper />
              </div>
            </TooltipProvider>
          </QueryClientProvider>
        </ModalProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

function SplashCursorWrapper() {
  const { cursorEffects } = useSettings();
  return cursorEffects ? <SplashCursor /> : null;
}

function AuthButton() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  if (user || loading) return null;

  return (
    <Button onClick={() => setAuthOpen(true)} variant="outline">
      Login / Sign Up / Guest
    </Button>
  );
}

function AuthModalWrapper() {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  // Listen for custom event to open AuthModal from anywhere
  useEffect(() => {
    const handler = () => setAuthOpen(true);
    window.addEventListener("open-auth-modal", handler);
    return () => window.removeEventListener("open-auth-modal", handler);
  }, []);

  return (
    <AuthModal open={authOpen || (!user && !loading)} onOpenChange={setAuthOpen} />
  );
}

export default App;
