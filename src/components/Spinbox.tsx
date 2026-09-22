import React, { useState } from 'react';

const Spinbox: React.FC = () => {
  const [value, setValue] = useState<string>('1 h');
  const timeOptions = ['30 min', '1 h', '2 h', '3 h', '6 h'];

  const handlePrev = () => {
    const currentIndex = timeOptions.indexOf(value);
    if (currentIndex > 0) {
      setValue(timeOptions[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = timeOptions.indexOf(value);
    if (currentIndex < timeOptions.length - 1) {
      setValue(timeOptions[currentIndex + 1]);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center border border-[#525457] rounded overflow-hidden shrink-0">
        {/* Left arrow */}
        <button 
          onClick={handlePrev}
          className="flex items-center justify-center h-[66px] w-[60px] bg-[#373b3d] hover:bg-[#4a4e50] transition-colors cursor-pointer"
          aria-label="Previous time range"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#f9f9fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Value display */}
        <div className="flex-1 flex items-center justify-center h-[66px] border-x border-[#525457] px-2">
          <span className="text-[#fafbfd] text-2xl text-center whitespace-nowrap">
            {value}
          </span>
        </div>

        {/* Right arrow */}
        <button 
          onClick={handleNext}
          className="flex items-center justify-center h-[66px] w-[60px] bg-[#373b3d] hover:bg-[#4a4e50] transition-colors cursor-pointer"
          aria-label="Next time range"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="#f9f9fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Spinbox;
