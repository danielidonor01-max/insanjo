import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Analytics from './components/Analytics'

const App = () => {
  return (
    < >
    <Analytics/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Home />} />
    </Routes>
    </>
  )
}

export default App