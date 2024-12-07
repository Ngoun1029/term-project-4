import React from 'react'

export default function Sort() {
    return (
        <div className='fixed'>
            <div className="relative mt-24">
                <button className='bg-lighter-blue rounded-xl py-2 px-8 text-blue-800 hover:bg-blue-hover'>All</button>
                <button className='bg-lighter-blue rounded-xl py-2 px-8 text-blue-800 mx-3 hover:bg-blue-hover'>Your Tasks</button>
                <button className='bg-lighter-blue rounded-xl py-2 px-8 text-blue-800 hover:bg-blue-hover'>Assigned Tasks</button>
            </div>
        </div>
    )
}
