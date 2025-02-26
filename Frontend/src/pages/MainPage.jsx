import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Dropdown from '../components/Dropdown.jsx'
import UploadFile from '../components/UploadFile.jsx'

const MainPage = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center bg pt-10">
        <h2 className="text-2xl font-bold raisin-black mb-2">
          What is your current emotion?
        </h2>
        <p className="text-gray-600 mb-6">Add your EEG</p>
      </div>
      <div className="pl-24 bg">
        <Dropdown/>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg pb-24 px-24">
        <UploadFile />
      </div>
    </div>
  );
}

export default MainPage