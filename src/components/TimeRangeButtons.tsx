import React from 'react';

interface TimeRangeButtonsProps {
  value: string;
  onChange: (value: string) => void;
}

const timeRangeOptions = ['30 min', '1 h', '2 h', '3 h', '6 h'];

const TimeRangeButtons: React.FC<TimeRangeButtonsProps> = ({ value, onChange }) => {
  return (
    <div className="flex rounded-[1px] overflow-hidden border border-[#525457] shrink-0">
      {timeRangeOptions.map((option, index) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`flex-1 h-[66px] flex items-center justify-center px-2 text-lg transition-colors cursor-pointer
            ${value === option 
              ? 'bg-[#61587f] text-[#FAFBFD] font-bold' 
              : 'bg-[#373b3d] text-[#FAFBFD] hover:bg-[#4a4e50]'
            }
            ${index > 0 ? 'border-l border-[#525457]' : ''}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeButtons;
