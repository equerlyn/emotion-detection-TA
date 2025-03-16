import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetState } from '../redux/reducers/emotionReducer';
import Navbar from '../components/Navbar';
import UploadFile from '../components/UploadFile';

const MainPage = () => {
  const dispatch = useDispatch();
  
  // Reset state when navigating to the main page
  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center bg pt-20">
        <h2 className="text-2xl font-bold raisin-black mb-2">
          What is your current emotion?
        </h2>
        <p className="text-gray-600 mb-6">Add your EEG</p>
      </div>
      <div className="bg pb-24 px-24">
        <UploadFile />
      </div>
    </div>
  );
};

export default MainPage;