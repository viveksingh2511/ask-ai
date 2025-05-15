import React, { useEffect, useState } from 'react'
import { Heading, removeHeadingStars } from '../help'

export default function Ans({ answer, totalResult, index }) {
    const [heading, setHeading] = useState(false)
    const [ans, setAns] = useState(answer)
    const [isCode, setIsCode] = useState(false)

    useEffect(() => {
        // Check if it's a heading
        if (Heading(answer)) {
            setHeading(true)
            setAns(removeHeadingStars(answer))
        }

        // Check for code block using markdown-style backticks or multiline logic
        const trimmed = answer.trim()
        if (
            trimmed.startsWith('```') ||
            trimmed.includes('\n') ||
            /^[ \t]*[a-zA-Z0-9_]+\s*\(.*\)\s*\{/.test(trimmed) // basic function pattern
        ) {
            setIsCode(true)
        }

    }, [answer])

    // Code block rendering
    if (isCode) {
        return (
            <pre className="bg-zinc-900 text-green-400 p-2 rounded-md overflow-auto text-sm my-2">
                <code>{ans.replace(/^```[\w]*\n?|```$/g, '')}</code>
            </pre>
        )
    }

    // Headings and normal text
    return (
        <>
            {
                index === 0 && totalResult > 1
                    ? <span className='pt-2 block text-xl font-bold'>{ans}</span>
                    : heading
                        ? <span className='pt-2 block text-lg font-bold'>{ans}</span>
                        : <span className='text-sm pl-5 block'>{ans}</span>
            }
        </>
    )
}
