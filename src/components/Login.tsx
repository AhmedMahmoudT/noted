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
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">
                        <NotebookPen className="icon-lg" />
                    </div>
                    <h1 className="auth-title">Welcome to Noted</h1>
                    <p className="auth-subtitle">
                        Your offline-first, second brain.
                    </p>
                </div>

                <div className="auth-actions">
                    <button
                        onClick={handleLogin}
                        className="btn btn-primary btn-full"
                    >
                        Sign in with Google
                    </button>
                    {error && <p className="error-text">{error}</p>}
                </div>
            </div>
        </div>
    );
}
