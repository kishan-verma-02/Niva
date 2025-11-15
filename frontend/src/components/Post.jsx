import React, { useEffect, useState } from 'react'
import dp from '../assets/dp.png'
import VideoPlayer from './VideoPlayer'
import { GoHeartFill } from "react-icons/go";
import { GoHeart } from "react-icons/go";
import {useDispatch, useSelector} from 'react-redux'
import { FaRegComment } from "react-icons/fa";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';



const Post = ({post}) => {

    const {userData} = useSelector(state=>state.user)
    const {socket} = useSelector(state=>state.socket)
    const {postData} = useSelector(state=>state.post)
    const [showComment, setShowComment] = useState(false)
    const [message, setMessage] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLike = async () => {
        try{
            const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, {withCredentials: true})
            const updatedPost = result.data

            const updatedPosts = postData.map(p=>p._id == post._id ? updatedPost : p)
            dispatch(setPostData(updatedPosts))
        } catch (error) {
            console.log(error)
        }
    }

    const handleComment = async () => {
        try{
            const result = await axios.post(`${serverUrl}/api/post/comment/${post._id}`, {message}, {withCredentials: true})
            const updatedPost = result.data

            const updatedPosts = postData.map(p=>p._id == post._id ? updatedPost : p)
            dispatch(setPostData(updatedPosts))
            setMessage("")
        } catch (error) {
            console.log(error)
        }
    }

    const handleSaved = async () => {
        try{
            const result = await axios.get(`${serverUrl}/api/post/saved/${post._id}`, {withCredentials: true})
            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        socket?.on("likedPost",(updatedData)=>{
            const updatedPosts = postData.map(p=>p._id == updatedData.postId ? {...p,likes:updatedData.likes} : p)
            dispatch(setPostData(updatedPosts))
        })
        socket?.on("commentedPost",(updatedData)=>{
            const updatedPosts = postData.map(p=>p._id == updatedData.postId ? {...p,comments:updatedData.comments} : p)
            dispatch(setPostData(updatedPosts))
        })
        return () => {socket?.off("likedPost")
            socket?.off("commentedPost")
        }
    },[socket,postData,dispatch])
    
    return (
    <div className='w-[90%] flex flex-col gap-[10px] bg-blue-100 items-center shadow-2xl shadow-[#00000058] rounded-4xl pb-[20px]'>
        <div className='w-full h-[80px] flex justify-between items-center px-[10px]'>
            <div className='flex justify-center items-center md:gap-[20px] gap-[10px]' onClick={()=>navigate(`/profile/${post.author?.userName}`)}>
                <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <img src={post.author?.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
                </div>
                <div className='w-[150px] font-semibold truncate'>{post.author.userName}</div>
            </div>

        {userData._id != post.author._id && <FollowButton tailwind={'px-[10px] w-[90px] py-[5px] h-[40px] bg-gradient-to-tl from-indigo-800 via-purple-600 to-sky-500 shadow-lg transition-all transition-colors duration-500 hover:from-pink-500 hover:via-orange-600  hover:to-purple-500 hover:scale-95 rounded-2xl text-white font-semibold cursor-pointer'} targetUserId={post.author._id}/>}
        </div>

        <div className='w-[90%] flex items-center justify-center'>
                {post.mediaType == "image" && <div className='w-[90%] flex items-center justify-center'>
                    <img src={post.media} alt="" className='w-[80%] rounded-2xl  object-cover'/>
                </div>}

                {post.mediaType == "video" && <div className='w-[80%] flex flex-col items-center justify-center'>
                    <VideoPlayer media={post.media}/>
                </div>}

            </div>

            <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
                <div className='flex justify-center items-center gap-[10px]'>
                    <div className='flex justify-center items-center gap-[5px]'>{!post.likes.includes(userData._id) && <GoHeart className='w-[25px] cursor-pointer h-[25px]' onClick={handleLike}/>}
                    {post.likes.includes(userData._id) && <GoHeartFill className='w-[25px] cursor-pointer h-[25px] text-red-600' onClick={handleLike}/>}
                    <span>{post.likes.length}</span>
                    </div>
                    <div className='flex justify-center items-center gap-[5px]' onClick={()=>setShowComment(prev=>!prev)}><FaRegComment className='w-[25px] cursor-pointer h-[25px] text-blue-950'/>
                    <span>{post.comments.length}</span>
                    </div>
                </div>
                <div onClick={handleSaved}>
                    {!userData.saved.includes(post?._id) && <IoBookmarkOutline className='w-[25px] cursor-pointer h-[25px]'/>}{userData.saved.includes(post?._id) && <IoBookmark className='w-[25px] cursor-pointer h-[25px]'/>}
                </div>
            </div>

            {post.caption && <div className='w-full px-[20px] gap-[10px] flex justify-start items-center'>
                <h1>{post.author.userName}_</h1>
                <div>{post.caption}</div>
            </div>}

            {showComment && 
                <div className='w-full flex flex-col gap-[30px] pb-[20px]'>
                    <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>
                    <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    
                    <img src={post.author?.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
                    </div>

                    <input type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]' placeholder='Write Comments....' onChange={(e)=>setMessage(e.target.value)} value={message}/>

                    <button className=' absolute right-[20px] cursor-pointer' onClick={handleComment}><IoMdSend className='w-[25px] h-[25px] bg-blue-100'/></button>

                    </div>

                    <div className='w-full max-h-[300px] overflow-auto'>
                        {post.comments?.map((com,index)=>(
                        <div key={index} className='w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200'>
                            <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                            <img src={com.author.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
                            </div>
                            <div>{com.message}</div>
                        </div>
                        ))}
                    </div>

                </div>
            }

    </div>
    )
}

export default Post