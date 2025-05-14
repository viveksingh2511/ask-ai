import React, { useState, useEffect } from 'react';
import { URL } from '../constants';
import Ans from './Ans';

export default function Askai() {
  const [question, setQuestion] = useState(''); // Current typed question
  const [result, setResult] = useState([]); // Q&A pairs to render
  const [recentHistory, setRecentHistory] = useState([]); // Recent questions from localStorage
  const [selectedHistory, setSelectedHistory] = useState(''); // Selected history question
  const [loading, setLoading] = useState(false); // Loading state

  // Load history on component mount
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    setRecentHistory(history);
  }, []);

  // Trigger askQuestion when a history item is selected
  useEffect(() => {
    if (selectedHistory) {
      askQuestion(true); // Pass flag that this is from history
    }
  }, [selectedHistory]);

  // Clear localStorage and history state
  const clearHistor = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  /**
   * Ask the question (from input or history)
   * @param {boolean} fromHistory - whether this call is triggered from a history click
   */
  const askQuestion = async (fromHistory = false) => {
    const finalQuestion = fromHistory ? selectedHistory : question.trim();

    // Don't proceed if question is empty
    if (!finalQuestion) return;

    // Only store new typed questions in history
    if (!fromHistory) {
      let history = JSON.parse(localStorage.getItem('history') || '[]');
      history = [finalQuestion, ...history.filter(q => q !== finalQuestion)].slice(0, 10); // limit to 10 unique
      localStorage.setItem('history', JSON.stringify(history));
      setRecentHistory(history);
    }

    const payload = {
      contents: [{
        parts: [{ text: finalQuestion }]
      }]
    };

    try {
      setLoading(true);

      // Fetch response
      let response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      response = await response.json();

      // Extract and clean response text
      let dataStr = response.candidates[0].content.parts[0].text;
      let answerParts = dataStr.split("* ").map(i => i.trim());

      // Append new Q&A to result
      setResult(prev => [
        ...prev,
        { type: 'q', text: finalQuestion },
        { type: 'a', text: answerParts }
      ]);

      // Clear input and selectedHistory
      if (!fromHistory) setQuestion('');
      setSelectedHistory('');

    } catch (error) {
      console.error('Error fetching response:', error);
      alert('Failed to fetch answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid grid-cols-5 h-screen text-center'>

      {/* Sidebar with recent search history */}
      <div id='drawer-example' className='col-span-1 bg-zinc-800 text-white text-center p-2'>
        <h1 className='pt-3 text-xl flex text-center justify-center'>
          <span>Recent Search</span>
          <button onClick={clearHistor} type='button' className='cursor-pointer ml-2' aria-label="Clear History" title="Clear History">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff">
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/>
            </svg>
          </button>
        </h1>
        <ul className='text-left overflow-auto text-sm'>
          {
            recentHistory.map((item, index) => (
              <li
                key={`history-${index}`}
                onClick={() => setSelectedHistory(item)}
                className='p-1 pl-5 truncate text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-zinc-200'
              >
                {item}
              </li>
            ))
          }
        </ul>
      </div>

      {/* Main content area */}
      <div className='col-span-4 p-10'>

        {/* Display loading if fetching answer */}
        {loading && <p className="text-white">Loading...</p>}

        {/* Display chat history */}
        <div className='container h-110 overflow-auto scrollbar-dark'>
          <div className='text-white'>
            <ul className='p-3'>
              {
                result.map((item, index) => (
                  <div key={`entry-${index}`} className={item.type === 'q' ? 'flex justify-end' : ''}>
                    {
                      item.type === 'q' ? (
                        <li className='text-right pr-5 border-5 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl w-fit p-1'>
                          <Ans answer={item.text} totalResult={1} index={index} />
                        </li>
                      ) : (
                        item.text.map((ansItem, ansIndex) => (
                          <li key={`ans-${index}-${ansIndex}`} className='text-left p-1'>
                            <Ans answer={ansItem} totalResult={item.text.length} index={ansIndex} />
                          </li>
                        ))
                      )
                    }
                  </div>
                ))
              }
            </ul>
          </div>
        </div>

        {/* Input box */}
        <div className='bg-zinc-800 w-1/2 p-1 pr-5 text-white m-auto rounded-4xl border border-zinc-700 flex h16'>
          <input
            type='text'
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') askQuestion();
            }}
            className='w-full h-full p-3 outline-none'
            placeholder='Ask me anything'
          />
          <button onClick={() => askQuestion()} className='px-4 hover:bg-zinc-700 rounded-xl'>Ask</button>
        </div>
      </div>
    </div>
  );
}
