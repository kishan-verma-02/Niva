import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

const SenderMessage = ({message}) => {

    const {userData} = useSelector(state=>state.user)
    const scroll = useRef()

    useEffect(()=>{
        scroll.current.scrollIntoView({behavior:"smooth"})
    },[message.message,message.image])

    return (
    <div ref={scroll} className='w-fit max-w-[60%] bg-gradient-to-br from-pink-500 to-purple-600 rounded-t-2xl rounded-bl-2xl rounded-br-0 px-[10px] relative ml-auto right-0 flex flex-col gap-[10px]'>
        {message.image && <img src={message.image} alt='' className='h-[200px] object-cover rounded-2xl py-2'/>}
        {message.message && <div className='text-[18px] text-white wrap-break-word py-1'>{message.message}</div>}

        <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute right-[-25px] bottom-[-40px]'>
            <img src={userData.profileImage} alt="" className='w-full object-cover'/>
        </div>
    </div>
    )
}

export default SenderMessage