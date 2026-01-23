"use client";

import { logout } from "@/lib/firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Editor from "./Editor/Editor";
import { useState, useEffect, useCallback } from "react";
import { Note } from "@/lib/types/note";
import { NoteService } from "@/lib/firebase/services/noteService";

const appFontOptions = [
    {
        id: "geist",
        label: "Geist Sans",
        value:
            'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    {
        id: "system",
        label: "System",
        value:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    { id: "serif", label: "Serif", value: 'Georgia, "Times New Roman", Times, serif' },
    {
        id: "mono",
        label: "Mono",
        value:
            'var(--font-geist-mono), "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
];

const markdownFontOptions = [
    {
        id: "geist",
        label: "Geist Sans",
        value:
            'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    { id: "serif", label: "Serif", value: 'Georgia, "Times New Roman", Times, serif' },
    {
        id: "mono",
        label: "Mono",
        value:
            'var(--font-geist-mono), "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
];

const themeOptions = [
    {
        id: "noir",
        label: "Noir",
        values: {
            "--background": "240 10% 4%",
            "--foreground": "0 0% 98%",
            "--card": "240 10% 4%",
            "--card-foreground": "0 0% 98%",
            "--popover": "240 10% 4%",
            "--popover-foreground": "0 0% 98%",
            "--primary": "0 0% 98%",
            "--primary-foreground": "240 5.9% 10%",
            "--secondary": "240 4% 16%",
            "--secondary-foreground": "0 0% 98%",
            "--muted": "240 4% 16%",
            "--muted-foreground": "240 5% 65%",
            "--accent": "240 4% 16%",
            "--accent-foreground": "0 0% 98%",
            "--destructive": "0 63% 31%",
            "--destructive-foreground": "0 0% 98%",
            "--border": "240 4% 16%",
            "--input": "240 4% 16%",
            "--ring": "240 5% 84%",
        },
    },
    {
        id: "paper",
        label: "Paper",
        values: {
            "--background": "40 33% 96%",
            "--foreground": "240 10% 12%",
            "--card": "40 33% 98%",
            "--card-foreground": "240 10% 12%",
            "--popover": "40 33% 98%",
            "--popover-foreground": "240 10% 12%",
            "--primary": "240 10% 12%",
            "--primary-foreground": "0 0% 100%",
            "--secondary": "40 20% 90%",
            "--secondary-foreground": "240 10% 12%",
            "--muted": "40 16% 92%",
            "--muted-foreground": "240 5% 40%",
            "--accent": "40 18% 88%",
            "--accent-foreground": "240 10% 12%",
            "--destructive": "0 63% 40%",
            "--destructive-foreground": "0 0% 98%",
            "--border": "40 14% 82%",
            "--input": "40 14% 82%",
            "--ring": "240 5% 40%",
        },
    },
    {
        id: "slate",
        label: "Slate",
        values: {
            "--background": "220 18% 12%",
            "--foreground": "210 20% 96%",
            "--card": "220 18% 14%",
            "--card-foreground": "210 20% 96%",
            "--popover": "220 18% 14%",
            "--popover-foreground": "210 20% 96%",
            "--primary": "210 20% 96%",
            "--primary-foreground": "220 18% 12%",
            "--secondary": "220 14% 22%",
            "--secondary-foreground": "210 20% 96%",
            "--muted": "220 14% 22%",
            "--muted-foreground": "215 12% 70%",
            "--accent": "220 14% 22%",
            "--accent-foreground": "210 20% 96%",
            "--destructive": "0 63% 36%",
            "--destructive-foreground": "0 0% 98%",
            "--border": "220 12% 24%",
            "--input": "220 12% 24%",
            "--ring": "210 20% 80%",
        },
    },
];

export default function Dashboard() {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | undefined>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [appFont, setAppFont] = useState("geist");
    const [markdownFont, setMarkdownFont] = useState("geist");
    const [theme, setTheme] = useState("noir");

    // Subscribe to notes
    useEffect(() => {
        if (!user) return;

        const unsubscribe = NoteService.subscribeToNotes(user.uid, (fetchedNotes) => {
            setNotes(fetchedNotes);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        const storedAppFont = localStorage.getItem("noted.appFont");
        const storedMarkdownFont = localStorage.getItem("noted.markdownFont");
        const storedTheme = localStorage.getItem("noted.theme");

        if (storedAppFont) setAppFont(storedAppFont);
        if (storedMarkdownFont) setMarkdownFont(storedMarkdownFont);
        if (storedTheme) setTheme(storedTheme);
    }, []);

    useEffect(() => {
        const selectedAppFont = appFontOptions.find((option) => option.id === appFont);
        if (selectedAppFont) {
            document.documentElement.style.setProperty("--app-font", selectedAppFont.value);
            localStorage.setItem("noted.appFont", selectedAppFont.id);
        }
    }, [appFont]);

    useEffect(() => {
        const selectedMarkdownFont = markdownFontOptions.find((option) => option.id === markdownFont);
        if (selectedMarkdownFont) {
            document.documentElement.style.setProperty("--markdown-font", selectedMarkdownFont.value);
            localStorage.setItem("noted.markdownFont", selectedMarkdownFont.id);
        }
    }, [markdownFont]);

    useEffect(() => {
        const selectedTheme = themeOptions.find((option) => option.id === theme);
        if (!selectedTheme) return;

        Object.entries(selectedTheme.values).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
        localStorage.setItem("noted.theme", selectedTheme.id);
    }, [theme]);

    const handleCreateNote = async () => {
        if (!user) return;
        try {
            const newNote = await NoteService.createNote(user.uid);
            setActiveNoteId(newNote.id);
        } catch (error) {
            console.error("Failed to create note", error);
        }
    };

    const handleDeleteNote = async (note: Note) => {
        if (!user) return;
        const confirmed = window.confirm(`Delete "${note.title || "Untitled"}"?`);
        if (!confirmed) return;
        try {
            await NoteService.deleteNote(note.id);
            if (activeNoteId === note.id) {
                const remainingNotes = notes.filter((item) => item.id !== note.id);
                setActiveNoteId(remainingNotes[0]?.id);
            }
        } catch (error) {
            console.error("Failed to delete note", error);
        }
    };

    const activeNote = notes.find(n => n.id === activeNoteId);

    // Simple debounce implementation
    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdate = useCallback(debounce((id: string, data: Partial<Note>) => {
        NoteService.updateNote(id, data);
    }, 1000), []);


    return (
        <div className="app-layout">
            {/* Mobile Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
                <Sidebar
                    notes={notes}
                    activeNoteId={activeNoteId}
                    onSelectNote={(note) => {
                        setActiveNoteId(note.id);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    onCreateNote={handleCreateNote}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onDeleteNote={handleDeleteNote}
                />
            </div>

            {/* Main Content */}
            <main className="main-content">
                <header className="app-header">
                    <div className="header-left">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn-icon mobile-menu-btn">
                            <Menu className="icon-md" />
                        </button>
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} className="btn-icon desktop-menu-btn">
                                <Menu className="icon-sm" />
                            </button>
                        )}
                        <span className="header-title">{activeNote ? (activeNote.title || "Untitled") : "Noted"}</span>
                    </div>

                    <div className="header-right">
                        <span className="user-name">{user?.displayName}</span>
                        <button onClick={logout} className="btn-icon" title="Logout">
                            <LogOut className="icon-sm" />
                        </button>
                    </div>
                </header>

                <div className="content-area">
                    {activeNote ? (
                        <div className="editor-wrapper">
                            <Editor
                                note={activeNote}
                                initialTitle={activeNote.title}
                                initialContent={activeNote.content}
                                onUpdate={(data) => debouncedUpdate(activeNote.id, data)}
                            />
                        </div>
                    ) : (
                        <div className="empty-content">
                            <p>Select a note or create a new one.</p>
                        </div>
                    )}
                </div>
            </main>

            {isSettingsOpen && (
                <div className="settings-overlay" onClick={() => setIsSettingsOpen(false)}>
                    <div
                        className="settings-panel"
                        role="dialog"
                        aria-modal="true"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="settings-header">
                            <h2>Settings</h2>
                            <button className="btn-icon" onClick={() => setIsSettingsOpen(false)} aria-label="Close">
                                <X className="icon-md" />
                            </button>
                        </div>
                        <div className="settings-body">
                            <label className="settings-row">
                                <span>App font</span>
                                <select
                                    className="settings-select"
                                    value={appFont}
                                    onChange={(event) => setAppFont(event.target.value)}
                                >
                                    {appFontOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="settings-row">
                                <span>Markdown font</span>
                                <select
                                    className="settings-select"
                                    value={markdownFont}
                                    onChange={(event) => setMarkdownFont(event.target.value)}
                                >
                                    {markdownFontOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="settings-row">
                                <span>Theme</span>
                                <select
                                    className="settings-select"
                                    value={theme}
                                    onChange={(event) => setTheme(event.target.value)}
                                >
                                    {themeOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
