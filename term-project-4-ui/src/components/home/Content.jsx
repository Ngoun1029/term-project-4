import React, { useEffect, useRef, useState } from 'react';
// import { IoMdClose } from "react-icons/io";
import Sort from './content/Sort';
import Tasks from './content/Tasks';

export default function Content() {

    //switch content between tasks &sorts
    const [contentVisibility, setContentVisibility] = useState('tasks');

    const handleContentVisibility = (content) => {
        setContentVisibility(content);
    }

    // Track the ID of the clicked task for displaying buttons
    const [activeTaskId, setActiveTaskId] = useState(null);

    const handleBtnVisibility = (id) => {
        setActiveTaskId((prevId) => (prevId === id ? null : id));
    };

    const contentRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                setActiveTaskId(null); // Close the buttons
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div className='bg-slate-100 w-[350px] h-screen float-right absolute -top-[20px] -right-[360px] p-6'>
                <ul className="flex w-24 mx-auto">
                    <li onClick={() => handleContentVisibility('tasks')} className='me-3 cursor-pointer text-lg font-medium relative'>
                        <span>Tasks</span>
                        {contentVisibility === 'tasks' && <div className='bg-sky-800 h-[3px] w-100'></div>}
                    </li>
                    <li onClick={() => handleContentVisibility('sorts')} className='cursor-pointer text-lg font-medium'>
                        <span>Sorts</span>
                        {contentVisibility === 'sorts' && <div className='bg-sky-800 h-[3px] w-100'></div>}
                    </li>
                </ul>

                <ul>
                    <li>
                        {contentVisibility === 'tasks' &&
                            <Tasks handleBtnVisibility={handleBtnVisibility} activeTaskId={activeTaskId} />
                        }
                    </li>
                    <li>
                        {contentVisibility === 'sorts' &&
                            <Sort />
                        }
                    </li>
                </ul>
            </div>
        </div>
    )
}
