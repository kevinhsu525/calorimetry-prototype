import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="flex h-[68px] items-center justify-between px-6 border-b border-[#373b3d] shrink-0 w-full">
      <h1 className="font-bold text-[#f9f9fa] text-2xl tracking-wide">
        Calorimetry
      </h1>
      <button 
        className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#373b3d] transition-colors cursor-pointer"
        aria-label="Close"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="#f9f9fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default Header;
