import React from 'react';

const itemMap = ['#00704A', '#004AAD', '#FF9900', '#A435F0', '#00E394'];

function NavbarSlider({ h, className }) {
  return (
    <div className={'w-full flex '+ className} style={{ height: h}}>
      {itemMap.map((color, index) => (
         <div key={index} className="flex-1 bg-white" style={{ backgroundColor: index === itemMap.length - 1 ? '#00E394' : itemMap[(index + 1) % itemMap.length] }}>
          <div className="h-full w-full rounded-e-full" style={{ backgroundColor: color }}></div>
        </div>
      ))}
    </div>
  );
}

export default NavbarSlider;