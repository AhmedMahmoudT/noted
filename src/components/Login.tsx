"use client";

import { loginWithGoogle } from "@/lib/firebase/auth";
import { useState } from "react";
import { NotebookPen } from "lucide-react";

export default function Login() {
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError("");
            await loginWithGoogle();
        } catch (err: any) {
            setError(err.message || "Failed to login");
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex w-full max-w-sm flex-col items-center justify-center gap-6 p-4">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="rounded-xl bg-secondary p-3">
                        <NotebookPen className="h-8 w-8 text-foreground" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome to Noted</h1>
                    <p className="text-sm text-muted-foreground">
                        Your offline-first, second brain.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <button
                        onClick={handleLogin}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                    >
                        Sign in with Google
                    </button>
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
}
