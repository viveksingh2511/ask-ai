import React, { useState } from 'react'
import { URL } from '../constants'
import Ans from './Ans';

export default function Askai() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(undefined)

  const payload = {
    "contents": [{
      "parts": [{ "text": question }]
    }]
  }
  const askQuestion = async () => {
    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    response = await response.json();
    let dataStr = response.candidates[0].content.parts[0].text;
    dataStr = dataStr.split("* ");
    dataStr = dataStr.map((i)=>i.trim());    
    setResult(dataStr);
    

  }

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      <div id='drawer-example' className='col-span-1 bg-zinc-800 text-left p-2'>
        
      </div>
      <div className='col-span-4 p-10'>
        <div className='container h-110 overflow-auto'>
          <div className='text-white'>
            {/* {result} */}
            {
                result && result.map((item,index)=>{
                  return (
                  <li className='list-none text-left p-1'><Ans answer={item} key={index} /></li>
                )            
                })
            }
          </div>
        </div>
        <div className='bg-zinc-800 w-1/2 p-1 pr-5 text-white m-auto rounded-4xl border border-zinc-700 flex h16'>
          <input type='text' value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter') askQuestion();
          }} className='w-full h-full p-3 outline-none' placeholder='As me anything' />
          <button onClick={askQuestion}>Ask</button>
        </div>
      </div>
    </div>
  )
}
