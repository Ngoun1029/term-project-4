import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { userProfile } from '../server/api';
import { FaBars } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";

const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState("desktop");

    useEffect(() => {
        const updateScreenSize = () => {
            const width = window.innerWidth;

            if (width < 768) {
                setScreenSize("mobile");
            } else if (width >= 768 && width < 1024) {
                setScreenSize("tablet");
            } else {
                setScreenSize("desktop");
            }
        };

        updateScreenSize();

        window.addEventListener("resize", updateScreenSize);

        return () => window.removeEventListener("resize", updateScreenSize);
    }, []);

    return screenSize;
};

export default function Navbar({ openLeftBar, handleToggleLeftBar }) {
    //fetch navbar toggle
    const [toggleNav, setToggleNav] = useState(false);
    const handleToggleNav = () => {
        setToggleNav(prev => !prev);
    }

    const screenSize = useScreenSize();

    //fetch profile picture
    const [profilePicture, setProfilePicture] = useState('');
    const [username, setUserName] = useState('');
    const fetchUserData = async () => {

        const token = localStorage.getItem('token');

        try {
            const response = await userProfile(token);
            setProfilePicture(response?.data?.result?.user_details.profile_picture);
            setUserName(response?.data?.result?.user_details.user_name);
        }
        catch (error) {
            console.log('error message:', error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className={`fixed bg-white w-[87%] ${screenSize === 'tablet' ? 'w-[83%]' : ''}`}>
            <div className='relative z-50 pt-8 flex items-center justify-between'>
                {/* input & bar  */}
                <div className='flex items-center'>
                    <div
                        onClick={handleToggleNav}
                        className={`border-[1.5px] border-black p-3 rounded-lg me-5 opacity-50 cursor-pointer ${screenSize !== 'mobile' ? 'hidden' : ''}`}>
                        <FaBars />
                    </div>
                    <div className='relative'>
                        <IoMdSearch className='absolute top-3 left-3 text-xl opacity-50' />
                        <input type="text" placeholder='Search...' className={`bg-slate-100 py-2 ps-10 rounded-xl ${screenSize === 'mobile' ? 'pe-10' : 'pe-32'}`} />
                    </div>
                </div>
                {/* bar dropdown  */}
                <div className={`absolute bg-white w-fit top-20 p-5 rounded-xl ${!toggleNav || screenSize !== 'mobile' ? 'hidden' : ''}`}>
                    <Link to='/notification' className='text-md cursor-pointer flex items-center hover:text-[#393838]'>
                        <span className='me-3 bg-slate-100 rounded-full p-2'><IoNotificationsOutline /></span>
                        <span>notification</span>
                    </Link>
                    <Link to='/profile' className='text-md mt-3 cursor-pointer flex items-center hover:text-[#393838]'>
                        <span className='me-3 bg-slate-100 rounded-full p-2'><FaRegUser /></span>
                        <span>profile</span>
                    </Link>
                </div>

                {/* pf & noti  */}
                <div className={`flex items-center ${screenSize === 'desktop' || screenSize === 'tablet' ? '' : 'hidden'}`}>
                    <Link to='/notification'>
                        <div className='p-4 hover:bg-lighter-blue cursor-pointer w-fit bg-slate-100 rounded-full text-xl'><IoNotificationsOutline /></div>
                    </Link>
                    <div className='mx-4 flex items-center '>
                        <div>
                            <h1 className='text-xl' >{username}</h1>
                            <p className='opacity-50'>user</p>
                        </div>
                        <Link to='/profile'> <img src={profilePicture} alt="" className='object-fit w-[50px] h-[50px] border-[1.5px] ms-2 border-black rounded-full' /></Link>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <button className='bg-lighter-blue rounded-xl py-2 px-8 text-blue-800 hover:bg-blue-hover'>All</button>
                <button className='bg-lighter-blue rounded-xl py-2 px-8 text-blue-800 mx-3 hover:bg-blue-hover'>Your Tasks</button>
                <button className='bg-lighter-blue rounded-xl py-2 px-8 text-blue-800 hover:bg-blue-hover'>Assigned Tasks</button>
            </div>
        </div>
    )
}
