import React from 'react'
import dp from '../assets/dp.png'
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'

const OtherUser = ({user}) => {

    const navigate = useNavigate()

    return (
    <div className='w-full h-[80px] flex items-center justify-between border-b-2 border-gray-800'>
        <div className='flex items-center gap-[10px]'>
            <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${user.userName}`)}>
                <img src={user.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
            </div>
            <div>
                <div className='text-[18px] text-white font-semibold'>{user.userName}</div>
                <div className='text-[15px] text-gray-400 font-semibold'>{user.name}</div>
            </div>
        </div>
        <FollowButton tailwind={'px-[10px] w-[100px] py-[5px] h-[40px] bg-gradient-to-tl from-indigo-800 via-purple-600 to-sky-500 shadow-lg transition-all transition-colors duration-500 hover:from-pink-500 hover:via-orange-600  hover:to-purple-500 hover:scale-95 rounded-2xl text-white font-semibold cursor-pointer'} targetUserId={user._id}/>
    </div>
    )
}

export default OtherUser