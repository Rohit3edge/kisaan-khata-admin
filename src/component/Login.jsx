import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../img/logos/kisaankhatalogo.png';
import { login } from '../store/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { VscEye } from 'react-icons/vsc';

const Login = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertPass, setAlertPass] = useState('');
  const [invalid, setInvalid] = useState('');

  const navigate = useNavigate('');
  const { loading, error, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const validateEmail = (email) => {
    const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.test(email)) {
      setAlertEmail('Please enter a valid email');
      return false;
    } else {
      setAlertEmail('');
      return true;
    }
  };

  const validatePassword = (password) => {
    const regPass = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,8}$/;
    // if (!regPass.test(password)) {
    //   setAlertPass("Password must be 6-8 characters long and include both letters and numbers");
    //   return false;
    // } else {
    //   setAlertPass("");
    //   return true;
    // }
    return true;
  };

  const validateInputs = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    return isEmailValid && isPasswordValid;
  };

  async function signIn(e) {
    e.preventDefault();
    if (validateInputs()) {
      dispatch(login({ email, password }))
        .unwrap()
        .then((data) => {
          console.log(data?.user?.data);
          const loginTime = new Date();
          loginTime.setMinutes(loginTime.getMinutes() + 40); // Add 10 minutes to the login time
          Cookies.set('user', JSON.stringify(data?.user?.data), { expires: loginTime });
          setAlertEmail('');
          setPassword('');
          const usertype = data?.user?.data.user_type;
            navigate('/');
        })
        .catch(({ message }) => {
          setInvalid(message);
        });
    }
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <img src={logo} alt="Kisaan Khata" className="mb-4" style={{ width: '150px' }} />

      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Admin Login</h2>
        <span className="text-danger">{invalid}</span>

        <form onSubmit={signIn}>
          <div className="form-group mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Add email validation logic here
              }}
              className="form-control"
              placeholder="User Email/Phone"
            />
            <p className="text-danger">{alertEmail}</p>
          </div>

          <div className="form-group mb-3 position-relative">
            <input
              type={passwordShown ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Add password validation logic here
              }}
              className="form-control"
              placeholder="Password"
            />
            <VscEye
              className="position-absolute"
              style={{ right: '10px', top: '50%', cursor: 'pointer', transform: 'translateY(-50%)' }}
              onClick={togglePassword}
            />
            <p className="text-danger">{alertPass}</p>
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-warning w-100">Login</button>
          </div>
        </form>

        <div className="text-center mt-3">
          <Link to="/ForgotPassword" className="text-decoration-none">
            Forgot Password?
          </Link>
        </div>
{/* 
        <hr />

        <p className="text-center">
          Don't have an account? <Link to="/register"><b>Register Now</b></Link>
        </p> */}
      </div>

      <footer className="text-center mt-4">
        © 2024 - Kisaan Khata
      </footer>
    </div>
  );
};

export default Login;
