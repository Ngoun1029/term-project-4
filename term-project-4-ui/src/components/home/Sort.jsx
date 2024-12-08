import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Sort() {
    const [click, setClick] = useState(1);

    const handleOnClicked = id => {
        setClick(id);
    }

    return (
        <div className='fixed'>
            <div className="relative mt-24">
                <Link
                    state={{ clicked: 'all' }}
                    onClick={() => handleOnClicked(1)}
                    className={`rounded-xl py-2 px-8 text-blue-800 hover:bg-blue-hover ${click === 1 ? 'bg-blue-hover': 'bg-lighter-blue'}`}
                >
                    All
                </Link>
                <Link
                    state={{ clicked: 'tasks' }}
                    onClick={() => handleOnClicked(2)}
                    className={`mx-3 rounded-xl py-2 px-8 text-blue-800 hover:bg-blue-hover ${click === 2 ? 'bg-blue-hover': 'bg-lighter-blue'}`}
                >
                    Tasks
                </Link>
                <Link
                    state={{ clicked: 'assignedTask' }}
                    onClick={() => handleOnClicked(3)}
                    className={`rounded-xl py-2 px-8 text-blue-800 hover:bg-blue-hover ${click === 3 ? 'bg-blue-hover': 'bg-lighter-blue'}`}
                >
                    Assigned Task
                </Link>
            </div>
        </div>
    )
}
