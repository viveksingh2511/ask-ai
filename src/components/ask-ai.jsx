import React, { useState, useEffect } from 'react';
import { URL } from '../constants'; // API endpoint
import Ans from './Ans'; // Answer rendering component

export default function Askai() {
  // State declarations
  const [question, setQuestion] = useState(''); // Current typed question
  const [result, setResult] = useState([]); // Array of Q&A pairs to display
  const [recentHistory, setRecentHistory] = useState([]); // Recent questions stored in localStorage
  const [selectedHistory, setSelectedHistory] = useState(''); // Currently selected history question
  const [loading, setLoading] = useState(false); // Loading indicator

  // Load history from localStorage when component mounts
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    setRecentHistory(history);
  }, []);

  // If a history item is selected, trigger a question fetch
  useEffect(() => {
    if (selectedHistory) {
      askQuestion(true); // Flag indicates this is from history
    }
  }, [selectedHistory]);

  // Clear all localStorage history
  const clearHistor = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  /**
   * Main function to fetch an answer
   * @param {boolean} fromHistory - Is the request coming from a history click?
   */
  const askQuestion = async (fromHistory = false) => {
    const finalQuestion = fromHistory ? selectedHistory : question.trim();

    // Exit if no question provided
    if (!finalQuestion) return;

    // Save only new typed questions to history
    if (!fromHistory) {
      let history = JSON.parse(localStorage.getItem('history') || '[]');
      history = [finalQuestion, ...history.filter(q => q !== finalQuestion)].slice(0, 10);
      localStorage.setItem('history', JSON.stringify(history));
      setRecentHistory(history);
    }

    // Format payload for the API
    const payload = {
      contents: [{
        parts: [{ text: finalQuestion }]
      }]
    };

    try {
      setLoading(true); // Show loading state

      // API call
      let response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      response = await response.json();

      // Extract and clean answer
      let dataStr = response.candidates[0].content.parts[0].text;
      let answerParts = dataStr.split("* ").map(i => i.trim());

      // Append new Q&A to chat result
      setResult(prev => [
        ...prev,
        { type: 'q', text: finalQuestion },
        { type: 'a', text: answerParts }
      ]);

      // Reset input or selected history
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
    <div className='flex flex-col lg:flex-row h-screen text-center'>

      {/* Sidebar for Recent Search History */}
      <div className='w-full lg:w-1/5 bg-zinc-800 text-white text-center p-2'>
        <h1 className='pt-3 text-xl flex justify-center items-center'>
          <span>Recent Search</span>
          <button
            onClick={clearHistor}
            className='ml-2'
            aria-label='Clear History'
            title='Clear History'
          >
            {/* Trash Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff">
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/>
            </svg>
          </button>
        </h1>
        <ul className='text-left overflow-auto text-sm max-h-64 lg:max-h-full'>
          {recentHistory.map((item, index) => (
            <li
              key={`history-${index}`}
              onClick={() => setSelectedHistory(item)}
              className='p-1 pl-5 truncate text-zinc-400 cursor-pointer hover:bg-zinc-700 hover:text-zinc-200'
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Content Area */}
      <div className='w-full lg:w-4/5 p-4 flex flex-col'>

        {/* Show Loading Indicator */}
        {loading && <p className="text-white mb-2">Loading...</p>}

        {/* Q&A Conversation Display */}
        <div className='flex-1 overflow-auto text-white mb-4 scrollbar-dark'>
          <ul className='space-y-2'>
            {result.map((item, index) => (
              <div key={`entry-${index}`} className={item.type === 'q' ? 'flex justify-end p-2' : ''}>
                {
                  item.type === 'q' ? (
                    // Question Bubble
                    <li className='text-right pr-5 p-2 bg-zinc-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl w-fit p-2 max-w-full md:max-w-[60%]'>
                      <Ans answer={item.text} totalResult={1} index={index} />
                    </li>
                  ) : (
                    // Answer Bubble(s)
                    item.text.map((ansItem, ansIndex) => (
                      <li key={`ans-${index}-${ansIndex}`} className='text-left p-2 max-w-full md:max-w-[75%]'>
                        <Ans answer={ansItem} totalResult={item.text.length} index={ansIndex} />
                      </li>
                    ))
                  )
                }
              </div>
            ))}
          </ul>
        </div>

        {/* Question Input Area */}
        <div className='bg-zinc-800 mb-8 border border-zinc-700 p-2 rounded-full flex w-full max-w-full md:max-w-2xl mx-auto'>
          <input
            type='text'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') askQuestion(); // Submit on Enter
            }}
            className='flex-grow bg-transparent text-white p-2 outline-none'
            placeholder='Ask me anything'
          />
          <button
            onClick={() => askQuestion()}
            className='text-white px-4 hover:bg-zinc-700 rounded-xl'
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
