import React, { useState, useEffect, useRef } from 'react';
import { TbCategoryPlus } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { MdOutlineEmergencyShare } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { usePopup } from '../context/PopupContext';

export default function CreateNewTask() {
    // get data 
    const [taskCategory, setTaskCategory] = useState('');
    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [emergentLevel, setEmergentLevel] = useState('');

    //popup
    const { setActivePopup, activePopup, hidePopup } = usePopup();

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
    if (activePopup !== "createTask") return null;

    const handleCategory = (category) => {
        setTaskCategory(category);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission for creating a task
        const newTask = { taskCategory, taskName, deadline, emergentLevel };
        console.log('Creating Task:', newTask);
        hidePopup();
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <form onSubmit={handleSubmit} ref={contentRef} className='p-8 bg-gray-50 w-[500px] rounded-xl'>
                <h1 className='text-xl'>Create New Task</h1>
                <div className="my-8">
                    <div className="mb-3 flex items-center justify-between">
                        <div className='flex items-center opacity-75'>
                            <TbCategoryPlus />
                            <span className='ms-3'>Category</span>
                        </div>
                        <div>
                            <button
                                type='button'
                                onClick={() => handleCategory('group')}
                                className={`py-2 px-8 me-3 bg-ligher-purple text-purple-800 hover:bg-purple-hover rounded-xl ${taskCategory === 'group' && 'bg-blue-hover'}`}>
                                group
                            </button>
                            <button
                                type='button'
                                onClick={() => handleCategory('individual')}
                                className={`py-2 px-8 bg-ligher-green text-green-800 hover:bg-green-hover rounded-xl ${taskCategory === 'individual' && 'bg-blue-hover'}`}>
                                individual
                            </button>
                        </div>
                    </div>
                    <div className="mb-3 flex items-center justify-between">
                        <div className='flex items-center opacity-75'>
                            <LuPencilLine />
                            <span className='ms-3'>Title</span>
                        </div>
                        <div>
                            <input
                                id='taskName'
                                onChange={(e) => setTaskName(e.target.value)}
                                className="border border-slate-200 rounded-xl py-2 px-8"
                                type="text"
                                placeholder='task title' />
                        </div>
                    </div>
                    <div className="mb-3 flex items-center justify-between">
                        <div className='flex items-center opacity-75'>
                            <IoMdTime />
                            <span className='ms-3'>Deadline</span>
                        </div>
                        <div>
                            <input
                                type="date"
                                id="deadline"
                                onChange={(e) => setDeadline(e.target.value)}
                                className="border border-slate-200 rounded-xl py-2 px-8"
                            />
                        </div>
                    </div>
                    <div className="mb-3 flex items-center justify-between">
                        <div className='flex items-center opacity-75'>
                            <MdOutlineEmergencyShare />
                            <span className='ms-3'>Emergent Level</span>
                        </div>
                        <div>
                            <select
                                id="emergentLevel"
                                onChange={(e) => setEmergentLevel(e.target.value)}
                                className="border border-slate-200 rounded-xl py-2 px-8 w-full"
                            >
                                <option value="" disabled>
                                    Select an option
                                </option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </div>
                    </div>
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
                        Create
                    </button>
                </div>
            </form >
        </div >
    )
}