import React, { useState } from 'react';
import { GrHomeRounded } from "react-icons/gr";
import { FaPlus } from "react-icons/fa6";
import { FiTrash } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { usePopup } from './context/PopupContext';
import { useNavigate, Link } from 'react-router-dom';
import { IoBookmarks } from 'react-icons/io5';

export default function SideBar() {

    const { showPopup } = usePopup();

    const navigate = useNavigate();
    // State to track which link is active
    const [activeLink, setActiveLink] = useState(1); 

    const handleActiveLink = (id) => {
        setActiveLink(id); 

        //if plus icon is clicked, display popup createNewTask
        if (id === 2) { 
            showPopup('createTask');
        } else if(id === 1){
            navigate('/home');
        } else if(id === 3){
            navigate('/history');
        } else if(id === 4) {
            navigate('/profile')
        }
    }

    return (
        <div className='bg-main-bg ms-4 mt-8 fixed py-8 px-4 rounded-3xl w-auto'>
            <div className='flex flex-col gap-5'>

                <div 
                    onClick={() => handleActiveLink(1)} 
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
                <div   onClick={() => handleActiveLink(3)} 
                        className={`text-xl p-4 rounded-full cursor-pointer 
                        ${activeLink === 3 ? 'bg-lighter-blue text-black' : 'text-white hover:bg-lighter-blue hover:text-black'}`}
                >
                    <IoBookmarks/>
                </div>

                <div 
                    onClick={() => handleActiveLink(4)} 
                    className={`text-xl p-4 rounded-full cursor-pointer 
                    ${activeLink === 4 ? 'bg-lighter-blue text-black' : 'text-white hover:bg-lighter-blue hover:text-black'}`}
                >
                    <IoSettingsOutline />
                </div>
               
            </div>
        </div>
    )
}
