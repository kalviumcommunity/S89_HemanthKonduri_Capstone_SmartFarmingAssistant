import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context & Protected Route
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { StoreProvider } from './contexts/StoreContext'; // <-- 1. IMPORT THE NEW PROVIDER

// Your Existing Page Imports
import Landingpage from './pages/Landingpage';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Homepage from './pages/Homepage';
import GoogleCallback from './pages/GoogleCallback';
import ForgotPassword from './pages/forgotPassword';
import ChatWindow from './pages/ChatWindow';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import MarketPricesPage from './pages/MarketPricesPage';
import CropDetailPage from './pages/CropDetailPage';
import './store.css';

// NEW & UPDATED Store Page Imports
import StoreHomePage from './pages/StoreHomePage'; // Renamed for clarity from SapraStorePage
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AddressPage from './pages/AddressPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmOrderPage from './pages/ConfirmOrderPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage'; // Renamed from OrderTrackingPage

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path='/' element={!user ? <Landingpage /> : <Navigate to="/homepage" />} />
      <Route path='/signin' element={!user ? <Signin /> : <Navigate to="/homepage" />} />
      <Route path='/signup' element={!user ? <Signup /> : <Navigate to="/homepage" />} />
      <Route path='/forgotPassword' element={!user ? <ForgotPassword /> : <Navigate to="/homepage" />} />
      <Route path='/google-callback' element={<GoogleCallback />} />

      {/* --- Protected Routes --- */}
      {/* Wrap all protected routes with a single element to apply context and protection */}
      <Route 
        path="/*"
        element={
          <ProtectedRoute>
            {/* 2. WRAP WITH STORE PROVIDER */}
            <StoreProvider> 
              <Routes>
                {/* Your Existing Protected Routes */}
                <Route path='/homepage' element={<Homepage />} />
                <Route path='/chatwindows' element={<ChatWindow />} />
                <Route path='/diseasedetection' element={<DiseaseDetectionPage />} />
                <Route path='/market-prices' element={<MarketPricesPage />} />
                <Route path='/market-prices/:cropId' element={<CropDetailPage />} />
                
                {/* 3. DEFINE ALL STORE ROUTES */}
                <Route path='/store' element={<StoreHomePage />} />
                <Route path='/product/:id' element={<ProductDetailPage />} />
                <Route path='/cart' element={<CartPage />} />
                <Route path='/my-orders' element={<MyOrdersPage />} />
                <Route path='/order/:id' element={<OrderDetailPage />} />

                {/* Checkout Flow */}
                <Route path='/checkout/address' element={<AddressPage />} />
                <Route path='/checkout/payment' element={<PaymentPage />} />
                <Route path='/checkout/confirm' element={<ConfirmOrderPage />} />
                <Route path='/order-success' element={<OrderSuccessPage />} />
                
                {/* Fallback for any other protected route, redirects to homepage */}
                <Route path="*" element={<Navigate to="/homepage" />} />
              </Routes>
            </StoreProvider>
          </ProtectedRoute>
        }
      />

      {/* A final fallback for any non-matched routes */}
      <Route path="*" element={<Navigate to={user ? "/homepage" : "/"} />} />
    </Routes>
  );
}

export default App;