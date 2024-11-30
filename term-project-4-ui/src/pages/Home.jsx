import React from 'react'
import SideBar from '../components/SideBar'
import Body from '../components/home/Body'

export default function Home() {
  return (
    <div className='max-w-[1230px] mx-auto my-5'>
        <SideBar/>
        <Body/>
    </div>
  )
}
