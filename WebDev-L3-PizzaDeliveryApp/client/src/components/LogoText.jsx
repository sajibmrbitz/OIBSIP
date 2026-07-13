import React from 'react';

const LogoText = ({ className = "text-3xl" }) => {
  return (
    <div className={`inline-flex items-center font-bold tracking-tighter bg-black px-2 py-1 rounded-md ${className}`} style={{ fontFamily: 'Arial, sans-serif' }}>
      <span className="text-white">Pizza</span>
      <span className="bg-[#f90] text-black px-1.5 py-0.5 rounded ml-1 leading-none">Hub</span>
    </div>
  );
};

export default LogoText;
