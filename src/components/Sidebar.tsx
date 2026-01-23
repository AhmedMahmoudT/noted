"use client";

import { Note } from "@/lib/types/note";
import { Plus, FileText, Search, Settings, Folder } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    notes: Note[];
    activeNoteId?: string;
    onSelectNote: (note: Note) => void;
    onCreateNote: () => void;
    onOpenSettings: () => void;
}

export default function Sidebar({ notes, activeNoteId, onSelectNote, onCreateNote, onOpenSettings }: SidebarProps) {
    const [search, setSearch] = useState("");

    const filteredNotes = notes.filter((note) =>
        note.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <aside className="app-sidebar">
            {/* Header */}
            <div className="sidebar-header">
                <div className="brand">
                    <Folder className="icon-md" />
                    <span>Noted</span>
                </div>
                <button onClick={onCreateNote} className="btn-icon">
                    <Plus className="icon-md" />
                </button>
            </div>

            {/* Search */}
            <div className="sidebar-search">
                <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Note List */}
            <div className="note-list">
                {filteredNotes.length === 0 ? (
                    <div className="empty-state">
                        {search ? "No notes found" : "No notes yet"}
                    </div>
                ) : (
                    filteredNotes.map((note) => (
                        <button
                            key={note.id}
                            onClick={() => onSelectNote(note)}
                            className={`note-item ${activeNoteId === note.id ? "active" : ""}`}
                        >
                            <FileText className="note-icon" />
                            <span className="note-title">{note.title || "Untitled"}</span>
                        </button>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
                <button className="btn btn-ghost btn-full flex-start" onClick={onOpenSettings}>
                    <Settings className="icon-sm" />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
}
