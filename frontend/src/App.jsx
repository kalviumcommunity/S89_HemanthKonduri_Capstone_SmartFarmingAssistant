import { Routes, Route } from 'react-router-dom';

import Landingpage from './pages/Landingpage'
import Signup from './pages/signup'
import Signin from './pages/signin'
import Homepage from './pages/Homepage';
import MarketPrices from './pages/MarketPrices';
import AIChat from './pages/AIChat';
import ProductsPage from './pages/ProductsPage';

function App() {


  return (
   
      <Routes>
        <Route path='/' element={<Landingpage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element= {<Signin/>}/>
        <Route path='/homepage' element={<Homepage/>}/>
        <Route path='/marketprices' element={<MarketPrices/>}/>
        <Route path='/aichat' element={<AIChat/>}/>
        <Route path='/products' element={<ProductsPage/>}/>
        <Route path='/homepage' element={<Homepage/>}/>
      
      </Routes>
   
  )
}

export default App
