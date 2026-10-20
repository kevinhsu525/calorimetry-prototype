import React from 'react';

interface DynamicTimeAxisProps {
  windowStart: number; // 0-100
  windowEnd: number;   // 0-100
}

function formatTime(date: Date): string {
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
  // Fixed base time: March 2, 2024 15:30
  const baseTime = new Date('2024-03-02T15:30:00');
  const totalMs = 24 * 60 * 60 * 1000; // 24 hours

  // Calculate actual start/end time
  const startTime = new Date(baseTime.getTime() + (windowStart / 100) * totalMs);
  const endTime = new Date(baseTime.getTime() + (windowEnd / 100) * totalMs);
  const durationMs = endTime.getTime() - startTime.getTime();

  // Check if the window crosses midnight
  const startDate = startTime.toDateString();
  const endDate = endTime.toDateString();
  const crossesMidnight = startDate !== endDate;

  // Generate 5 time points within the selected window
  const timePoints = [0, 0.25, 0.5, 0.75, 1].map(fraction => {
    const time = new Date(startTime.getTime() + fraction * durationMs);
    return time;
  });

  return (
    <div className="flex flex-col gap-1">
      {/* Time labels - actual time within the 24h window */}
      <div className="flex justify-between text-[#babdc0] text-sm">
        {timePoints.map((time, index) => (
          <span key={index} className="leading-5">
            {index === 2 && crossesMidnight ? formatShortDate(time) : formatTime(time)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DynamicTimeAxis;
