import React from 'react';

interface DynamicTimeAxisProps {
  windowStart: number; // 0-100
  windowEnd: number;   // 0-100
}

function formatDateTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatShortDate(date: Date): string {
  const day = date.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  return `${day} ${month}`;
}

const DynamicTimeAxis: React.FC<DynamicTimeAxisProps> = ({ windowStart, windowEnd }) => {
  // Calculate times based on 24h window
  const now = new Date();
  const totalMs = 24 * 60 * 60 * 1000; // 24 hours in ms
  const baseTime = new Date(now.getTime() - totalMs);

  // Calculate 5 time points based on selector position (windowStart to windowEnd)
  const timePoints = [0, 0.25, 0.5, 0.75, 1].map(fraction => {
    const percent = windowStart + fraction * (windowEnd - windowStart);
    const time = new Date(baseTime.getTime() + (percent / 100) * totalMs);
    return time;
  });

  return (
    <div className="flex flex-col gap-1">
      {/* Time labels */}
      <div className="flex justify-between text-[#babdc0] text-sm">
        {timePoints.map((time, index) => (
          <span key={index} className="leading-5">
            {index === 2 ? formatShortDate(time) : formatDateTime(time)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DynamicTimeAxis;
