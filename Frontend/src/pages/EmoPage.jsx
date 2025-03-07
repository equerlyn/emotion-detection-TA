import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmotions } from '../connection/emotionSlice';
import Navbar from '../components/Navbar.jsx';
import EmoCard from '../components/EmoCard.jsx';

const EmoPage = () => {
  const dispatch = useDispatch();
  const { emotions, status, error } = useSelector((state) => state.emotion);
  
  const emotionList = emotions?.emotions || [];

  useEffect(() => {
    dispatch(fetchEmotions());
  }, [dispatch]);

  return (
    <div className='overflow-hidden flex flex-col min-h-screen'>
      <Navbar />  
      <div className='pt-24 px-12 pb-5 bg'>        
        {status === 'loading' && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {status === 'failed' && (
          <div className="text-red-500 py-4">
            Error loading emotions: {error?.message || 'Something went wrong'}
          </div>
        )}
        
        {status === 'succeeded' && emotionList?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emotionList.map((emotion) => (
              <EmoCard 
                key={emotion.label}
                label={emotion.label}
                name={emotion.name}
                emoji={emotion.emoji}
                description={emotion.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmoPage;