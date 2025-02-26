import React from 'react'
import Navbar from '../components/Navbar.jsx'
import EmoCard from '../components/EmoCard.jsx'

const EmoPage = () => {
  return (
    <div className='overflow-hidden flex flex-col'>
      <Navbar />  
      <div className='pt-14 pl-4 pb-5'>
        <h1 className='font-semibold text-2xl py-4'>Emotions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <EmoCard />
          <EmoCard />
          <EmoCard />
          <EmoCard />
          <EmoCard />
          <EmoCard />
          <EmoCard />
          <EmoCard />
          <EmoCard />
        </div>
      </div>
    </div>
  )
}

export default EmoPage