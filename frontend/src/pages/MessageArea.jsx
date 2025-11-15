import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TbArrowBackUpDouble } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import dp from '../assets/dp.png'
import { IoImageOutline } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import SenderMessage from '../components/SenderMessage';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMessages } from '../redux/messageSlice';
import ReceiverMessage from '../components/ReceiverMessage';




const MessageArea = () => {

    const {selectedUser, messages} = useSelector(state=>state.message)
    const {userData} = useSelector(state=>state.user)
    const {socket} = useSelector(state=>state.socket)
    const navigate = useNavigate()
    const [input, setInput] = useState("")
    const imageInput = useRef()
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const dispatch = useDispatch()

    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("message",input)
            if(backendImage){
                formData.append("image",backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}` ,formData ,{withCredentials:true})
            dispatch(setMessages([...messages,result.data]))
            setInput("")
            setFrontendImage(null)
            setBackendImage(null)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllMessages = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/message/getAll/${selectedUser._id}`,{withCredentials:true})
            dispatch(setMessages(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getAllMessages()
    },[])

    useEffect(()=>{
        socket?.on("newMessage",(mess)=>{
            dispatch(setMessages([...messages,mess]))
        })
        return ()=>socket?.off("newMessage")
    },[messages,setMessages])

    return (
    <div className='w-full h-[100vh] bg-gradient-to-b from-gray-950 to-emerald-950 relative'>
        <div className='flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 bg-gray-950 z-[200] w-full'>
            <div className=' h-[80px]  flex items-center gap-[20px] px-[20px]'>
                <TbArrowBackUpDouble className='text-white w-[28px] h-[28px] cursor-pointer' onClick={()=>navigate(`/`)}/>
            </div>

            <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${selectedUser.userName}`)}>
                <img src={selectedUser.profileImage || dp} alt="dp" className='w-full object-cover h-full'/>
            </div>

            <div>
                <div className='text-white text-[18px] font-semibold'>{selectedUser.userName}</div>
                <div className='text-[14px] text-gray-200/90'>{selectedUser.name}</div>
            </div>

        </div>

        <div className='w-full h-[90%] lg:h-[85%] pt-[110px] pb-[80px] lg:pb-[90px] px-[40px] flex flex-col gap-[50px] overflow-auto'>
            {messages && messages.map((mess,index)=>(
                mess.sender == userData._id ?<SenderMessage message={mess} /> : <ReceiverMessage message={mess}/>
            ))}
        </div>

        <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center z-[100]'>
            <form className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-gray-950 flex items-center gap-[10px] px-[20px] shadow-2xl relative' onSubmit={handleSendMessage}>

                {frontendImage && <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden'><img src={frontendImage} alt="" className='h-full object-cover'/></div>}

                <input type="file" accept='image/*' hidden ref={imageInput} onChange={handleImage}/>
                <input type="text" placeholder='Message' className='w-full h-full px-[20px] text-[18px] text-white outline-0'  onChange={(e)=>setInput(e.target.value)} value={input}/>
                <div onClick={()=>imageInput.current.click()}><IoImageOutline className='w-[28px] h-[28px] text-white cursor-pointer'/></div>
                {(input || frontendImage) && 
                <button className='w-[60px] h-[40px] rounded-full bg-gradient-to-br from-purple-800 to-pink-700 flex items-center justify-center cursor-pointer'><IoMdSend className='w-[28px] h-[28px] text-white cursor-pointer ml-1'/></button>}
            </form>
        </div>

    </div>
    )
}

export default MessageArea