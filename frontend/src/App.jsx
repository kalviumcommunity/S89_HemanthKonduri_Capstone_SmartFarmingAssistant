import { Routes, Route, Router } from 'react-router-dom';
import './App.css';

import Landingpage from './pages/Landingpage'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Homepage from './pages/Homepage';
import GoogleCallback from './pages/GoogleCallback';
import ForgotPassword from './pages/forgotPassword';


import ChatWindow from './pages/ChatWindow.jsx';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage.jsx';


function App() {

  return (
  
   
    
      <Routes>
        <Route path='/' element={<Landingpage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element= {<Signin/>}/>
        <Route path='/homepage' element={<Homepage/>}/>
        <Route path='/google-callback' element={<GoogleCallback/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        <Route path='/chatwindows' element={<ChatWindow/>}/>
        <Route path='/diseasedetection' element={<DiseaseDetectionPage/>}/>
      </Routes>
    
  )
}

export default App
