import React from 'react'
import SideBar from '../components/SideBar'
import Body from '../components/home/Body'

export default function Home() {
  return (
    <div className='max-w-auto mx-auto my-5'>
        <div className='m-2'>
          <SideBar/>
        </div>
        <Body/>
    </div>
  )
}
