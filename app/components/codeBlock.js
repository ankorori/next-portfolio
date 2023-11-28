import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeBlock = ({ inline, className, children }) => {
    if (!className) {
        return <code className={className}>{children}</code>;
    }
    const match = /language-(\w+)/.exec(className || '');
    const lang = match && match[1] ? match[1] : '';
    const [lang1, lang2] = lang.split('__');

    const { added, removed } = (() => {
    const added = [];
    const removed = [];
    let lineNumber = 0;
    const lines = String(children).split('\n');
    for (let i = 0; i < lines.length; i++) {
        lineNumber++;
        if (/^\+\s.*$/.test(lines[i])) {
            added.push(lineNumber);
        }
        if (/^\-\s.*$/.test(lines[i])) {
            removed.push(lineNumber);
        }
    }
    return { added, removed };
    })();

    const lineProps = (lineNumber) => {
    let style = {};
    if (lang2 === 'diff') {
        if (added.includes(lineNumber)) {
            style.display = 'block';
            style.backgroundColor = 'rgba(0, 0, 255, 0.4)';
        }
        if (removed.includes(lineNumber)) {
            style.display = 'block';
            style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
        }
    }
    return { style };
    };

    return (
        <SyntaxHighlighter
            style={darcula}
            language={lang1}
            children={String(children).replace(/\n$/, '')}
            wrapLines={true}
            showLineNumbers={true}
            lineProps={lineProps}
        />
    );
};

export default CodeBlock