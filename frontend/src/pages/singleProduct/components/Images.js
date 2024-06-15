import React, { useState } from 'react';

const Images = ({ photos }) => {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    const handleThumbnailClick = (index) => {
      setSelectedPhotoIndex(index);
    };
  

    if (!photos || photos.length === 0) {
        return <div className="flex justify-center items-center h-full w-full">
        <div
          className="Spinner"
          style={{
            border: "4px solid rgba(0, 0, 0, 0.1)",
            borderLeft: "4px solid #3498db",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>;
      }

  return (
    <div className='w-full flex flex-col'>
        <div className='w-full flex justify-center'>
      <img className="flex-end rounded-lg shadow-lg border-[1px] border-gray-200" src={`${photos[selectedPhotoIndex]}`} alt="Big" style={{ width: 'auto', maxHeight: '400px' }} />
        </div>
      <div className='w-full justify-center gap-5 overflow-x-auto overflow-y-hidden hide-scrollbar' style={{ display: 'flex', marginTop: '20px' }}>
        {photos?.map((photo, index) => 
        (
          <img
          className='rounded-lg shadow-lg border-[1px] border-gray-200'
            key={index}
            src={`${photo}`}
            alt={`Thumbnail ${index}`}
            style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Images