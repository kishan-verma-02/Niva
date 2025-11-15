import React, { useEffect, useState } from 'react'
import dp from '../assets/dp.png'
import { LuCircleFadingPlus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';


const StoryDp = ({ProfileImage, userName,story}) => {

    const navigate = useNavigate()
    const {userData} = useSelector(state=>state.user)
    const {storyData, storyList} = useSelector(state=>state.story)
    const [viewed, setViewed] = useState(false)

    useEffect(()=>{
        if(story?.viewers?.some((viewer)=>
        viewer?._id?.toString()===userData._id.toString() || viewer?.toString() == userData._id.toString())){
            setViewed(true)
        }else{
            setViewed(false)
        }
    },[story,userData,storyData,storyList])

    const handleViewers = async () => {
        if(!story?._id){
            return
        }
        try {
            const result = await axios.get(`${serverUrl}/api/story/view/${story._id}`, {withCredentials:true})
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = () => {
        if(!story && userName == "Your Story"){
            navigate("/upload")
        }else if(story && userName == "Your Story"){
            handleViewers()
            navigate(`/story/${userData.userName}`)
        }else {
            handleViewers()
            navigate(`/story/${userName}`)
        }
    }

    return (
    <div className='flex flex-col w-[80px]' >
    <div className={`w-[80px] h-[80px] ${!story ? null : !viewed ?  "bg-gradient-to-tr from-purple-600 via-sky-800 to-indigo-700" : "bg-gradient-to-tr from-gray-700 via-gray-500 to-gray-200"}  rounded-full flex justify-center items-center relative`} onClick={handleClick}>
        <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
            <img src={ProfileImage || dp} alt="dp" className='w-full object-cover h-full'/>
            {!story && userName=="Your Story" && <div><LuCircleFadingPlus className='text-gray-950 absolute bottom-[7px] right-[8px] bg-white rounded-full w-[22px] h-[22px]'/></div>}
            
        </div>
        </div>
        <div className='text-[14px] text-center truncate w-full text-white'>
            {userName}
        </div>
    </div>
    )
}

export default StoryDp