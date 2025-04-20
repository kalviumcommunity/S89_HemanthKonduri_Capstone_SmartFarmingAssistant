import { Routes, Route } from 'react-router-dom';

import Landingpage from './components/Landingpage'
import Signup from './components/signup'

function App() {


  return (
   
      <Routes>
        <Route path='/' element={<Landingpage/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
   
  )
}

export default App