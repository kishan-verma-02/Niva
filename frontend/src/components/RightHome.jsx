import React from 'react'
import Messages from '../pages/Messages'

const RightHome = () => {
    return (
    <div className='w-[25%] hidden lg:block min-h-[100vh] border-l-2 border-gray-900 bg-gradient-to-b from-gray-950 to-orange-950'>
        <Messages />
    </div>
    )
}

export default RightHome