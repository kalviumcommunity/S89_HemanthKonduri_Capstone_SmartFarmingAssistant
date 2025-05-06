import React from 'react'
import './Homepage.css';
import NavBar from '../components/NavBar';
import BottomBar from '../components/BottomBar';


const Homepage = () => {
  return (


    
    <div className='homepage-container'>
        <div className='overlay'>
       <div className='navbar'>
       <NavBar/>
       </div>
       
    <div className='middle-content'>
        <h1>Grow Smarter, Farm Better</h1>
        <p className="sub-text">
        Empowering farmers with smart solutions — from soil to success.
        </p>
        
    </div>
    <div className='feature-container'>
  <div className='disease-detection'>
    <img src="" alt="" />
    <span>Disease detection</span>
    <p></p>
  </div>
  <div className='market-prices'>
    <img src="" alt="" />
    <span>Real-Time Market Prices</span>
    <p></p>
  </div>
  <div className='AI-chat'>
    <img src="" alt="" />
    <span>AI-Chat</span>
    <p></p>
  </div>
  <div className='buy-products'>
    <img src="" alt="" />
    <span>Buy Products</span>
    <p></p>
  </div>

  {/* Add more features below */}
  <div className='weather-updates'>
    <img src="" alt="" />
    <span>Weather Updates</span>
    <p></p>
  </div>
  <div className='farming-tips'>
    <img src="" alt="" />
    <span>Farming Tips</span>
    <p></p>
  </div>
  <div className='govt-schemes'>
    <img src="" alt="" />
    <span>Govt. Schemes</span>
    <p></p>
  </div>
  <div className='expert-support'>
    <img src="" alt="" />
    <span>Expert Support</span>
    <p></p>
  </div>
</div>
        </div>
        <div className='bottom-content'>
       <BottomBar/>
       </div>
    </div>
  )
}

export default Homepage