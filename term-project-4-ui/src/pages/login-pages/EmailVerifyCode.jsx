import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailCodeVerification } from "../../server/api";
import { EmailCodeVerificationParam } from '../../params/email-params/EmailCodeVerificationParam';


const EmailVerifyCode = () => {
  const email = localStorage.getItem('email');
  const [code, setCode] = useState('');

  const navigate = useNavigate();
  const handleOtpSubmit = async () => {
    const email = localStorage.getItem('email'); // Get email from localStorage
  
    // Check if email is present in localStorage
    if (!email || email.trim() === '') {
      console.error('Email not found in localStorage');
      // Optionally, you could display an error message to the user or redirect them to another page
      return; // Prevent further execution if email is not found
    }
  
    const param = EmailCodeVerificationParam;
    param.email = email;
    param.verification_code = code;
  
    // Call the verification API
    try {
      const response = await emailCodeVerification(param);
      if (response) {
        navigate('/home');
        localStorage.removeItem('email');
        // Handle successful verification (e.g., redirect, show success message)
        console.log('Verification successful');
      } else {
        console.error('Verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-3xl text-center font-medium mb-8 text-gray-800">
          Email Verification
        </h1>

        <p className="text-center mb-6 text-gray-700">
          Please enter the code
        </p>
        <div className="flex flex-col items-center mb-6">
          <input
            className="bg-slate-100 py-2 px-8 rounded-xl w-full mb-4"
            type="text"
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            className="py-2 px-8 rounded-xl text-white bg-black hover:text-[#ddd] transition duration-300 w-full"
            onClick={handleOtpSubmit}
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerifyCode;
