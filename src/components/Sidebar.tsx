"use client";

import { Note } from "@/lib/types/note";
import { Plus, FileText, Search, Settings, Folder, Trash2 } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    notes: Note[];
    activeNoteId?: string;
    onSelectNote: (note: Note) => void;
    onCreateNote: () => void;
    onOpenSettings: () => void;
    onDeleteNote: (note: Note) => void;
}

export default function Sidebar({
    notes,
    activeNoteId,
    onSelectNote,
    onCreateNote,
    onOpenSettings,
    onDeleteNote,
}: SidebarProps) {
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
                        <div key={note.id} className={`note-row ${activeNoteId === note.id ? "active" : ""}`}>
                            <button
                                onClick={() => onSelectNote(note)}
                                className="note-item"
                                aria-label={`Open ${note.title || "Untitled"}`}
                            >
                                <FileText className="note-icon" />
                                <span className="note-title">{note.title || "Untitled"}</span>
                            </button>
                            <button
                                onClick={() => onDeleteNote(note)}
                                className="btn-icon note-delete"
                                title="Delete note"
                                aria-label={`Delete ${note.title || "Untitled"}`}
                            >
                                <Trash2 className="icon-sm" />
                            </button>
                        </div>
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
