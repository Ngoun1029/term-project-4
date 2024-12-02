import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUp } from '../../server/api';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const navigate = useNavigate();

    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [gender, setGender] = useState();
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const [confirmPass, setConfirmPass] = useState();
    const [contact, setContact] = useState();
    const [username, setUsername] = useState();
    const [birthdate, setBirthdate] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        //store email in local
        localStorage.setItem('email', email);

        setLoading(true);
        setError('');
        setSuccess('');

        if (pass !== confirmPass) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        const userSignUp = {
            first_name: fname,
            last_name: lname,
            gender,
            email,
            password: pass,
            confirm_password: confirmPass,
            contact,
            user_name: username,
            birthdate,
        };

        try {
            const response = await signUp(userSignUp);

            if (response) {
               
                setSuccess('Sign-up successful!');
                // console.log(response);
                localStorage.setItem('email', email);
                
                navigate('/email-verify')
            } else {
                setError('Sign-up failed. Please try again.');
            }
        } catch (err) {
            console.error('Error during sign-up:', err);
            setError('An error occurred during sign-up.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Sign Up</h2>

                <form onSubmit={handleSubmit}>
                    {/* First Name */}
                    <div className="mb-4">
                        <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700">
                            First Name:
                        </label>
                        <input
                            type="text"
                            id="fname"
                            name="first_name"
                            onChange={(e) => setFname(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="mb-4">
                        <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700">
                            Last Name:
                        </label>
                        <input
                            type="text"
                            id="lname"
                            name="last_name"
                            onChange={(e) => setLname(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Gender */}
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                            Gender:
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            onChange={(e) => setGender(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="pass"
                            name="password"
                            onChange={(e) => setPass(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700">
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPass"
                            name="confirm_password"
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Contact */}
                    <div className="mb-4">
                        <label htmlFor="contact" className="block text-sm font-semibold text-gray-700">
                            Contact:
                        </label>
                        <input
                            type="text"
                            id="contact"
                            name="contact"
                            onChange={(e) => setContact(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Username */}
                    <div className="mb-4">
                        <label htmlFor="user_name" className="block text-sm font-semibold text-gray-700">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="user_name"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Birthdate */}
                    <div className="mb-2">
                        <label htmlFor="birthdate" className="block text-sm font-semibold text-gray-700">
                            Birthdate:
                        </label>
                        <input
                            type="date"
                            id="birthdate"
                            name="birthdate"
                            onChange={(e) => setBirthdate(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className='mb-6 text-md'>Already have an account? <Link to='/' className='italic'>Log In</Link></div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && <p className="text-green-500 mb-4">{success}</p>}
                </form>
            </div>
        </div>
    )
}
