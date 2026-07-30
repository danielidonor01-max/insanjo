import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResetPassword from './pages/ResetPassword'
import PublicStore from './pages/PublicStore'
import ViewProduct from './pages/ViewProduct'
import Analytics from './components/Analytics'

const App = () => {
  return (
    < >
    <Analytics/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reset-password" element={<Ressword />} />
      <Route path="/store/:storeId" element={<PublicStore />} />
      <Route path="/product/:productId" element={<ViewProduct />} />
      <Route path="*" element={<Home />} />
    </Routes>
    </>
  )
}

export default App
