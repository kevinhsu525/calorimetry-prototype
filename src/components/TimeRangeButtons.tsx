import React from 'react';

interface TimeRangeButtonsProps {
  value: string;
  onChange: (value: string) => void;
}

const timeRangeOptions = ['30 min', '1 h', '2 h', '3 h', '6 h'];

const TimeRangeButtons: React.FC<TimeRangeButtonsProps> = ({ value, onChange }) => {
  return (
    <div className="flex rounded overflow-hidden border border-[#525457] shrink-0">
      {timeRangeOptions.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 h-[66px] flex items-center justify-center px-2 text-lg transition-colors cursor-pointer
            ${value === option 
              ? 'bg-[#61587f] text-[#fafbfd] font-bold' 
              : 'bg-[#373b3d] text-[#babdc0] hover:bg-[#4a4e50]'
            }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeButtons;
