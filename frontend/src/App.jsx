import { Routes, Route } from 'react-router-dom';

import Landingpage from './pages/Landingpage'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Homepage from './pages/Homepage';
import GoogleCallback from './pages/GoogleCallback';
import ForgotPassword from './pages/forgotPassword';




function App() {


  return (
   
      <Routes>
        <Route path='/' element={<Landingpage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element= {<Signin/>}/>
        <Route path='/homepage' element={<Homepage/>}/>
        <Route path='/google-callback' element={<GoogleCallback/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
      
        
      
      </Routes>
   
  )
}

export default App
