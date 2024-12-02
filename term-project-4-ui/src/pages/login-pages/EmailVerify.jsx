import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailVerification } from "../../server/api";
import { EmailVerificationParam } from '../../params/email-params/EmailVerificationParam';

const EmailVerificationForm = () => {
  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  const fetchEmailVerification = async () => {
    if (!email || email.trim() === '') {
      setErrorMessage('Email is missing or invalid. Please check your email and try again.');
      return;
    }

    const param = EmailVerificationParam;
    param.email = email;

    try {
      const response = await emailVerification(param);
      if (response) {
        navigate('/email-verify-code');
      } else {
        setErrorMessage('Email verification failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  const handleOtpSubmit = async () => {
    fetchEmailVerification();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h1 className="text-3xl text-center font-medium mb-8 text-gray-800">
          Email Verification
        </h1>
        
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        <p className="text-center mb-6 text-gray-700">
          Please click "Verify Email" and check your email.
        </p>
        
        <div className="flex flex-col items-center">
          <button
            className="py-2 px-8 rounded-xl text-white bg-black hover:text-[#ddd] transition duration-300"
            onClick={handleOtpSubmit}
          >
            Verify Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
