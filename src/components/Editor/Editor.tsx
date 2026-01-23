"use client";

import { useState, useEffect } from "react";
import { Note } from "@/lib/types/note";
import Preview from "./Preview";
import { Eye, Edit3 } from "lucide-react";

interface EditorProps {
    note: Note;
    initialContent: string;
    initialTitle: string;
    onUpdate: (data: Partial<Note>) => void;
}

export default function Editor({ note, initialContent, initialTitle, onUpdate }: EditorProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isPreview, setIsPreview] = useState(false);

    // Sync if note ID changes
    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
        setIsPreview(false);
    }, [note.id, note.title, note.content]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        onUpdate({ title: val });
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setContent(val);
        onUpdate({ content: val });
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <input
                    className="editor-title-input"
                    placeholder="Untitled"
                    value={title}
                    onChange={handleTitleChange}
                    disabled={isPreview}
                />
                <button
                    onClick={() => setIsPreview(!isPreview)}
                    className="btn-icon"
                    title={isPreview ? "Edit" : "Preview"}
                >
                    {isPreview ? <Edit3 className="icon-md" /> : <Eye className="icon-md" />}
                </button>
            </div>

            <div className="editor-content">
                {isPreview ? (
                    <Preview content={content} />
                ) : (
                    <textarea
                        className="editor-textarea"
                        placeholder="Start typing..."
                        value={content}
                        onChange={handleContentChange}
                    />
                )}
            </div>
        </div>
    )
}
