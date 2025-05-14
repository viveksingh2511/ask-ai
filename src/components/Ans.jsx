import React, { useEffect, useState } from 'react'
import { Heading, removeHeadingStars } from '../help'

export default function Ans({ answer, totalResult, index }) {
    // State to track if the current answer is a heading
    const [heading, setHeading] = useState(false)

    // State to hold the modified or original answer
    const [ans, setAns] = useState(answer)

    // Run once when the component mounts
    useEffect(() => {
        // Check if the answer is a heading
        if (Heading(answer)) {
            setHeading(true) // Mark as heading
            setAns(removeHeadingStars(answer)) // Remove heading markers (like "**demo......*")
        }

    }, [])

    return (
        <>
            {
                // If it's the first result and there are multiple results, show larger bold text
                index == 0 && totalResult > 1
                    ? <span className='pt-2 block text-xl font-bold'>{ans}</span> :
                    // If it's a heading (but not first), show medium bold text
                    heading ? <span className='pt-2 block text-lg font-bold'>{ans}</span>
                    // Otherwise, show as regular small text with indentation
                        : <span className='text-sm pl-5 block'>{ans}</span>
            }

        </>
    )
}
