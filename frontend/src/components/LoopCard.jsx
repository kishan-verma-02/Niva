import React, { useEffect, useRef, useState } from 'react'
import { MdVolumeUp } from "react-icons/md";
import { MdVolumeOff } from "react-icons/md";
import dp from '../assets/dp.png'
import FollowButton from './FollowButton';
import { useDispatch, useSelector } from 'react-redux';
import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";
import { FaRegComment } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setLoopData } from '../redux/loopSlice';
import { BsHearts } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";



const LoopCard = ({loop}) => {

    const videoRef = useRef()
    const dispatch = useDispatch()
    const commentRef = useRef()

    const [isPlaying, setIsPlaying] = useState(true)
    const [isMute, setIsMute] = useState(true)
    const [progress, setProgress] = useState(0)
    const {userData} = useSelector(state=>state.user)
    const {loopData} = useSelector(state=>state.loop)
    const {socket} = useSelector(state=>state.socket)
    const [showHeart, setShowHeart] = useState(false)
    const [showComment, setShowComment] = useState(false)
    const [message, setMessage] = useState("")

    const handleTimeUpdate = () => {
        const video = videoRef.current
        if(video){
            const percent = (video.currentTime / video.duration)*100
            setProgress(percent)
        }
    }

    const handleLikeOnDoubleClick = () => {
        setShowHeart(true)
        setTimeout(()=>setShowHeart(false),6000)
        {!loop.likes?.includes(userData._id) ? handleLike() : null }
    }

    const handleClick = () => {
        if(isPlaying){
            videoRef.current.pause()
            setIsPlaying(false)
        }else{
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

    const handleLike = async () => {
        try{
            const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, {withCredentials: true})
            const updatedLoop = result.data

            const updatedLoops = loopData.map(p=>p._id == loop._id ? updatedLoop : p)
            dispatch(setLoopData(updatedLoops))
        } catch (error) {
            console.log(error)
        }
    }

    const handleComment = async () => {
        try{
            const result = await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`, {message}, {withCredentials: true})
            const updatedLoop = result.data

            const updatedLoops = loopData.map(p=>p._id == loop._id ? updatedLoop : p)
            dispatch(setLoopData(updatedLoops))
            setMessage("")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=> {
        const handleClickOutside = (event) => {
            if(commentRef.current && !commentRef.current.contains(event.target)){
                setShowComment(false)
            }
        }
        if(showComment){
            document.addEventListener("mousedown", handleClickOutside)
        }else {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    },[showComment])
    
    useEffect(()=>{
        const observer = new IntersectionObserver(([entry])=>{
            const video = videoRef.current
            if (!video) return;
            if(entry.isIntersecting){
                video.play()
                setIsPlaying(true)
            }else{
                video.pause()
                setIsPlaying(false)
            }
        },{threshold: 0.6})
        if(videoRef.current){
            observer.observe(videoRef.current)
        }

        return ()=>{
            if(videoRef.current){
            observer.unobserve(videoRef.current)
        }
        observer.disconnect();
        }
    },[])

    useEffect(()=>{
            socket?.on("likedLoop",(updatedData)=>{
                const updatedLoops = loopData.map(p=>p._id == updatedData.loopId ? {...p,likes:updatedData.likes} : p)
                dispatch(setLoopData(updatedLoops))
            })
            socket?.on("commentedLoop",(updatedData)=>{
                const updatedLoops = loopData.map(p=>p._id == updatedData.loopId ? {...p,comments:updatedData.comments} : p)
                dispatch(setLoopData(updatedLoops))
            })
            return () => {socket?.off("likedLoop")
                socket?.off("commentedLoop")
            }
        },[socket,loopData,dispatch])
        

    return (
    <div className='w-full h-[100vh]  flex items-center justify-center relative rounded-2xl overflow-hidden overflow-hidden'>

        {showHeart && <div className=' absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50'><BsHearts className='w-[150px] h-[150px] text-rose-200 drop-shadow-2xl'/></div>}

        <div ref={commentRef} className={` absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-[#0e1718] left-0 transition-transform duration-500 ease-in-out shadow-2xl shadow-black ${showComment? "translate-y-0" : "translate-y-[100%]"}`}>
            <h1 className='text-white text-[20px] text-center font-semibold'>Comments</h1>

            <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>

                {loop.comments.length == 0 && <div className='text-center text-white text-[20px] font-semibold mt-[50px]'>No Comments Yet</div>}

                {loop.comments?.map((com,index)=>(
                    <div className='w-full flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[10px]'>
                        <div className='flex justify-start items-center md:gap-[20px] gap-[10px]'>
                            <div className='w-[40px] h-[40px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                <img src={com.author?.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
                            </div>
                            <div className='w-[150px] font-semibold truncate text-white'>{com.author?.userName}</div>
                        </div>
                        <div className='text-white pl-[60px]'>{com.message}</div>
                    </div>
                ))}
            </div>

            <div className='w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[20px]'>
                <div className='w-[40px] h-[40px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden '>
                    <img src={loop.author?.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
                </div>
            
                <input type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none text-white placeholder:text-gray-400 h-[40px] mr-5' placeholder='Write Comments....' onChange={(e)=>setMessage(e.target.value)} value={message}/>
            
                {message && <button className=' absolute right-[35px] cursor-pointer bg-[#0e1718]' onClick={handleComment}><IoMdSend className='w-[25px] h-[25px] text-white'/></button>}
            </div>
        </div>

        <video ref={videoRef} src={loop?.media} autoPlay muted loop className='w-full max-h-full rounded-2xl' onClick={handleClick} onTimeUpdate={handleTimeUpdate} onDoubleClick={handleLikeOnDoubleClick}/>
        <div className=' absolute top-[20px] right-[20px] z-20' onClick={()=>setIsMute(prev=>!prev)}>
            {!isMute ? <MdVolumeUp className='w-[20px] h-[20px] text-white font-semibold'/> : <MdVolumeOff className='w-[20px] h-[20px] text-white font-semibold'/> }
        </div>

            <div className=' absolute bottom-0 w-full h-[4px] bg-gray-900'>
            <div className='w-[200px] h-full bg-rose-200 transition-all duration-200 ease-linear' style={{width:`${progress}%`}}>

            </div>

            </div>

        <div className='w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[10px]'>

            <div className='flex  items-center gap-[10px]'>

                <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={loop.author?.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
                </div>

                <div className='w-[80px] font-semibold text-white  truncate'>{loop.author.userName}
                </div>

                <FollowButton targetUserId={loop.author?._id} tailwind={"px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white cursor-pointer"}/>

            </div>
            <div className='text-white px-[5px]'>
                {loop.caption} 
            </div>

            <div className=' absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[10px]'>
                <div className='flex flex-col items-center cursor-pointer'>
                    <div onClick={handleLike}>
                        {!loop.likes.includes(userData._id) && <GoHeart className='w-[28px] cursor-pointer h-[28px]'/>}
                        {loop.likes.includes(userData._id) && <GoHeartFill className='w-[28px] cursor-pointer h-[28px] text-red-600' />}
                    </div>
                    <div>{loop.likes.length}</div>
                </div>

                <div className='flex flex-col items-center cursor-pointer' onClick={()=>setShowComment(true)}>
                    <div><FaRegComment className='w-[25px] cursor-pointer h-[25px]'/></div>
                    <div>{loop.comments.length}</div>
                </div>

            </div>

        </div>

    </div>
    )
}

export default LoopCard