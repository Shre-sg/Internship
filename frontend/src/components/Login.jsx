import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import 'bootswatch/dist/lux/bootstrap.min.css';
import tcLogo from '../assets/Threads And Co.png';
import AuthApi from '../utils/AuthApi';
import { Link, useNavigate } from 'react-router-dom';
import CONFIG from '../config'; // Import configuration file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const authApi = useContext(AuthApi);
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post(`${CONFIG.BACKEND_URL}/login`, {
  //       email,
  //       password,
  //     });
  //     console.log(response.data.msg);
  //     authApi.setAuth(true);
  //     navigate("/view"); // Navigate to the specified route
  //   } catch (error) {
  //     // Handle the error gracefully
  //     console.log(error);
  //   }
  // };


  //The login button is clicked when the Enter key is pressed
  useEffect(()=>{
    const handleKeyPress = (event) => {
      if(event.key == 'Enter'){
        document.getElementById("loginButton").click();
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return(()=>{
      window.removeEventListener("keydown", handleKeyPress); //After successful login the EventListener is removed
    })
  },[])

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${CONFIG.BACKEND_URL}/login`, {
        email,
        password,
      });
      console.log(response.data.msg);
      authApi.setAuth(true);
      navigate("/view"); // Navigate to the specified route
    } catch (error) {
      // Update the error state with an appropriate message
      if (error.response && error.response.data && error.response.data.msg) {
        setError(error.response.data.msg); // Use error message from backend response
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
      console.log(error);
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      {/* Left Logo */}
      <img
        src={tcLogo}
        alt="TC Logo"
        style={{ position: 'absolute', top: '15px', left: '10px', width: '120px' }}
      />

      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            id="loginButton"
            onClick={handleLogin}
          >
            Login
          </button>
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
          <div style={{marginTop: '10px'}}>Don't have an account: <Link to={'/register'}>Register</Link></div>
        </form>
      </div>
    </div>
  );
};

export default Login;
