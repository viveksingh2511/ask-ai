import React, { useState } from 'react'
import { URL } from './constants'
import { FiMenu } from "react-icons/fi";

export default function App() {
const [question, setQuestion] = useState('');
const [result, setResult] = useState(undefined)

const payload ={
  "contents": [{
    "parts":[{"text": question}]
    }]
}
const askQuestion = async() => {
  let response = await fetch(URL,{
    method:"POST",
    body:JSON.stringify(payload)
  });
  response = await response.json();
  setResult(response.candidates[0].content.parts[0].text);
  
}

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      <div id='drawer-example' className='col-span-1 bg-zinc-800 text-left p-2'>
        <button className='text-white text-2xl' type="button" data-drawer-target="drawer-example" data-drawer-show="drawer-example" aria-controls="drawer-example">
          <FiMenu />
        </button>
      </div>
      <div className='col-span-4 p-10'>
        <div className='container h-110 overflow-auto'>
          <div className='text-white'>
            {result}
          </div>
        </div>
        <div className='bg-zinc-800 w-1/2 p-1 pr-5 text-white m-auto rounded-4xl border border-zinc-700 flex h16'>
          <input type='text' value={question} onChange={(event)=>setQuestion(event.target.value)} className='w-full h-full p-3 outline-none' placeholder='As me anything' />
          <button onClick={askQuestion}>Ask</button>
        </div>
      </div>
    </div>
  )
}
