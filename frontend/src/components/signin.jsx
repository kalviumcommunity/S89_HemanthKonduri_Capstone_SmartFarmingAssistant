import React from 'react'

const signin = () => {
  return (
    <div className='signin-container'> 
        <div className='signin-grid'>
            <h2>Sign In</h2>
            <form action="">
                <label htmlFor="">User name/ Email</label>
                <input className='signin-input' type="email/username" placeholder='Enter user name or email' />
                <label htmlFor="">Password</label>
                <input className='signin-input' type="password" placeholder='Enter your password' />
                <button>Sign In</button>
                <div>
                    <p>Don't have an account <a href="">Sign up</a></p>
                </div>
            </form>
        </div>
        <div className="signup-right">
        <div className="image-grid">
          <img src="/images/plant-hand.jpg" alt="Plant in Hand" />
          <img src="/images/tractor.jpg" alt="Tractor" />
          <img src="/images/seeding.jpg" alt="Seeding" />
          <img src="/images/vegetables.jpg" alt="Vegetables" />
          <img src="/images/farm.jpg" alt="Farm" className="wide" />
          <img src="/images/soil-hand.jpg" alt="Soil in Hand" />
          <img src="/images/green-plant.jpg" alt="Green Plant" />
          <img src="/images/wheat.jpg" alt="Wheat" />
        </div>
      </div>
    </div>
  )
}

export default signin





