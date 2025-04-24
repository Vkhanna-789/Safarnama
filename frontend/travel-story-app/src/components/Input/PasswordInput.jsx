import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="relative">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
        className="w-full text-sm bg-cyan-600/5 py-3 pr-10 pl-4 rounded outline-none mb-3  focus:border-cyan-500 transition-all" // Applied bg-cyan-600/5
      />
      <div
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={toggleShowPassword}
      >
        {isShowPassword ? (
          <FaRegEye size={22} className="text-cyan-500" />
        ) : (
          <FaRegEyeSlash size={22} className="text-cyan-500" />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
