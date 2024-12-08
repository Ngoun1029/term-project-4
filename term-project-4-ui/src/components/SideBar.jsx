import React, { useState } from 'react';
import { GrHomeRounded } from "react-icons/gr";
import { FaPlus } from "react-icons/fa6";
import { IoSettingsOutline, IoBookmarks } from "react-icons/io5";
import { usePopup } from './context/PopupContext';
import { useNavigate } from 'react-router-dom';

export default function SideBar() {

    const { showPopup } = usePopup();
    const navigate = useNavigate();

    // State to track which link is active
    const [activeLink, setActiveLink] = useState(1);

    const handleActiveLink = (id, path) => {
        setActiveLink(id); 

        if (id === 2) {
            showPopup('createTask'); 
        } else if (path) {
            navigate(path); 
        }
    };

    return (
        <div className='bg-main-bg ms-4 mt-8 fixed py-8 px-4 rounded-3xl w-auto'>
            <div className='flex flex-col gap-5'>

                <div 
                    onClick={() => handleActiveLink(1, '/home')} 
                    className={`text-xl p-4 rounded-full cursor-pointer 
                    ${activeLink === 1 ? 'bg-lighter-blue text-black' : 'text-white hover:bg-lighter-blue hover:text-black'}`}
                >
                    <GrHomeRounded />
                </div>

                <div 
                    onClick={() => handleActiveLink(2)} 
                    className={`text-xl p-4 rounded-full cursor-pointer 
                    ${activeLink === 2 ? 'bg-lighter-blue text-black' : 'text-white hover:bg-lighter-blue hover:text-black'}`}
                >
                    <FaPlus />
                </div>

                <div 
                    onClick={() => handleActiveLink(3, '/history')} 
                    className={`text-xl p-4 rounded-full cursor-pointer 
                    ${activeLink === 3 ? 'bg-lighter-blue text-black' : 'text-white hover:bg-lighter-blue hover:text-black'}`}
                >
                    <IoBookmarks />
                </div>

                <div 
                    onClick={() => handleActiveLink(4, '/profile')} 
                    className={`text-xl p-4 rounded-full cursor-pointer 
                    ${activeLink === 4 ? 'bg-lighter-blue text-black' : 'text-white hover:bg-lighter-blue hover:text-black'}`}
                >
                    <IoSettingsOutline />
                </div>
                
            </div>
        </div>
    );
}
