import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Full name is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    if (!password) {
      setError('Password cannot be empty');
      return;
    }

    // Signup API call
    try {
      const response = await axiosInstance.post('/create-account', {
        fullName:name,
       email: email,
        password:password,
      });

      // Handle success response
      if (response.data && response.data.accessToken) {
        localStorage.setItem('Token', response.data.accessToken);
        navigate('/dashboard');
      }
    } catch (err) {
      // Handle signup error
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong, Please try again later');
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-100 overflow-hidden relative">
      <div className="login-ui-box right-10 top-40" />
      <div className="login-ui-box bg-cyan-200 bottom-60 right-1/2" />

      <div className="container h-screen flex justify-center items-center px-20 mx-auto">
        {/* ✅ Fixed Image Background */}
        <div 
  className="w-2/4 h-[90vh] flex items-end bg-cover bg-center rounded-lg p-10 z-50 
  hidden md:hidden lg:flex"
  style={{ backgroundImage: `url('/src/assets/images/signup-img.jpg')` }}>
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Join the <br /> Adventure
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Create an account to start documenting your travel stories and share them with the world.
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20"style={{ width: "auto", height: "auto" }}>
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">Sign Up</h4>

            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value={name}
              onChange={({ target }) => setName(target.value)} // ✅ Fixed
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button type="submit" className="btn-primary">
              Create Account
            </button>

            <p className="text-xs text-center my-4">
              Already have an account?
              <button
                type="button"
                className="btn-primary btn-light"
                onClick={() => navigate('/login')} // ✅ Fixed
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

