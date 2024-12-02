import React from 'react'
import SideBar from '../components/SideBar'
import ProfileSide from '../components/profile/ProfileSide'

export default function Profile() {
    return (
        <div className='max-w-[1230px] mx-auto my-5'>
            <SideBar />
            <ProfileSide/>
        </div>
    )
}
