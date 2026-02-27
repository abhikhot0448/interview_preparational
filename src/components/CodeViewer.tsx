import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Terminal } from 'lucide-react';

interface CodeViewerProps {
    code: string;
    language?: string;
    title?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
    code,
    language = 'csharp',
    title = 'C# Snippet'
}) => {
    return (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#1E1E1E] my-6 shadow-2xl">
            <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5">
                <Terminal className="w-4 h-4 text-cyan-vibrant mr-2" />
                <span className="text-sm font-medium text-slate-300">{title}</span>
                <div className="flex-1" />
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
            </div>
            <div className="p-4 text-sm">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: 0,
                        background: 'transparent',
                        fontSize: '14px',
                        lineHeight: '1.5',
                    }}
                    wrapLines={true}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};
