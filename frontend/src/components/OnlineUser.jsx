import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dp from '../assets/dp.png'
import { setSelectedUser } from '../redux/messageSlice'

const OnlineUser = ({user}) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    return (
    <div className='w-[50px] h-[50px] flex gap-[20px] justify-start items-center relative'>
        <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>{dispatch(setSelectedUser(user))
            navigate('/messageArea')
        }}>
            <img src={user.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
            
        </div>
        <div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-0'></div>
    </div>
    )
}

export default OnlineUser