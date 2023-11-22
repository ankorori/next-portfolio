import React from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const codeBlock = ({ language, value }) => {
    console.log(language,value)
    return (
        <SyntaxHighlighter language={language} style={dark}>
            {value}
        </SyntaxHighlighter>
    )
}
export default codeBlock
