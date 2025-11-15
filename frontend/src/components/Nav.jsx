import React from 'react'
import { HiHome } from "react-icons/hi2";
import { LuSearch } from "react-icons/lu";
import { BiSolidMoviePlay } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import dp from '../assets/dp.png'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Nav = () => {

    const navigate = useNavigate()
    const {userData} = useSelector(state=>state.user)

    return (
    <div className='w-[90%] lg:w-[40%] h-[70px] bg-gray-950 flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>
        <div><HiHome className='text-white w-[32px] h-[32px] cursor-pointer   active:text-blue-500' onClick={()=>navigate("/")}/></div>
        <div onClick={()=>navigate("/search")}><LuSearch className='text-white w-[32px] h-[32px] cursor-pointer active:text-blue-500'/></div>
        <div onClick={()=>navigate("/upload")}><FiPlusCircle className='text-white w-[32px] h-[32px] cursor-pointer active:text-blue-500'/></div>
        <div onClick={()=>navigate("/loops")}><BiSolidMoviePlay className='text-white w-[32px] h-[32px] cursor-pointer active:text-blue-500'/></div>
        <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${userData.userName}`)}>
            <img src={userData.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
        </div>
    </div>
    )
}

export default Nav