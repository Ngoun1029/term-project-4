import React from 'react';
import { MdOutlineFilterAlt } from "react-icons/md";

export default function Sort() {
    return (
        <div className='mt-8'>
            <div className='flex items-center text-lg'>
                <MdOutlineFilterAlt />
                <span className='ms-3'>Filter</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
                <button className='bg-lighter-blue text-sky-800 hover:bg-blue-hover py-2 px-8 rounded-xl'>title</button>
                <button className='bg-ligher-purple text-purple-800 hover:bg-purple-hover py-2 px-8 rounded-xl'>group</button>
                <button className='bg-ligher-green text-green-800 hover:bg-green-hover py-2 px-8 rounded-xl'>individual</button>
            </div>
        </div>
    )
}
