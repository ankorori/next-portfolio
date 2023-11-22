import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeBlock = ({ inline, className, children }) => {
    if (inline) {
        return <code className={className}>{children}</code>;
    }
    const match = /language-(\w+)/.exec(className || '');
    const lang = match && match[1] ? match[1] : '';
    return (
        <SyntaxHighlighter
            style={darcula}
            language={lang}
            children={String(children).replace(/\n$/, '')}
        />
    );
};

export default CodeBlock