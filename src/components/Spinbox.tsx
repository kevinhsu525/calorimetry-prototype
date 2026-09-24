import React, { useState } from 'react';

interface SpinboxProps {
  value: number; // in minutes
  maxValue: number; // in minutes
  onChange: (value: number) => void;
}

const Spinbox: React.FC<SpinboxProps> = ({ value, maxValue, onChange }) => {
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);

  const handlePrev = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleNext = () => {
    if (value < maxValue) {
      onChange(value + 1);
    }
  };

  const formatValue = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) {
      return `${h} h`;
    }
    return `${h} h ${m} min`;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center border border-[#525457] rounded-[1px] overflow-hidden shrink-0">
        {/* Left arrow */}
        <button 
          onClick={handlePrev}
          disabled={value <= 1}
          onMouseDown={() => setLeftPressed(true)}
          onMouseUp={() => setLeftPressed(false)}
          onMouseLeave={() => setLeftPressed(false)}
          className={`flex items-center justify-center h-[66px] w-[60px] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${leftPressed ? 'bg-[#FAFBFD]' : 'bg-[#373b3d] hover:bg-[#4a4e50]'}`}
          aria-label="Decrease time range"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke={leftPressed ? "#141415" : "#f9f9fa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Value display */}
        <div className="flex-1 flex items-center justify-center h-[66px] border-x border-[#525457] px-2 bg-[#373b3d]">
          <span className="text-[#fafbfd] text-2xl text-center whitespace-nowrap">
            {formatValue(value)}
          </span>
        </div>

        {/* Right arrow */}
        <button 
          onClick={handleNext}
          disabled={value >= maxValue}
          onMouseDown={() => setRightPressed(true)}
          onMouseUp={() => setRightPressed(false)}
          onMouseLeave={() => setRightPressed(false)}
          className={`flex items-center justify-center h-[66px] w-[60px] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${rightPressed ? 'bg-[#FAFBFD]' : 'bg-[#373b3d] hover:bg-[#4a4e50]'}`}
          aria-label="Increase time range"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke={rightPressed ? "#141415" : "#f9f9fa"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Spinbox;
