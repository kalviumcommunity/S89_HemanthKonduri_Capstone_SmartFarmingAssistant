import { Routes, Route } from 'react-router-dom';

import Landingpage from './pages/Landingpage'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Homepage from './pages/Homepage';


function App() {


  return (
   
      <Routes>
        <Route path='/' element={<Landingpage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/signin' element= {<Signin/>}/>
        <Route path='/homepage' element={<Homepage/>}/>
      
      </Routes>
   
  )
}

export default App
