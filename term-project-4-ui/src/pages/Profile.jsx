import React from 'react'
import SideBar from '../components/SideBar'
import ProfileSide from '../components/profile/ProfileSide'

export default function Profile() {
    return (
        <div className='max-w-auto mx-auto my-5'>
           <div className='m-2'>
           <SideBar />
           </div>
            <ProfileSide/>
        </div>
    )
}
