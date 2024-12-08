import React, { useState } from 'react'
import Navbar from '../Navbar'
import DisplayTasks from './DisplayTasks';
import Sort from './Sort';
import { useLocation } from 'react-router-dom';
import TaskAssigned from './TaskAssigned';

export default function Body() {

  //get where user clicked
  const location = useLocation();
  const { clicked } = location.state || {};

  console.log(clicked);
  

  return (
    <div className='ms-36'>
      <Navbar />
      <Sort/>
      { clicked === 'tasks' && <DisplayTasks />}
      { clicked === 'assignedTask' && <TaskAssigned/> }
    </div>
  )
}
