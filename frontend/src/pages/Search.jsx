import React, { useEffect, useState } from 'react'
import { TbArrowBackUpDouble } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { LuUserSearch } from "react-icons/lu";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/userSlice';
import dp from '../assets/dp.png'



const Search = () => {

    const navigate = useNavigate()
    const [input, setInput] = useState("")
    const dispatch = useDispatch()
    const {searchData} = useSelector(state=>state.user)

    const handleSearch = async (e) => {
        if (e && e.preventDefault) {
        e.preventDefault();
    };
        try {
            const result = await axios.get(`${serverUrl}/api/user/search?keyword=${input}`, {withCredentials:true})
            dispatch(setSearchData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if (input.trim() === "") {
        dispatch(setSearchData([]));
        return;
    }
        handleSearch()
    },[input])

    return (
    <div className='w-full min-h-[100vh] bg-gradient-to-t from-indigo-950 to-gray-950 flex items-center flex-col gap-[20px]'>
        <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px]'>
                    <TbArrowBackUpDouble className='text-white w-[28px] h-[28px] cursor-pointer z-10' onClick={()=>navigate(`/`)}/>
                    
                </div>
                <div className='w-full h-[80px] flex items-center justify-center absolute top-1 ml-6 md:mt-0'>
                    <form onSubmit={handleSearch}  className='w-[75%] max-w-[800px] h-[80%] rounded-full bg-gray-700 flex items-center px-[20px]'>
                        <LuUserSearch  
                            className='w-[25px] h-[25px] text-white'/>
                        <input type="text" placeholder='search.....' className='w-full h-full outline-0 rounded-full px-[20px] text-white text-[20px]' onChange={(e)=>setInput(e.target.value)} value={input}/>
                    </form>
                </div>

            {input && searchData?.map((user)=>(
                <div className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-blue-200 flex items-center gap-[20px] px-[5px] cursor-pointer hover:bg-gray-200' onClick={()=>navigate(`/profile/${user.userName}`)}>
                    <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={user.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
                    </div>

                <div className='text-black text-[18px] font-semibold'>
                    <div>{user.userName}</div>
                    <div className='text-[14px] text-gray-900/90'>{user.name}</div>
                </div>
                </div>
            ))}

            {!input && <div className='text-[30px] text-gray-600 font-bold'>Search Here....</div>}

    </div>
    )
}

export default Search