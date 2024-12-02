import React, { useState } from 'react';
import { emailVerification, emailCodeVerification } from '../../server/api'; // Assuming these are your exported API functions.
import { Link } from 'react-router-dom';

const EmailVerificationForm = () => {

    const email = localStorage.getItem('email');

    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [message, setMessage] = useState('');

    const handleOtpSubmit = async () => {
        try {
            const response = await emailCodeVerification({ email, verification_code: otp });
            setMessage('Verification successful!');
        } catch (error) {
            console.error(error);
            setMessage('Verification failed. Please check your OTP and try again.');
        }
    };

    return (
        <div className='max-w[1200px] mt-[100px] mx-auto'>
            <h1 className="text-3xl text-center font-medium mb-20">Email Verification Process</h1>
            <div className='flex flex-col items-center'>
                <div>
                    <input
                        className='bg-slate-100 py-2 px-8 rounded-xl me-3'
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button className='py-2 px-8 rounded-xl text-white bg-black hover:text-[#ddd]' onClick={handleOtpSubmit}>Verify OTP</button>
                </div>
                {message && <p className='mt-2'>{message}</p>}
            </div>
            <div>
                <div className="mt-32 ms-12">
                    <Link to='/sign-up' className='py-2 px-8 rounded-xl text-black bg-lighter-blue hover:bg-blue-hover'>back to signup</Link>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationForm;
