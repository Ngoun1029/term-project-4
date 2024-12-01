import React, { useState, useEffect, useRef } from 'react';
import { TbCategoryPlus } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { MdOutlineEmergencyShare } from "react-icons/md";
import { LuPencilLine } from "react-icons/lu";
import { usePopup } from '../context/PopupContext';
import { taskDetail, taskUpdate } from '../../server/api';

export default function EditTask() {
    const [taskCategory, setTaskCategory] = useState('');
    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [emergentLevel, setEmergentLevel] = useState('');

    const token = localStorage.getItem('token');

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

    const fetchTaskDetails = async () => {
        try {
            //get task by id
            const task = await taskDetail(currentTaskId, token);
            console.log('task ', task);

            //get selected task to display on form
            // setTaskCategory(task.categories || '');
            // setTaskName(task.title || '');
            // setDeadline(task.deadline || '');
            // setEmergentLevel(task.emergent_level || '');
        } catch (error) {
            console.error('Error fetching task: ', error);
        }
    }

    useEffect(() => {
        if (currentTaskId && activePopup === 'editTask') {
            fetchTaskDetails();
        }
    }, [currentTaskId, activePopup]);

    if (activePopup !== 'editTask' || !currentTaskId) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     await taskUpdate(
        //         {
        //             task_id: currentTaskId,
        //             categories: taskCategory,
        //             title: taskName,
        //             description: 'Updated description',
        //             deadline: deadline,
        //             emergent_level: emergentLevel,
        //             progress: 'In Progress',
        //         },
        //         token
        //     );
        //     hidePopup();

        //     console.log('success editing task');
        // } catch (error) {
        //     console.error('Error updating task:', error);
        // }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <form ref={contentRef} onSubmit={handleSubmit} className='p-8 bg-gray-50 w-[500px] rounded-xl'>
                <h1 className='text-xl'>Edit Task{currentTaskId}</h1>
                <div className="my-8">
                    <div className="mb-3 flex items-center justify-between">
                        <div className='flex items-center opacity-75'>
                            <TbCategoryPlus />
                            <span className='ms-3'>Category</span>
                        </div>
                        <div>
                            <select
                                id="taskCategory"
                                onChange={(e) => setTaskCategory(e.target.value)}
                                className="border border-slate-200 rounded-xl py-2 px-8 w-full"
                            >
                                <option value="" disabled>
                                    Task Type
                                </option>
                                <option value="individual">Individual</option>
                                <option value="group">Group</option>
                            </select>
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
                        Edit
                    </button>
                </div>
            </form >
        </div >
    )
}

