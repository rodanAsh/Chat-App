import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup } from '../../config/firebase'
const Login = () => {
  const [currentState,setCurrentState] = useState("Sign Up")
  const [userName,setUserName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const onSubmitHandler = (e) => {
    e.preventDefault()

    if(currentState === "Sign Up"){
      signup(userName,email,password)
    }

    // setUserName('')
    // setEmail('')
    // setPassword('')
  }

  return (  
    <div className='login'>
      <img src={assets.logo_big} alt="" className="logo" />
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{currentState}</h2>
        {currentState === "Sign Up" ? <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='username' className="form-input" required /> : null}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email address' className="form-input" required/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' className="form-input" required/>
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