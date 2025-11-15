import React, { useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { TbArrowBackUpDouble } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import dp from '../assets/dp.png'
import { serverUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice.js';
import { ClipLoader } from 'react-spinners';


const EditProfile = () => {

    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate()
    const imageInput = useRef()
    const [frontendImage, setFrontendImage] = useState(userData.profileImage || dp)
    const [backendImage, setBackendImage] = useState(null)
    const [name, setName] = useState(userData.name || "")
    const [userName, setUserName] = useState(userData.userName || "")
    const [bio, setBio] = useState(userData.bio || "")
    const [profession, setProfession] = useState(userData.profession || "")
    const [gender, setGender] = useState(userData.gender || "")
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)


    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleEditProfile = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name",name)
            formData.append("userName",userName)
            formData.append("bio",bio)
            formData.append("profession",profession)
            formData.append("gender",gender)
            if(backendImage){
                formData.append("profileImage",backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/editProfile`, formData, {withCredentials:true})
            dispatch(setProfileData(result.data))
            dispatch(setUserData(result.data))
            setLoading(false)
            navigate(`/profile/${userData.userName}`)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
    <div className='w-full min-h-[100vh] bg-gradient-to-t from-indigo-950 to-gray-950 flex items-center flex-col gap-[20px]'>
        <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px]'>
            <TbArrowBackUpDouble className='text-white w-[28px] h-[28px] cursor-pointer' onClick={()=>navigate(`/profile/${userData.userName}`)}/>
            <h1 className='text-white text-[20px] font-semibold'>Edit Profile</h1>
        </div>

        <div className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>imageInput.current.click()}>
            <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImage}/>
            <img src={frontendImage} alt="dp" className=' w-full object-cover h-full'/>
        </div>

        <div className='text-blue-500 text-center text-[18px] font-semibold cursor-pointer' onClick={()=>imageInput.current.click()}>Change Your Profile Picture</div>

        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-blue-950 border-2 border-indigo-400 rounded-2xl text-white font-semibold px-[20px] outline-none' placeholder='Enter Your Name' onChange={(e)=>setName(e.target.value)} value={name}/>

        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-blue-950 border-2 border-indigo-400 rounded-2xl text-white font-semibold px-[20px] outline-none' placeholder='Enter Your UserName' onChange={(e)=>setUserName(e.target.value)} value={userName}/>
                        
        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-blue-950 border-2 border-indigo-400 rounded-2xl text-white font-semibold px-[20px] outline-none' placeholder='Bio' onChange={(e)=>setBio(e.target.value)} value={bio}/>

        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-blue-950 border-2 border-indigo-400 rounded-2xl text-white font-semibold px-[20px] outline-none' placeholder='Profession' onChange={(e)=>setProfession(e.target.value)} value={profession}/>

        <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-blue-950 border-2 border-indigo-400 rounded-2xl text-white font-semibold px-[20px] outline-none' placeholder='Gender' onChange={(e) => {
        const value = e.target.value;
         // Handle empty input (no crash)
        if (value === "") {
            setGender("");
            return;
        }
        // First letter uppercase + rest lowercase
        const formatted =
            value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

        // Update state
        setGender(formatted);
        }} value={gender}/>

        <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] cursor-pointer rounded-2xl bg-gradient-to-br from-purple-600 via-rose-500 to-amber-500 text-white font-semibold hover:from-blue-600 hover:via-fuchsia-500 hover:to-purple-600
        transition-all transition-colors duration-500 ease-in-out shadow-md hover:scale-95' onClick={handleEditProfile}>{loading ?<ClipLoader size={30} color='black'/> : "Save Profile"}</button>

    </div>
    )
}

export default EditProfile