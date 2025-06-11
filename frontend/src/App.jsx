import { Routes, Route, Router } from 'react-router-dom';
import './App.css';

import Landingpage from './pages/Landingpage'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Homepage from './pages/Homepage';
import GoogleCallback from './pages/GoogleCallback';
import ForgotPassword from './pages/forgotPassword';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import SapraWalletPage from './pages/SapraWalletPage';
import SapraStorePage from './pages/SapraStorePage';

import ChatWindow from './pages/ChatWindow.jsx';
import MarketPricesPage from './pages/MarketPricesPage.jsx';
import ScanDisease from './pages/ScanDisease.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

function App() {

  return (
  
     <AuthProvider>
   <CartProvider>
    
      <Routes>
        <Route path='/' element={<Landingpage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element= {<Signin/>}/>
        <Route path='/homepage' element={<Homepage/>}/>
        <Route path='/google-callback' element={<GoogleCallback/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        <Route path='/chatwindows' element={<ChatWindow/>}/>
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/wallet" element={<SapraWalletPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path='/saprastore' element={<SapraStorePage/>}/>
        <Route path='/marketprices' element={<MarketPricesPage/>}/>
        <Route path='/diseasedetection' element={<ScanDisease/>}/>
      </Routes>
      </CartProvider>
      </AuthProvider>
  )
}

export default App
