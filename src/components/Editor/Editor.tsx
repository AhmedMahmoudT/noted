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
    forceEdit?: boolean;
    onForceEditHandled?: () => void;
    focusTitleToken?: number;
}

export default function Editor({
    note,
    initialContent,
    initialTitle,
    onUpdate,
    forceEdit = false,
    onForceEditHandled,
    focusTitleToken = 0,
}: EditorProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isPreview, setIsPreview] = useState(false);
    const [isTitleEditing, setIsTitleEditing] = useState(false);

    // Sync content/title when note changes
    useEffect(() => {
        setTitle(note.title);
        setContent(note.content);
        setIsTitleEditing(false);
    }, [note.id, note.title, note.content]);

    useEffect(() => {
        if (forceEdit) {
            setIsPreview(false);
            onForceEditHandled?.();
            return;
        }

        const storedMode =
            typeof window !== "undefined" ? localStorage.getItem(`noted.noteMode.${note.id}`) : null;
        if (storedMode) {
            setIsPreview(storedMode === "preview");
        }
    }, [note.id, forceEdit, onForceEditHandled]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem(`noted.noteMode.${note.id}`, isPreview ? "preview" : "edit");
    }, [note.id, isPreview]);

    useEffect(() => {
        if (focusTitleToken <= 0) return;
        setIsTitleEditing(true);
    }, [focusTitleToken]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
    };

    const handleTitleBlur = () => {
        setIsTitleEditing(false);
        // Save the title if it was changed
        if (title !== note.title) {
            onUpdate({ title });
        }
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
        if (e.key === 'Escape') {
            setTitle(note.title);
            setIsTitleEditing(false);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setContent(val);
        onUpdate({ content: val });
    };

    const handleContentKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== "Enter" || event.shiftKey) return;

        const textarea = event.currentTarget;
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        if (selectionStart !== selectionEnd) return;

        const value = content;
        const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
        const line = value.slice(lineStart, selectionStart);
        const match = line.match(/^(\s*)([-*+]|(\d+)\.)\s(\[(?: |x|X)\]\s)?(.*)$/);
        if (!match) return;

        event.preventDefault();

        const indent = match[1] ?? "";
        const bullet = match[2] ?? "";
        const number = match[3];
        const checkbox = match[4] ?? "";
        const contentAfter = match[5] ?? "";

        if (contentAfter.trim().length === 0) {
            const newValue = value.slice(0, lineStart) + value.slice(selectionStart);
            setContent(newValue);
            onUpdate({ content: newValue });
            requestAnimationFrame(() => {
                textarea.selectionStart = lineStart;
                textarea.selectionEnd = lineStart;
            });
            return;
        }

        const nextBullet = number ? `${Number.parseInt(number, 10) + 1}.` : bullet;
        const prefix = `${indent}${nextBullet} ${checkbox}`;
        const insertion = `\n${prefix}`;
        const newValue = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd);

        setContent(newValue);
        onUpdate({ content: newValue });
        requestAnimationFrame(() => {
            const cursor = selectionStart + insertion.length;
            textarea.selectionStart = cursor;
            textarea.selectionEnd = cursor;
        });
    };

    const handleToggleTask = (lineNumber?: number | null) => {
        if (!lineNumber || lineNumber < 1) return;
        const lines = content.split("\n");
        const lineIndex = lineNumber - 1;
        const line = lines[lineIndex];
        if (!line) return;

        const match = line.match(/^(\s*)([-*+]|\d+\.)\s\[( |x|X)\](.*)$/);
        if (!match) return;

        const isChecked = match[3].toLowerCase() === "x";
        lines[lineIndex] = line.replace(/\[( |x|X)\]/, isChecked ? "[ ]" : "[x]");
        const updated = lines.join("\n");

        if (updated !== content) {
            setContent(updated);
            onUpdate({ content: updated });
        }
    };

    const handleTogglePreview = () => {
        const newPreviewState = !isPreview;
        setIsPreview(newPreviewState);
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                {isTitleEditing ? (
                    <input
                        className="editor-title-input"
                        placeholder="Untitled"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyDown={handleTitleKeyDown}
                        autoFocus
                    />
                ) : (
                    <h1
                        className="editor-title-display"
                        onClick={() => setIsTitleEditing(true)}
                        title="Click to edit title"
                    >
                        {title || "Untitled"}
                    </h1>
                )}
                <button
                    onClick={handleTogglePreview}
                    className="btn-icon"
                    title={isPreview ? "Edit" : "Preview"}
                >
                    {isPreview ? <Edit3 className="icon-md" /> : <Eye className="icon-md" />}
                </button>
            </div>

            <div className="editor-content">
                {isPreview ? (
                    <Preview content={content} onToggleTask={handleToggleTask} />
                ) : (
                    <textarea
                        className="editor-textarea"
                        placeholder="Start typing..."
                        value={content}
                        onChange={handleContentChange}
                        onKeyDown={handleContentKeyDown}
                    />
                )}
            </div>
        </div>
    );
}
