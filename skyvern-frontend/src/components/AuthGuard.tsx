import { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Read auth config from environment variables
// Vite env vars are always strings, so we check for the string "true"
const AUTH_ENABLED_RAW = import.meta.env.VITE_UI_AUTH_ENABLED as string | undefined;
const AUTH_ENABLED = String(AUTH_ENABLED_RAW || "").toLowerCase() === "true";
const AUTH_USERNAME = (import.meta.env.VITE_UI_AUTH_USERNAME as string | undefined) || "admin";
const AUTH_PASSWORD = (import.meta.env.VITE_UI_AUTH_PASSWORD as string | undefined) || "admin";

// Debug logging (always log to help diagnose)
console.log("[AuthGuard] Configuration:", {
  VITE_UI_AUTH_ENABLED: AUTH_ENABLED_RAW,
  AUTH_ENABLED,
  hasUsername: !!AUTH_USERNAME,
  hasPassword: !!AUTH_PASSWORD,
});

const SESSION_KEY = "skyvern.ui.authenticated";
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is disabled, allow access immediately
    if (!AUTH_ENABLED) {
      setAuthenticated(true);
      setLoading(false);
      return;
    }

    // Check if user is already authenticated
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (sessionData) {
      try {
        const { timestamp } = JSON.parse(sessionData);
        const now = Date.now();
        
        // Check if session is still valid
        if (now - timestamp < SESSION_TIMEOUT) {
          setAuthenticated(true);
          setLoading(false);
          return;
        } else {
          // Session expired
          sessionStorage.removeItem(SESSION_KEY);
        }
      } catch (e) {
        // Invalid session data
        sessionStorage.removeItem(SESSION_KEY);
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate credentials
    if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
      // Store authentication in session storage
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ timestamp: Date.now() })
      );
      setAuthenticated(true);
    } else {
      setError("Invalid username or password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  // If not authenticated and auth is enabled, show login form
  if (!authenticated && AUTH_ENABLED) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Skyvern Login
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated, render children with optional logout button
  return (
    <>
      {AUTH_ENABLED && (
        <div className="fixed right-4 top-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-white"
          >
            Logout
          </Button>
        </div>
      )}
      {children}
    </>
  );
}

