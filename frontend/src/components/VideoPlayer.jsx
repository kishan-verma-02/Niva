import React, { useEffect, useRef, useState } from 'react'
import { MdVolumeUp } from "react-icons/md";
import { MdVolumeOff } from "react-icons/md";


const VideoPlayer = ({media}) => {

    const videoTag = useRef()
    const [mute, setMute] = useState(true)
    const [isPlaying, setIsplaying] = useState(true)

    const handleClick = () => {
        if(isPlaying){
            videoTag.current.pause()
            setIsplaying(false)
        }else{
            videoTag.current.play()
            setIsplaying(true)
        }
    }

    useEffect(()=>{
    const observer = new IntersectionObserver(([entry])=>{
            const video = videoTag.current
            if(!video) return;
            if(entry.isIntersecting){
                video.play()
                setIsplaying(true)
            }else{
                video.pause()
                setIsplaying(false)
            }
        },{threshold: 0.6})
        if(videoTag.current){
            observer.observe(videoTag.current)
        }

        return ()=>{
            if(videoTag.current){
            observer.unobserve(videoTag.current)
        }
        observer.disconnect();
        }
    },[])

    return (
    <div className='h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
        <video ref={videoTag} src={media} autoPlay loop muted={mute} className='h-[100%]  cursor-pointer w-full rounded-2xl object-cover' onClick={handleClick}/>

        <div className=' absolute bottom-[10px] right-[10px]' onClick={()=>setMute(prev=>!prev)}>

            {!mute ? <MdVolumeUp className='w-[20px] h-[20px] text-white font-semibold'/> : <MdVolumeOff className='w-[20px] h-[20px] text-white font-semibold'/> }
        </div>

    </div>
    )
}

export default VideoPlayer