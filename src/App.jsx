import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Askai from './components/ask-ai'
import AIInfoPage from './components/AIInfoPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AIInfoPage />} />
        <Route path="/ask" element={<Askai />} />
      </Routes>
    </BrowserRouter>
  )
}