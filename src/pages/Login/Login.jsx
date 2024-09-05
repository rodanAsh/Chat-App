import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
const Login = () => {
  const [currentState,setCurrentState] = useState("Sign Up")

  return (  
    <div className='login'>
      <img src={assets.logo_big} alt="" className="logo" />
      <form className='login-form'>
        <h2>{currentState}</h2>
        {currentState === "Sign Up" ? <input type="text" placeholder='username' className="form-input" required /> : null}
        <input type="email" placeholder='email address' className="form-input" required/>
        <input type="password" placeholder='password' className="form-input" required/>
        <button type='submit'>{currentState === "Sign Up" ? "Sign Up" : "Login Now"}</button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className='login-forgot'>
          {
            currentState === "Sign Up" 
            ? <p className='login-toggle'>Already have an account <span onClick={() => setCurrentState("Login")}>login here</span></p>
            : <p className='login-toggle'>To create an account <span onClick={() => setCurrentState("Sign Up")}>click here</span></p>
          }
        </div>
      </form>
    </div>
  )
}

export default Login