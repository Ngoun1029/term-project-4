import React, { useState } from 'react'
import Navbar from '../Navbar'
import DisplayTasks from './DisplayTasks';
import Sort from './Sort';

export default function Body() {

  return (
    <div className='ms-36'>
      <Navbar />
      <Sort/>
      <DisplayTasks />
    </div>
  )
}
