import React, { useState, useRef, useCallback, useEffect } from 'react';

interface TimeWindowSelectorProps {
  selectorWidthPercent: number;
  onWindowChange?: (startPercent: number, endPercent: number) => void;
}

const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({
  selectorWidthPercent,
  onWindowChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startPercent, setStartPercent] = useState<number>(100 - selectorWidthPercent);
  const isDragging = useRef(false);
  const initialMouseX = useRef(0);
  const initialStartPercent = useRef(0);

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const deltaX = clientX - initialMouseX.current;
    const deltaPercent = (deltaX / containerWidth) * 100;

    const newStartPercent = clamp(initialStartPercent.current + deltaPercent, 0, 100 - selectorWidthPercent);
    const newEndPercent = newStartPercent + selectorWidthPercent;

    setStartPercent(newStartPercent);
    onWindowChange?.(newStartPercent, newEndPercent);
  }, [selectorWidthPercent, onWindowChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        updatePosition(e.clientX);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [updatePosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    initialMouseX.current = e.clientX;
    initialStartPercent.current = startPercent;
    e.preventDefault();
  };

  // When selector width changes, adjust start position
  useEffect(() => {
    setStartPercent(prev => {
      const newStart = 100 - selectorWidthPercent;
      return Math.min(prev, newStart);
    });
  }, [selectorWidthPercent]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-[4] pointer-events-none"
    >
      {/* Selection overlay */}
      <div
        className="absolute top-0 h-full pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{
          left: `${startPercent}%`,
          width: `${selectorWidthPercent}%`,
          backgroundColor: 'rgba(179, 156, 241, 0.25)',
          borderLeft: '2px solid #b39cf1',
          borderRight: '2px solid #b39cf1',
        }}
        onMouseDown={handleMouseDown}
      />

      {/* Selection Fan - connects selection to lower chart area */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '100%',
          left: 0,
          width: '100%',
          height: '48px',
          zIndex: 3,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon
            points={`${startPercent},0 ${startPercent + selectorWidthPercent},0 100,100 0,100`}
            fill="rgba(179, 156, 241, 0.35)"
          />
        </svg>
      </div>
    </div>
  );
};

export default TimeWindowSelector;
