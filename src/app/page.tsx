"use client";

import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
}
