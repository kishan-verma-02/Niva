import React, { useState } from 'react'
import logo from '../assets/logo.png'
import { IoHeartOutline } from "react-icons/io5";
import dp from '../assets/dp.png'
import { useDispatch, useSelector } from 'react-redux';
import { IoMdLogOut } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import { useNavigate } from 'react-router-dom';
import Notifications from '../pages/Notifications';
import { TiArrowBackOutline } from "react-icons/ti";





const LeftHome = () => {

    const {userData, suggestedUsers} = useSelector(state=>state.user)
    const [showNotification, setShowNotification] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {notificationData} = useSelector(state=>state.user)

    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, {withCredentials: true})
            dispatch(setUserData(null))
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    return (
    <div className={`w-[25%] hidden lg:block h-[100vh] border-r-2 border-gray-900 bg-gradient-to-b from-gray-950 to-orange-950 ${showNotification ? "overflow-hidden" : "overflow-auto"}`}>
        <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>
            <img src={logo} alt="logo" className='w-[80px]'/>
            <div className='relative z-[100] cursor-pointer' onClick={()=>setShowNotification(prev=>!prev)}>

            {showNotification ? <TiArrowBackOutline  className='text-white w-[28px] h-[28px]' /> : <IoHeartOutline className='text-white w-[25px] h-[25px]' />}

                {notificationData?.length>0 && notificationData.some((noti)=>noti.isRead===false) && 
                (<div className='w-[10px] h-[10px] bg-rose-400 rounded-full absolute top-0 right-[-2px]'></div>)}

            </div>
        </div>

        {!showNotification && <>
        <div className='flex items-center w-full justify-between gap-[10px] px-[15px] border-b-2 border-b-gray-900 py-[10px]'>
            <div className='flex items-center gap-[10px]'>
            <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${userData.userName}`)}>
                <img src={userData.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
            </div>
            <div>
                <div className='text-[18px] text-white font-semibold'>{userData.userName}</div>
                <div className='text-[15px] text-gray-400 font-semibold'>{userData.name}</div>
            </div>
            </div>
            <div className='text-blue-400 font-semibold flex gap-1 items-center justify-center cursor-pointer transition-colors duration-300 hover:text-orange-400' onClick={handleLogOut}>Log Out <IoMdLogOut className='text-[20px]'/></div>
        </div>

        <div className='w-full flex flex-col gap-[20px] p-[20px]'>
            <h1 className='text-white text-[20px]'>Suggested Users</h1>
            {suggestedUsers && suggestedUsers.slice(0,3).map((user,index)=>(
                <OtherUser key={index} user={user}/>
            ))}
        </div>
        </>}

        {showNotification && <Notifications />}

    </div>
    )
}

export default LeftHome