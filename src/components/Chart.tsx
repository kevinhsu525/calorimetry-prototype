import React from 'react';

interface ChartProps {
  title: string;
  unit: string;
  maxValue: number | string;
  midValue: number | string;
  minValue: number | string;
  pathData: string;
  viewBoxHeight: number;
  showUnit?: boolean;
}

const Chart: React.FC<ChartProps> = ({ 
  title, 
  unit, 
  maxValue, 
  midValue, 
  minValue, 
  pathData, 
  viewBoxHeight 
}) => {
  return (
    <div className="flex gap-3 items-start w-full">
      {/* Title block */}
      <div className="flex flex-col gap-1 w-[90px] shrink-0 text-center pt-1">
        <span className="text-[#f9f9fa] text-[22px] leading-7">{title}</span>
        <span className="text-[#babdc0] text-lg leading-6">{unit}</span>
      </div>

      {/* Chart area */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex gap-1 h-[50px] items-center">
          {/* Y-axis labels */}
          <div className="flex flex-col h-[54px] items-end justify-between w-6 shrink-0 text-[#babdc0] text-sm">
            <span className="leading-5">{maxValue}</span>
            <span className="leading-5">{midValue}</span>
            <span className="leading-5 text-right w-full">{minValue}</span>
          </div>

          {/* Grid and waveform */}
          <div className="flex-1 flex flex-col h-full relative">
            {/* Waveform SVG */}
            <div className="absolute inset-0 z-[3] flex items-center">
              <svg 
                width="100%" 
                height={viewBoxHeight} 
                viewBox={`0 0 100 ${viewBoxHeight}`}
                className="w-full"
                preserveAspectRatio="none"
              >
                <path d={pathData} stroke="#b39cf1" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Grid lines */}
            <div className="flex-1 relative z-[2]">
              {/* Vertical grid lines */}
              <div className="absolute inset-0 flex justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-px h-full bg-[#525457]" />
                ))}
              </div>
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="w-full h-px bg-[#525457]" />
                <div className="w-full h-px bg-[#525457]" />
                <div className="w-full h-px bg-[#525457]" />
              </div>
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between pl-6 text-[#babdc0] text-sm">
          <span className="leading-5">15:30</span>
          <span className="leading-5">21:30</span>
          <span className="leading-5">03 Mar</span>
          <span className="leading-5">09:30</span>
          <span className="leading-5">15:30</span>
        </div>
      </div>
    </div>
  );
};

export default Chart;
