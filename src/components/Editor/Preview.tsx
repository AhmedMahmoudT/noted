"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PreviewProps {
    content: string;
}

export default function Preview({ content }: PreviewProps) {
    return (
        <div className="markdown-preview w-full h-full overflow-y-auto p-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
