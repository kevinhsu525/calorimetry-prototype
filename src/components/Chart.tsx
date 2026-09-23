import React, { ReactNode } from 'react';

interface ChartProps {
  title: string;
  unit: string;
  maxValue: number | string;
  midValue: number | string;
  minValue: number | string;
  pathData: string;
  viewBoxHeight: number;
  showUnit?: boolean;
  compact?: boolean;
  overlay?: ReactNode;
  timeLabels?: string[];
  showTimeLabels?: boolean;
}

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function generateTimeLabels(windowStartPercent: number, windowEndPercent: number): string[] {
  // Calculate times based on 24h window
  const now = new Date();
  const totalMs = 24 * 60 * 60 * 1000; // 24 hours in ms
  
  const startTime = new Date(now.getTime() - totalMs + (windowStartPercent / 100) * totalMs);
  const endTime = new Date(now.getTime() - totalMs + (windowEndPercent / 100) * totalMs);
  const midTime = new Date((startTime.getTime() + endTime.getTime()) / 2);
  
  const startStr = formatTime(startTime);
  const midStr = formatTime(midTime);
  const endStr = formatTime(endTime);
  
  return [startStr, midStr, endStr];
}

const Chart: React.FC<ChartProps> = ({ 
  title, 
  unit, 
  maxValue, 
  midValue, 
  minValue, 
  pathData, 
  viewBoxHeight,
  compact = false,
  overlay,
  timeLabels,
  showTimeLabels = false
}) => {
  // Determine if we should show time labels
  const shouldShowLabels = !compact || showTimeLabels;
  
  // Generate labels
  let labels: string[];
  if (timeLabels && timeLabels.length >= 3) {
    labels = [timeLabels[0], '', timeLabels[1], '', timeLabels[2]];
  } else if (timeLabels && timeLabels.length === 2) {
    labels = [timeLabels[0], '', '', '', timeLabels[1]];
  } else {
    labels = ['15:30', '21:30', '03 Mar', '09:30', '15:30'];
  }

  return (
    <div className="flex gap-3 items-start w-full">
      {/* Title block */}
      <div className="flex flex-col gap-1 w-[90px] shrink-0 text-left pt-1">
        <span className="text-[#f9f9fa] text-[22px] leading-7">{title}</span>
        <span className="text-[#babdc0] text-lg leading-6">{unit}</span>
      </div>

      {/* Chart area */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className={`flex gap-1 items-center ${compact ? 'h-[90px]' : 'h-[92px]'}`}>
          {/* Y-axis labels */}
          <div className={`flex flex-col items-end justify-between w-6 shrink-0 text-[#babdc0] text-sm ${compact ? 'h-[94px]' : 'h-[96px]'}`}>
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
                <path d={pathData} stroke="#00FF00" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
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

            {/* Overlay (e.g., TimeWindowSelector) */}
            {overlay && (
              <div className="absolute inset-0 z-[5]">
                {overlay}
              </div>
            )}
          </div>
        </div>

        {shouldShowLabels && (
          <div className="flex justify-between pl-6 text-[#babdc0] text-sm">
            {labels.map((label, index) => (
              <span key={index} className="leading-5">{label}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { generateTimeLabels };
export default Chart;
