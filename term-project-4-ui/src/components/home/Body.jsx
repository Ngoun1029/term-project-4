import React, { useState } from 'react'
import Navbar from '../Navbar'
import Schedualer from './Schedualer'
import DisplayTasks from './DisplayTasks';

export default function Body() {

  // toggle leftbar 
  const [openLeftBar, setOpenLeftBar] = useState(false);
  const handleToggleLeftBar = () => {
    setOpenLeftBar(prev => !prev);
  }

  return (
    <div className='ms-36'>
      <div className={`fixed ${openLeftBar ? 'w-[60%]' : ' w-[85%]'}`}>
        <Navbar openLeftBar={openLeftBar} handleToggleLeftBar={handleToggleLeftBar}/>
        {/* <Schedualer /> */}
        <DisplayTasks/>
      </div>
    </div>
  )
}
