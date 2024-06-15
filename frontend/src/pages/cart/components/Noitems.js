import { Accessibility, Activity } from 'lucide-react'
import React from 'react'

const Noitems = () => {
  return (
    <div className='w-full flex items-center justify-center flex-col '>
        <Accessibility className='py-5 text-black text-opacity-65' size={200}/>
        <div className='text-2xl py-5 text-black text-opacity-65 pt-2'>
            No Items In the Cart
        </div>
    </div>
  )
}

export default Noitems