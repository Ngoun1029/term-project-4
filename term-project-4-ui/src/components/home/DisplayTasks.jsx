import React, { useEffect, useState } from 'react';
import { taskData } from '../../server/api';
import { TaskDataParam } from '../../params/tasks-params/TaskDataParam';

export default function DisplayTasks() {
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
    }, []);

    const handlePageChange = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="mt-8">
            {loading ? (
                <p>Loading...</p>
            ) : tasks.length === 0 ? (
                <p>No tasks available.</p>
            ) : (
                
                <div>
                    <div>
                        {tasks.map(task => (
                            <div key={task.id}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                            </div>
                        ))}
                    </div>

                    <div>
                        {/* Display tasks here */}
                        {tasks.map(task => (
                            <div key={task.id}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                {/* Render other task details */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

}
