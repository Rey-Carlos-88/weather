import React from 'react'

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
        <div
            className="h-20 w-20 rounded-full bg-blue-500 animate-spinner-grow"
            role="status"
        >
        </div>
        <span className="text-gray-600 text-2xl font-medium pt-10">
            Loading ...
        </span>
    </div>
    
  )
};
 
export default Loader
