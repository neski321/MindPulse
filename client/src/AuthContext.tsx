import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";

interface User {
  id: string;
  name?: string;
  email?: string;
  isGuest: boolean;
  firebaseUid?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

async function fetchOrCreateUser(firebaseUid: string, email?: string, name?: string): Promise<User> {
  // Call backend to fetch or create user in Postgres
  const res = await fetch("/api/users/firebase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firebaseUid, email, name }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to sync user with backend");
  const data = await res.json();
  return { ...data.user, isGuest: false, firebaseUid };
}

async function createGuestUser(): Promise<User> {
  // Call backend to create a guest user in Postgres
  const res = await fetch("/api/users/guest", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create guest user");
  const data = await res.json();
  return { ...data.user, isGuest: true };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Authenticated user
        try {
          const syncedUser = await fetchOrCreateUser(
            firebaseUser.uid,
            firebaseUser.email || undefined,
            firebaseUser.displayName || undefined
          );
          setUser(syncedUser);
        } catch (e) {
          setUser(null);
        }
      } else {
        // Check for guest user in localStorage
        const guest = localStorage.getItem("guestUser");
        if (guest) {
          setUser(JSON.parse(guest));
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
      await cred.user.reload();
    }
    console.log("[SignUp] Sending to backend:", { uid: cred.user.uid, email, name });
    // Always use the name from the form
    const syncedUser = await fetchOrCreateUser(cred.user.uid, email, name);
    setUser(syncedUser);
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const syncedUser = await fetchOrCreateUser(cred.user.uid, cred.user.email || undefined, cred.user.displayName || undefined);
    setUser(syncedUser);
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const cred = await signInWithPopup(auth, googleProvider);
    const syncedUser = await fetchOrCreateUser(cred.user.uid, cred.user.email || undefined, cred.user.displayName || undefined);
    setUser(syncedUser);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  const signInAsGuest = async () => {
    setLoading(true);
    const guestUser = await createGuestUser();
    setUser(guestUser);
    localStorage.setItem("guestUser", JSON.stringify(guestUser));
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, login, loginWithGoogle, logout, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
} 