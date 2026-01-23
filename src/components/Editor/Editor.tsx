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

    const handleToggleTask = (taskIndex: number) => {
        let index = 0;
        const updated = content.replace(/-\s\[( |x|X)\]/g, (match, state) => {
            if (index !== taskIndex) {
                index += 1;
                return match;
            }
            index += 1;
            return state.toLowerCase() === "x" ? "- [ ]" : "- [x]";
        });

        if (updated !== content) {
            setContent(updated);
            onUpdate({ content: updated });
        }
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
    )
}
