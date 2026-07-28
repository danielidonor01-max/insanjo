import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResetPassword from './pages/ResetPassword'
import PublicStore from './pages/PublicStore'
import Analytics from './components/Analytics'

const App = () => {
  return (
    < >
    <Analytics/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/store" element={<PublicStore />} />
      <Route path="*" element={<Home />} />
    </Routes>
    </>
  )
}

export default App
