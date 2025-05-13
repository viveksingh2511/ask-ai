import React, { useEffect, useState } from 'react'
import { Heading, removeHeadingStars } from '../help'

export default function Ans({answer,totalResult, index}) {
    const [heading, setHeading] = useState(false)
    const [ans, setAns] = useState(answer)
    // console.log(answer,key);
    useEffect(()=>{
        if(Heading(answer)){
            setHeading(true)
            setAns(removeHeadingStars(answer))
        }
        
    },[])
    
  return (
    <>
    {
        index == 0 && totalResult > 1?<span className='pt-2 block text-xl font-bold'>{ans}</span>:
        heading?<span className='pt-2 block text-lg font-bold'>{ans}</span>
        :<span className='text-sm pl-5 block'>{ans}</span>
    }

    </>
  )
}
