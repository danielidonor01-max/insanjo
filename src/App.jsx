import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

import CustomerResetPassword from './pages/CustomerResetPassword'
import VendorResetPassword from './pages/VendorResetPassword'
import AccountDeletion from './pages/AccountDeletion'
import TermsAndPrivacy from './pages/TermsAndPrivacy'
import PublicStore from './pages/PublicStore'
import ViewProduct from './pages/ViewProduct'
import Analytics from './components/Analytics'
import HashScrollHandler from './components/HashScrollHandler'
import CustomerSetPassword from './pages/CustomerSetPassword'
import VendorSetPassword from './pages/VendorSetPassword'
import Newtest from './pages/newtest'

const App = () => {
  return (
    < >
      <Analytics />
      <HashScrollHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Newtest />} />


        <Route path="/customers/reset-password" element={<CustomerResetPassword />} />
        <Route path="/vendors/reset-password" element={<VendorResetPassword />} />

        <Route path="/customers/set-password" element={<CustomerSetPassword />} />
        <Route path="/vendors/set-password" element={<VendorSetPassword />} />

        <Route path="/legal/account-deletion" element={<AccountDeletion />} />
        <Route path="/legal/terms-and-privacy" element={<TermsAndPrivacy />} />
        <Route path="/store/:storeId" element={<PublicStore />} />
        <Route path="/product/:productId" element={<ViewProduct />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
