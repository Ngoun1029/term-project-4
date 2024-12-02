import React, { useEffect, useRef, useState } from 'react';
import { taskData } from '../../server/api';
import { usePopup } from '../context/PopupContext';

export default function DisplayTasks() {
    const contentRef = useRef(null);

    const token = localStorage.getItem('token');
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const range = 10;

    const TaskDataParam = {
        page: currentPage,
        range: range,
    };


    const fetchTasks = async () => {

        setLoading(true);

        try {
            const data = await taskData(TaskDataParam, token);

            if (data && data.status === "success" && data.data && data.data.result) {
                const tasks = data.data.result.data;

                console.log('tasks: ', tasks);

                if (tasks.length > 0) {
                    setTasks(tasks);
                    setCurrentPage(data.data.result.current_page);
                    const totalPages = Math.ceil(data.data.result.total / data.data.result.per_page);
                    setTotalPages(totalPages);
                } else {
                    setTasks([]);
                    setTotalPages(1);
                    console.log("No tasks found for the current page.");
                }
            } else {
                console.error("Data structure is incorrect or API returned an error");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
        setLoading(false);
    };


    useEffect(() => {
        fetchTasks();
    }, [currentPage]);

    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    //formating a date 
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    //show edit dialog
    const { showPopup } = usePopup();

    // Track the ID of the clicked task for displaying edi & delete buttons
    const [activeTaskId, setActiveTaskId] = useState(null);

    const handleBtnVisibility = (id) => {
        setActiveTaskId((prevId) => (prevId === id ? null : id));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                setActiveTaskId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="mt-8 h-[700px] overflow-y-auto">
            {loading ? (
                <p className='mt-20'>Loading...</p>
            ) : tasks.length === 0 ? (
                <p className='mt-20'>No tasks available.</p>
            ) : (

                <div>
                    {/* card wrapper  */}
                    <div className='flex flex-wrap gap-4 mt-20'>

                        {/* card  */}
                        {tasks.map(task => (
                            <div
                                onClick={() => handleBtnVisibility(task.id)}
                                key={task.id}
                                className={`w-[259px] p-8 cursor-pointer rounded-xl ${activeTaskId === task.id ? 'bg-slate-200' : 'bg-slate-100'}`}>

                                {/* content  */}
                                <div>
                                    <div className='py-1 px-4 rounded-xl border-[1px] text-black bg-ligher-green border-gray-50 text-xs w-fit'>{task.categories}</div>
                                    <h1 className='text-xl font-medium mb-4'>{task.title}</h1>
                                    <p className='opacity-75 mb-2'>Deadline: {formatDate(task.deadline)}</p>
                                    <p className='opacity-50'>{task.description}</p>
                                </div>

                                {/* btn  */}
                                <div className='absolute bottom-[40px] right-[20px]'>
                                    {activeTaskId === task.id && (
                                        <div className="flex">
                                            <button onClick={() => showPopup('editTask', task.id)} className='py-2 px-8 bg-lighter-blue text-black hover:bg-blue-hover rounded-lg me-2'>
                                                Edit
                                            </button>
                                            <button onClick={() => showPopup('deleteTask', task.id)} className='py-2 px-8 bg-main-bg text-white hover:text-[#ddd] rounded-lg'>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

}
