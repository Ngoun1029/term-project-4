import React from 'react';
import { usePopup } from '../../context/PopupContext';

export default function Tasks({ handleBtnVisibility, activeTaskId }) {
    const tasks = [
        { id: 1, name: 'Task 1' },
        { id: 2, name: 'Task 2' },
        { id: 3, name: 'Task 3' },
    ];

    const { showPopup } = usePopup();

    return (
        <ul className="mt-8 flex flex-col gap-4">
            {tasks.map((task) => (
                <div>
                    <li
                        key={task.id}
                        onClick={() => handleBtnVisibility(task.id)}
                        className={`${activeTaskId === task.id ? 'bg-blue-hover' : 'bg-lighter-blue'} 
                        relative rounded-tr-3xl rounded-br-3xl w-fit py-2 px-8 cursor-pointer`}
                    >
                        <div className="w-[3px] top-0 left-0 bg-sky-800 h-full absolute"></div>
                        <span>{task.name}</span>
                    </li>
                    {activeTaskId === task.id && (
                        <div className="flex absolute bottom-5 left-16">
                            <button onClick={() => showPopup('editTask', task.id)} className='py-2 px-8 bg-lighter-blue text-black hover:bg-blue-hover rounded-lg me-2'>
                                Edit
                            </button>
                            <button onClick={() => showPopup('deleteTask', task.id)} className='py-2 px-8 bg-main-bg text-white hover:text-[#ddd] rounded-lg'>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </ul>
    );
}
