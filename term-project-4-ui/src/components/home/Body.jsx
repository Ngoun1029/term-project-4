import React, { useState } from 'react'
import Navbar from '../Navbar'
import DisplayTasks from './DisplayTasks';

export default function Body() {

  return (
    <div className='ms-36'>
      <Navbar />
      <DisplayTasks />
    </div>
  )
}
