import React from 'react';
import { Link } from 'react-router-dom';
import assets from './assets/assets';
import { IoMdSearch } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import Content from './home/Content';
import { MdKeyboardArrowRight } from "react-icons/md";

export default function Navbar({ openLeftBar, handleToggleLeftBar }) {

    return (
        <div className='fixed'>
            <div className='relative flex items-center'>
                <div className='relative'>
                    <IoMdSearch className='absolute top-3 left-3 text-xl opacity-50' />
                    <input type="text" placeholder='Search...' className='bg-slate-100 py-2 ps-10 pe-32 rounded-xl' />
                </div>
                <div className='flex items-center ms-[420px]'>
                    <div className='p-4 hover:bg-lighter-blue cursor-pointer w-fit bg-slate-100 rounded-full text-xl'><IoNotificationsOutline /></div>
                    <div className='mx-4 flex items-center '>
                        <div>
                            <h1 className='text-xl'>Nguon Sarady</h1>
                            <p className='opacity-50'>user</p>
                        </div>
                       <Link to='/profile'> <img src={assets.pf} alt="" className='object-fit w-[50px] h-[50px] border-[1.5px] ms-2 border-black rounded-full' /></Link>
                    </div>

                    <div className='text-xl cursor-pointer' onClick={handleToggleLeftBar}>
                        <MdKeyboardArrowRight />
                    </div>
                </div>
            </div>

            {/* display bar when btn clicked  */}
            {
                openLeftBar && <Content />
            }
        </div>
    )
}
