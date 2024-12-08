import React, { useState, useEffect } from 'react';
import { taskAssignedData } from '../../server/api';
import { usePopup } from '../context/PopupContext';

export default function TaskAssigned() {

    const [assignedTasks, setAssignedTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const range = 8;
    const token = localStorage.getItem('token');

    const TaskAssignedDataParam = { page: currentPage, range };

    useEffect(() => {

        const fetchAssignedTasks = async () => {
            try {
                setLoading(true);

                const data = await taskAssignedData(TaskAssignedDataParam, token);
                if (data && data.status === 'success' && data.data?.result) {
                    const result = data.data.result;

                    setAssignedTasks(result.data || []);
                    // console.log('assigned task: ', assignedTasks);

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
        }

        fetchAssignedTasks();

    }, [currentPage]);

    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
        if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const { showPopup } = usePopup();
    const [activeTaskId, setActiveTaskId] = useState(null);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className=" h-[700px] overflow-y-auto">
            {loading ? (
                <p className="mt-40">Loading...</p>
            ) : assignedTasks.length === 0 ? (
                <p className="mt-40">No tasks available.</p>
            ) : (
                <>
                    <div className="flex flex-wrap gap-4 mt-40">
                        {assignedTasks.map((task) => (
                            <div
                                onClick={() => showPopup('updateTask', task.id)}
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

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => handlePageChange('prev')}
                            disabled={currentPage === 1}
                            className={`py-2 px-4 rounded-l-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                        >
                            Prev
                        </button>
                        <div className="px-4 py-2">{`${currentPage} / ${totalPages}`}</div>
                        <button
                            onClick={() => handlePageChange('next')}
                            disabled={currentPage === totalPages}
                            className={`py-2 px-4 rounded-r-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}