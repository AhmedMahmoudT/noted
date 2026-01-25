"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface PreviewProps {
    content: string;
    onToggleTask?: (index: number) => void;
}

type MarkdownSection = {
    heading: { level: number; text: string } | null;
    content: string;
    contentStartLine: number;
    contentLineCount: number;
    children: MarkdownSection[];
};

const splitMarkdownSections = (markdown: string): MarkdownSection[] => {
    const lines = markdown.split("\n");
    const rootSections: MarkdownSection[] = [];
    const stack: MarkdownSection[] = [];

    let currentContent = "";
    let currentContentStartLine = 1;
    let currentContentLineCount = 0;

    const countLines = (value: string) => value.split("\n").length - 1;

    const flushContent = () => {
        if (!currentContent) return;
        const appendedLineCount = countLines(currentContent);

        if (stack.length > 0) {
            const target = stack[stack.length - 1];
            if (!target.content) {
                target.contentStartLine = currentContentStartLine;
            }
            target.content += currentContent;
            target.contentLineCount += appendedLineCount;
        } else if (rootSections.length > 0 && !rootSections[rootSections.length - 1].heading) {
            const target = rootSections[rootSections.length - 1];
            if (!target.content) {
                target.contentStartLine = currentContentStartLine;
            }
            target.content += currentContent;
            target.contentLineCount += appendedLineCount;
        } else {
            rootSections.push({
                heading: null,
                content: currentContent,
                contentStartLine: currentContentStartLine,
                contentLineCount: appendedLineCount,
                children: [],
            });
        }

        currentContent = "";
        currentContentLineCount = 0;
    };

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const lineNumber = index + 1;
        const match = line.match(/^(#{1,6})\s+(.*)$/);
        if (match) {
            flushContent();
            const level = match[1].length;
            const text = match[2].trim();
            const newSection: MarkdownSection = {
                heading: { level, text },
                content: "",
                contentStartLine: lineNumber + 1,
                contentLineCount: 0,
                children: [],
            };

            while (stack.length > 0 && stack[stack.length - 1].heading!.level >= level) {
                stack.pop();
            }

            if (stack.length > 0) {
                stack[stack.length - 1].children.push(newSection);
            } else {
                rootSections.push(newSection);
            }
            stack.push(newSection);
        } else {
            if (!currentContent) {
                currentContentStartLine = lineNumber;
            }
            currentContent += `${line}\n`;
            currentContentLineCount += 1;
        }
    }
    flushContent();
    return rootSections;
};

export default function Preview({ content, onToggleTask }: PreviewProps) {
    const sections = useMemo(() => splitMarkdownSections(content), [content]);
    const getTaskLines = (markdown: string) => {
        return markdown
            .split("\n")
            .map((line, index) =>
                /^\s*(?:[-*+]|\d+\.)\s\[( |x|X)\]/.test(line) ? index + 1 : null
            )
            .filter((line): line is number => line !== null);
    };
    const taskLines = useMemo(() => getTaskLines(content), [content]);

    const renderMarkdown = (markdown: string, sectionStartLine: number, sectionLineCount: number) => {
        const sectionEndLine = sectionStartLine + sectionLineCount - 1;
        const sectionTaskLines = taskLines.filter(
            (line) => line >= sectionStartLine && line <= sectionEndLine
        );
        let taskCursor = 0;

        const components = {
            input: ({ checked }: { checked?: boolean }) => {
                const line = sectionTaskLines[taskCursor++];
                return (
                    <input
                        type="checkbox"
                        checked={Boolean(checked)}
                        readOnly
                        onClick={() => onToggleTask?.(line)}
                    />
                );
            },
            code: ({ node, inline, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                );
            },
            // Remove bullet points from task lists
            li: ({ node, children, ...props }: any) => {
                const hasCheckbox = node?.children?.some(
                    (child: any) =>
                        child.type === "element" &&
                        child.tagName === "input" &&
                        child.properties?.type === "checkbox"
                );

                return (
                    <li className={hasCheckbox ? "task-list-item" : ""} {...props}>
                        {children}
                    </li>
                );
            },
        };

        return (
            <div className="markdown-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                    components={components}
                >
                    {markdown}
                </ReactMarkdown>
            </div>
        );
    };

    const SectionBlock = ({ section }: { section: MarkdownSection }) => {
        if (!section.heading) {
            return (
                <div>
                    {renderMarkdown(
                        section.content,
                        section.contentStartLine,
                        section.contentLineCount
                    )}
                </div>
            );
        }

        return (
            <details open className="markdown-section">
                <summary className={`markdown-heading level-${section.heading.level}`}>
                    {section.heading.text}
                </summary>
                <div className="markdown-section-body">
                    {section.content &&
                        renderMarkdown(
                            section.content,
                            section.contentStartLine,
                            section.contentLineCount
                        )}
                    {section.children.map((child, i) => (
                        <SectionBlock key={i} section={child} />
                    ))}
                </div>
            </details>
        );
    };

    return (
        <div className="markdown-preview w-full h-full overflow-y-auto p-4">
            {sections.map((section, index) => (
                <SectionBlock key={index} section={section} />
            ))}
        </div>
    );
}
