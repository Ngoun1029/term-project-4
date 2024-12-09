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

    const range = 8;

    const TaskDataParam = { page: currentPage, range };

    const { showPopup } = usePopup();
    const [activeTaskId, setActiveTaskId] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const data = await taskData(TaskDataParam, token);
                if (data && data.status === 'success' && data.data?.result) {
                    const result = data.data.result;
                    console.log(result);

                    setTasks(result.data || []);
                    setCurrentPage(result.current_page);
                    setTotalPages(Math.ceil(result.total / result.per_page));
                } else {
                    console.error('Invalid API response');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [currentPage]);

    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
        if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className=" h-[700px] overflow-y-auto">
            {loading ? (
                <p className="mt-40">Loading...</p>
            ) : tasks.length === 0 ? (
                <div className='mt-40'>
                    <h1 className='text-3xl font-medium mb-6'>Assigned Tasks</h1>
                    <p>No tasks available.</p>
                </div>
            ) : (
                <>
                    <h1 className='text-3xl font-medium mt-40 mb-6'>Tasks</h1>
                    <div className="flex flex-wrap gap-4">
                        {tasks.map((task) => (
                            <div
                                onClick={() => showPopup('editTask', task.id)}
                                key={task.id}
                                className={`w-[259px] p-8 cursor-pointer rounded-xl ${activeTaskId === task.id ? 'bg-slate-200' : 'bg-slate-100'
                                    }`}
                            >
                                <div>
                                    <div className="py-1 px-4 rounded-xl border text-black bg-ligher-green border-gray-50 text-xs w-fit">
                                        {task.progress}
                                    </div>
                                    <h1 className="text-xl font-medium mb-4">{task.title}</h1>
                                    <p className="mb-2 text-md">Deadline: {formatDate(task.deadline)}</p>
                                    <p>{task.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-8 w-[95%]">
                        <button
                            onClick={() => handlePageChange('prev')}
                            disabled={currentPage === 1}
                            className={`rounded-xl text-blue-800 hover:bg-blue-hover py-2 px-8 ${currentPage === 1 ? 'bg-lighter-blue' : 'bg-blue-hover'}`}
                        >
                            Prev
                        </button>
                        <div className="px-4 py-2">Page {`${currentPage} of ${totalPages}`}</div>
                        <button
                            onClick={() => handlePageChange('next')}
                            disabled={currentPage === totalPages}
                            className={`rounded-xl text-blue-800 hover:bg-blue-hover py-2 px-8 ${currentPage === totalPages ? 'bg-lighter-blue' : 'bg-blue-hover'}`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
