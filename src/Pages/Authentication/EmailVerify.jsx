import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function EmailVerify({ theme }) {
  const isDark = theme === "dark";

  const colors = {
    primary: isDark ? "bg-[#0F172A]" : "bg-[#F6E5C7]",
    secondary: isDark ? "bg-[#1E293B]" : "bg-[#F0D9A7]",
    input: isDark
      ? "bg-[#333A5C] text-white placeholder-gray-400"
      : "bg-[#fffaf2] text-black placeholder-gray-600",
    card: isDark ? "bg-[#272F40]" : "bg-[#ffffff]",
    textPrimary: isDark ? "text-white" : "text-gray-800",
    textSecondary: isDark ? "text-indigo-300" : "text-gray-600",
    button: isDark
      ? "bg-gradient-to-r from-[#141e32] to-[#101828] text-white"
      : "bg-gradient-to-r from-[#b6885a] to-[#95775A] text-white",
  };

  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join('');

      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp },
        {
          Authorization: `Bearer ${localStorage.getItem(token)}`,
          withCredentials:true
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/');
  }, [isLoggedIn, userData]);

  return (
    <div
      className={`${colors.primary} flex items-center justify-center min-h-screen transition-colors duration-500`}
    >
      <img
        src={assets.Logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-18 sm:w-22 cursor-pointer"
        onClick={() => navigate('/')}
      />
      <form
        onSubmit={onSubmitHandler}
        className={`${colors.card} p-8 rounded-lg shadow-lg w-96 text-sm transition-colors duration-500`}
      >
        <p className={`text-2xl font-semibold text-center mb-4 ${colors.textPrimary}`}>
          Email Verify OTP
        </p>
        <p className={`text-center mb-6 ${colors.textSecondary}`}>
          Enter the 6-digit code sent to your email id.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className={`w-12 h-12 text-center text-xl rounded-md outline-none ${colors.input}`}
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button
          className={`w-full py-3 rounded-full cursor-pointer ${colors.button} transition-colors duration-300`}
        >
          Verify Email
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;
