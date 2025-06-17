// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx'; // <-- IMPORT
import { CartProvider } from './contexts/CartContext.jsx';
import { OrderProvider } from './contexts/OrderContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>  {/* <-- WRAP HERE */}
        <CartProvider>
          <OrderProvider>
        <App />
        </OrderProvider>
        </CartProvider>
      </AuthProvider> {/* <-- AND HERE */}
    </BrowserRouter>
  </React.StrictMode>,
);