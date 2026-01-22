"use client";

import { logout } from "@/lib/firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Note } from "@/lib/types/note";

export default function Dashboard() {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]); // TODO: Fetch from Firestore
    const [activeNoteId, setActiveNoteId] = useState<string | undefined>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Mock create note for now
    const handleCreateNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: "New Note",
            content: "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            userId: user?.uid || "",
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const activeNote = notes.find(n => n.id === activeNoteId);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className={`fixed z-30 h-full transition-transform md:relative md:transform-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Sidebar
                    notes={notes}
                    activeNoteId={activeNoteId}
                    onSelectNote={(note) => {
                        setActiveNoteId(note.id);
                        // On mobile, close sidebar after selection
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    onCreateNote={handleCreateNote}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full w-full min-w-0 bg-background transition-all">
                <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-secondary rounded-md md:hidden">
                            <Menu className="h-5 w-5" />
                        </button>
                        {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="hidden md:block p-2 hover:bg-secondary rounded-md text-muted-foreground"><Menu className="h-4 w-4" /></button>}
                        <span className="font-medium truncate">{activeNote ? activeNote.title : "Noted"}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">{user?.displayName}</span>
                        <button onClick={logout} className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground" title="Logout">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden">
                    {activeNote ? (
                        <div className="h-full p-4 md:p-8 max-w-3xl mx-auto">
                            <textarea
                                className="w-full bg-transparent text-3xl font-bold mb-4 focus:outline-none resize-none"
                                value={activeNote.title}
                                onChange={(e) => {
                                    setNotes(notes.map(n => n.id === activeNote.id ? { ...n, title: e.target.value } : n));
                                }}
                            />
                            <textarea
                                className="w-full h-[calc(100%-80px)] bg-transparent text-lg focus:outline-none resize-none leading-relaxed text-muted-foreground focus:text-foreground transition-colors"
                                placeholder="Start typing..."
                                value={activeNote.content}
                                onChange={(e) => {
                                    setNotes(notes.map(n => n.id === activeNote.id ? { ...n, content: e.target.value } : n));
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
                            <p>Select a note or create a new one.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
