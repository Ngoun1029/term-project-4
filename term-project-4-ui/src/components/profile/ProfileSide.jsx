import React, { useEffect, useState } from 'react';
import assets from '../assets/assets';
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { FiPhone } from "react-icons/fi";
import { BsPencilSquare } from "react-icons/bs";
import { informationEdit, userProfile } from '../../server/api';

export default function ProfileSide() {
    // Edit data
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [contact, setContact] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');

    // Toggle edit information
    const [editInfoContent, setEditInfoContent] = useState(false);

    // User information state
    const [userInfo, setUserInfo] = useState(null);

    // Toggle edit form visibility
    const handleToggleContent = () => {
        setEditInfoContent(prev => !prev);
    };

   

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');

            try {
                const response = await userProfile(token);
            
                setUserInfo(response.data.result);

                setProfilePicture(response?.data?.result?.user_details?.profile_picture);
                
                // Prepopulate form fields
                setFname(response.data.result.first_name || '');
                setLname(response.data.result.last_name || '');
                setContact(response.data.result.user_details?.contact || '');

                // Format the birthdate to 'yyyy-MM-dd' for the input
                const formattedBirthdate = response.data.result.user_details?.birthdate
                    ? new Date(response.data.result.user_details.birthdate).toISOString().split('T')[0]
                    : '';
                setBirthdate(formattedBirthdate);
            } catch (error) {
                console.error("Error fetching user info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);


    // Format date for display
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Handle form submission for editing user information
    const handleEditInfo = async (e) => {
        e.preventDefault();

        if (!fname || !lname || !contact || !birthdate) {
            alert("All fields are required.");
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const param = {
                first_name: fname,
                last_name: lname,
                user_details: {
                    contact: contact,
                    birthdate: birthdate,
                }
            };

            setLoading(true);
            const response = await informationEdit(param, token);

            alert("User information updated successfully!");
            console.log("Response:", response);

            setEditInfoContent(false);
        } catch (error) {
            console.error("Error updating user info:", error);
            alert("Failed to update user information. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ms-36">
            {/* User Profile */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img
                        src={profilePicture} 
                        alt="User Profile"
                        className="object-fit w-[150px] h-[150px] border-[2px] border-black rounded-full"
                    />
                    <div className="ms-6">
                        <h1 className="text-3xl font-medium">{userInfo?.first_name} {userInfo?.last_name}</h1>
                        <p className="opacity-50 italic text-md">@{userInfo?.user_details?.user_name}</p>
                    </div>
                </div>
                <div>
                    <button
                        className="flex items-center hover:bg-blue-hover bg-lighter-blue text-sky-800 rounded-xl py-2 px-8"
                        onClick={handleToggleContent}
                    >
                        <span>Edit Profile</span>
                        <span className="ms-1 text-lg"><AiOutlineEdit /></span>
                    </button>
                </div>
            </div>

            {/* Edit Profile Form */}
            {editInfoContent ? (
                <div className="mt-14 w-[600px]">
                    <h1 className="text-2xl mb-6">Edit Details</h1>
                    <form onSubmit={handleEditInfo}>
                        <div className="flex mb-3 justify-between">
                            <div className="flex flex-col">
                                <label className="flex items-center">
                                    <MdOutlineDriveFileRenameOutline className="me-3" />
                                    <span>First Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={fname}
                                    onChange={(e) => setFname(e.target.value)}
                                    className="bg-slate-100 rounded-xl py-2 px-8 mt-2 border-[1px] border-gray-200"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="flex items-center">
                                    <MdOutlineDriveFileRenameOutline className="me-3" />
                                    <span>Last Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={lname}
                                    onChange={(e) => setLname(e.target.value)}
                                    className="bg-slate-100 rounded-xl py-2 px-8 mt-2 border-[1px] border-gray-200"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mb-3">
                            <label className="flex items-center">
                                <FiPhone className="me-3" />
                                <span>Contact</span>
                            </label>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className="bg-slate-100 rounded-xl py-2 px-8 mt-2 border-[1px] border-gray-200"
                            />
                        </div>
                        <div className="flex flex-col mb-3">
                            <label className="flex items-center">
                                <LiaBirthdayCakeSolid className="me-3" />
                                <span>Birthdate</span>
                            </label>
                            <input
                                type="date"
                                value={birthdate}
                                onChange={(e) => setBirthdate(e.target.value)}
                                className="bg-slate-100 rounded-xl py-2 px-8 mt-2 border-[1px] border-gray-200"
                            />
                        </div>
                        <div className="flex justify-end mt-8">
                            <button
                                type="button"
                                onClick={handleToggleContent}
                                className="py-2 px-8 rounded-xl bg-lighter-blue text-black hover:bg-blue-hover me-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="py-2 px-8 rounded-xl bg-black text-white hover:text-[#ddd]"
                            >
                                {loading ? 'Editing...' : 'Edit'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="mt-14 p-8 rounded-xl bg-slate-100 w-[600px]">
                    <div className="flex items-start justify-between">
                        <h1 className="text-2xl mb-6">Account Details</h1>
                        <BsPencilSquare
                            className="text-lg mt-2 cursor-pointer hover:text-[#4a4a4a]"
                            onClick={handleToggleContent}
                        />
                    </div>
                    <ul className="flex flex-col gap-3 opacity-75">
                        <li className="flex">
                            <div className="flex items-center">
                                <MdOutlineDriveFileRenameOutline className="me-3" />
                                <span>First Name: {userInfo?.first_name}</span>
                            </div>
                            <div className="ms-6">
                                <span>Last Name: {userInfo?.last_name}</span>
                            </div>
                        </li>
                        <li className="flex items-center">
                            <FiPhone className="me-3" />
                            <span>Contact: {userInfo?.user_details?.contact}</span>
                        </li>
                        <li className="flex items-center">
                            <LiaBirthdayCakeSolid className="me-3" />
                            <span>Birthday: {formatDate(userInfo?.user_details?.birthdate)}</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
