"use client";

import { useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface PreviewProps {
    content: string;
    onToggleTask?: (index: number) => void;
}

type MarkdownSection = {
    heading: { level: number; text: string } | null;
    content: string;
};

const splitMarkdownSections = (markdown: string): MarkdownSection[] => {
    const lines = markdown.split("\n");
    const sections: MarkdownSection[] = [];
    let current: MarkdownSection = { heading: null, content: "" };

    const pushCurrent = () => {
        if (current.heading || current.content.trim().length > 0) {
            sections.push({ ...current });
        }
    };

    for (const line of lines) {
        const match = line.match(/^(#{1,6})\s+(.*)$/);
        if (match) {
            pushCurrent();
            current = {
                heading: { level: match[1].length, text: match[2].trim() },
                content: "",
            };
        } else {
            current.content += `${line}\n`;
        }
    }

    pushCurrent();
    return sections;
};

export default function Preview({ content, onToggleTask }: PreviewProps) {
    const sections = useMemo(() => splitMarkdownSections(content), [content]);
    const taskIndexRef = useRef(0);
    taskIndexRef.current = 0;

    const components = {
        input: ({ checked }: { checked?: boolean }) => {
            const index = taskIndexRef.current++;
            return (
                <input
                    type="checkbox"
                    checked={Boolean(checked)}
                    onChange={() => onToggleTask?.(index)}
                />
            );
        },
    };

    const renderMarkdown = (markdown: string) => (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
            {markdown}
        </ReactMarkdown>
    );

    return (
        <div className="markdown-preview w-full h-full overflow-y-auto p-4">
            {sections.map((section, index) => {
                if (!section.heading) {
                    return (
                        <div key={`section-${index}`}>
                            {renderMarkdown(section.content)}
                        </div>
                    );
                }

                return (
                    <details key={`section-${index}`} className="markdown-section" open>
                        <summary className={`markdown-heading level-${section.heading.level}`}>
                            {section.heading.text}
                        </summary>
                        <div className="markdown-section-body">
                            {renderMarkdown(section.content)}
                        </div>
                    </details>
                );
            })}
        </div>
    );
}
