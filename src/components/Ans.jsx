import React, { useEffect, useState } from 'react'

export default function Ans({answer,key}) {
    const [heading, setHeading] = useState(false)
    // console.log(answer,key);
    useEffect(()=>{
        if(Heading(answer)){
            setHeading(true)
        }
        
    },[])
    function Heading(string){
        return /^(\*)(\*)(.*)\*$/.test(string) //regex
    }
    
  return (
    <>
        {heading?<span className='pt-2 block text-lg font-bold'>{answer}</span>:<span>{answer}</span>}
    </>
  )
}
