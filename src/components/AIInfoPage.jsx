import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AIInfoPage() {
  const navigate = useNavigate();

  return (
    <div className="text-white p-10">
      <h1 className="text-2xl mb-4">Welcome to AI Info</h1>
      <button
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => navigate('/ask')}
      >
        Ask AI
      </button>
    </div>
  );
}
