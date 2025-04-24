import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosinstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("🔍 Email:", email);
    console.log("🔍 Password:", password);

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (!password) {
      setError("Password cannot be empty");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true } // Ensure credentials (cookies, auth headers) are sent
      );

      console.log("✅ Login Successful:", response.data);

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("userId", response.data.user._id);  // Store userId
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong, Please try again later");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-100 overflow-hidden relative">
      <div className="login-ui-box right-10 top-40" />
      <div className="login-ui-box bg-cyan-200 bottom-60 right-1/2" />

      <div className="container h-screen flex justify-center items-center px-20 mx-auto" >
        <div className="w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50 lg:flex hidden">
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[58px]">
              Capture Your <br /> Beautiful Moments
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Record your travel experiences and share them with your friends.
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20"style={{ width: "auto", height: "auto" }}>

          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>

            <input
              type="text"
              placeholder="Username"
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
              Login
            </button>

            <p className="text-xs text-center my-4">
              Or
              <button
                type="button"
                className="btn-primary btn-light"
                onClick={() => navigate("/SignUp")}
              >
                Create an account
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
