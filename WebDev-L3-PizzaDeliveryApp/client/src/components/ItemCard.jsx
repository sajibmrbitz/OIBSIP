import React, { useState } from 'react';

const CheckBadge = () => (
  <div className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
    <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const gradientMap = {
  base: 'bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900',
  sauce: 'bg-gradient-to-br from-red-300 to-red-600 text-white',
  cheese: 'bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-900',
  vegetable: 'bg-gradient-to-br from-green-200 to-green-500 text-green-900',
  default: 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800'
};

const exactImageMap = {
  'Thin Crust': '/images/base-thin-crust.jpg',
  'Thick Crust': '/images/base-thick-crust.jpg',
  'Tomato': '/images/sauce-tomatoes.jpg',
  'BBQ': '/images/sauce-bbqs.jpg',
  'Mozzarella': '/images/cheese-mozarella.jpg', 
  'Cheddar': '/images/cheese-chedder.jpg',      
  'Onion': '/images/veg-onion.jpg',             
  'Capsicum': '/images/veg-capsicum.jpg',
};

const ItemCard = ({ name, itemType, selected, onClick, price }) => {
  const [imgError, setImgError] = useState(false);
  
  const colorClasses = gradientMap[itemType] || gradientMap.default;
  const shadowClass = itemType === 'sauce' ? 'drop-shadow-md' : '';

  // Get exact mapped image or try to guess the standard format
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const fallbackImgUrl = `/images/${itemType}-${slug}.jpg`;
  const imgUrl = exactImageMap[name] || fallbackImgUrl;

  return (
    <div
      onClick={onClick}
      className={`group relative w-full aspect-[4/3] cursor-pointer overflow-hidden rounded-xl transition-all duration-200 ${
        imgError ? colorClasses : 'bg-gray-100'
      } ${
        selected
          ? 'ring-4 ring-orange-500 scale-105 shadow-xl'
          : 'hover:scale-102 hover:shadow-lg'
      }`}
    >
      {!imgError && (
        <>
          <img 
            src={imgUrl} 
            alt={name} 
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
        </>
      )}

      {selected && <CheckBadge />}
      
      {price && (
        <div className="absolute top-2 left-2 rounded-md bg-white/80 px-2 py-1 text-xs font-bold text-gray-800 shadow-sm backdrop-blur-sm z-10">
          {price}
        </div>
      )}

      {/* Decorative overlay for non-image fallback */}
      {imgError && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>}
      
      <div className="absolute bottom-4 w-full px-4 text-center flex flex-col items-center justify-end pointer-events-none z-10">
        <h4 className={`font-bold text-lg leading-tight ${!imgError ? 'text-white drop-shadow-md' : shadowClass}`}>{name}</h4>
      </div>
    </div>
  );
};

export default ItemCard;
