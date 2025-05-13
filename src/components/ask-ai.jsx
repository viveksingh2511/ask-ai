import React, { useState, useEffect } from 'react'
import { URL } from '../constants'
import Ans from './Ans';

export default function Askai() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState([])

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    setRecentHistory(history);
  }, []);

  const payload = {
    "contents": [{
      "parts": [{ "text": question }]
    }]
  }
  const askQuestion = async () => {

    let history = JSON.parse(localStorage.getItem('history') || '[]');
    history = [question, ...history];
    localStorage.setItem('history', JSON.stringify(history));
    setRecentHistory(history);

    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    response = await response.json();
    let dataStr = response.candidates[0].content.parts[0].text;
    dataStr = dataStr.split("* ");
    dataStr = dataStr.map((i)=>i.trim());    
    setResult([...result,{type:'q',text:question},{type:'a',text:dataStr}]);
    

  }

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      <div id='drawer-example' className='col-span-1 bg-zinc-800 text-white text-left p-2'>
        <ul>
          {
            recentHistory && recentHistory.map((item)=>(
              <li>{item}</li>
            ))
          }
        </ul>
      </div>
      <div className='col-span-4 p-10'>
        <div className='container h-110 overflow-auto scrollbar-dark'>
          <div className='text-white'>
            {/* {result} */}
            <ul className='p-3'>
              {
                result.map((item,index)=>(
                  <div key={index+Math.random()} className={item.type == 'q'?'flex justify-end':''}>
                    {
                      item.type == 'q'?
                      <li key={index+Math.random()} className='text-right pr-5 border-5 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl w-fit p-1'>
                        <Ans answer={item.text} totalResult={1} index={index} /></li>
                      :item.text.map((ansItem, ansIndex)=>(
                        <li key={ansIndex+Math.random()} className='text-left p-1'><Ans answer={ansItem} totalResult={item.text.length} index={ansIndex} /></li>
                      ))
                    }
                  </div>
                ))
              }
            </ul>
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
