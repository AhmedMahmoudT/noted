"use client";

import { Note } from "@/lib/types/note";
import { Plus, FileText, Search, Settings, Folder } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    notes: Note[];
    activeNoteId?: string;
    onSelectNote: (note: Note) => void;
    onCreateNote: () => void;
}

export default function Sidebar({ notes, activeNoteId, onSelectNote, onCreateNote }: SidebarProps) {
    const [search, setSearch] = useState("");

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <aside className="flex flex-col w-64 h-screen border-r border-border bg-secondary/10 shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-foreground/90">
                    <Folder className="h-5 w-5" />
                    <span>Noted</span>
                </div>
                <button onClick={onCreateNote} className="p-1 hover:bg-secondary rounded hover:text-foreground text-muted-foreground transition-colors">
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            {/* Search */}
            <div className="p-3">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="w-full bg-secondary/50 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground/70"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Note List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredNotes.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">
                        {search ? "No notes found" : "No notes yet"}
                    </div>
                ) : (
                    filteredNotes.map((note) => (
                        <button
                            key={note.id}
                            onClick={() => onSelectNote(note)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left group
                    ${activeNoteId === note.id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                }`}
                        >
                            <FileText className="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100" />
                            <span className="truncate">{note.title || "Untitled"}</span>
                        </button>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border">
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full px-2 py-1.5 rounded-md hover:bg-secondary/50 transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
}
