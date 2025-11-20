import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

function ResetPassword({ theme }) {
  const isDark = theme === "dark";

  const colors = {
    primary: isDark ? "bg-[#0F172A]" : "bg-[#F6E5C7]",
    secondary: isDark ? "bg-[#1E293B]" : "bg-[#F0D9A7]",
    input: isDark ? "bg-[#0F172A] text-white placeholder-gray-400" : "bg-[#fffaf2] text-black placeholder-gray-600",
    card: isDark ? "bg-[#272F40]" : "bg-[#ffffff]",
    textPrimary: isDark ? "text-white" : "text-gray-800",
    textSecondary: isDark ? "text-indigo-300" : "text-gray-600",
    button: isDark
      ? "bg-gradient-to-r from-[#141e32] to-[#101828] text-white"
      : "bg-gradient-to-r from-[#b6885a] to-[#95775A] text-white",
  };

  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const inputRefs = useRef([]);

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email },{
        Authorization: `Bearer ${localStorage.getItem(token)}`
      });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value);
    const joinedOtp = otpArray.join('');
    if (joinedOtp.length < 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }
    setOtp(joinedOtp);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      },{
        Authorization: `Bearer ${localStorage.getItem(token)}`
      });
      if (data.success) {
        toast.success(data.message);
        navigate('/home');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className={`${colors.primary} flex items-center justify-center min-h-screen transition-colors duration-500`}>

      {/* Step 1: Enter email */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className={`${colors.card} p-8 rounded-lg shadow-lg w-96 text-sm transition-colors duration-500`}
        >
          <p className={`text-2xl font-semibold text-center mb-4 ${colors.textPrimary}`}>
            Reset Password
          </p>
          <p className={`text-center mb-6 ${colors.textSecondary}`}>
            Enter your registered email address
          </p>
          <div className={`mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full ${colors.input}`}>
            <i className={`fas fa-envelope ${colors.textPrimary}`}></i>
            <input
              type="email"
              placeholder="Email"
              className={`bg-transparent outline-none w-full ${colors.textPrimary}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className={`w-full py-2.5 rounded-full mt-3 cursor-pointer ${colors.button}`}>
            Submit
          </button>
        </form>
      )}

      {/* Step 2: Enter OTP */}
      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOtp}
          className={`${colors.card} p-8 rounded-lg shadow-lg w-96 text-sm transition-colors duration-500`}
        >
          <p className={`text-2xl font-semibold text-center mb-4 ${colors.textPrimary}`}>
            Verify OTP
          </p>
          <p className={`text-center mb-6 ${colors.textSecondary}`}>
            Enter the 6-digit code sent to your email.
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
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className={`w-full py-2.5 rounded-full cursor-pointer font-bold ${colors.button} transform active:scale-[0.2] transition-all duration-300`}>
            Submit
          </button>
        </form>
      )}

      {/* Step 3: Enter new password */}
      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className={`${colors.card} p-8 rounded-lg shadow-lg w-96 text-sm transition-colors duration-500`}
        >
          <p className={`text-2xl font-semibold text-center mb-4 ${colors.textPrimary}`}>
            Set New Password
          </p>
          <p className={`text-center mb-6 ${colors.textSecondary}`}>
            Enter your new password below
          </p>
          <div className={`mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full ${colors.input}`}>
            <i className={`fas fa-lock ${colors.textPrimary}`}></i>
            <input
              type="password"
              placeholder="New Password"
              className={`bg-transparent outline-none w-full ${colors.textPrimary}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className={`w-full py-2.5 rounded-full mt-3 ${colors.button}`}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
