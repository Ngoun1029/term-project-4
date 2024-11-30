import React, { useState, useEffect, useRef } from 'react';
import { TbCategoryPlus } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { MdOutlineEmergencyShare } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { usePopup } from '../context/PopupContext';

export default function DeleteTask() {

    //popup
    const { setActivePopup, currentTaskId, activePopup, hidePopup } = usePopup();

    // disable popup by clicking on anywhere on screen 
    const contentRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                setActivePopup(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setActivePopup]);

    //popup 
    if (activePopup !== "deleteTask") return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <form ref={contentRef} className='p-8 bg-gray-50 w-[500px] rounded-xl'>
                <h1 className='text-xl'>Delete Task {currentTaskId}</h1>
                <div className="my-8">
                    Are you sure you want to delete this task?
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={hidePopup}
                        className=" bg-lighter-blue text-black hover:bg-blue-hover py-2 px-8 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className="ms-3 bg-black text-white hover:text-[#ddd] py-2 px-8 rounded-lg"
                    >
                        Delete
                    </button>
                </div>
            </form >
        </div >
    )
}
