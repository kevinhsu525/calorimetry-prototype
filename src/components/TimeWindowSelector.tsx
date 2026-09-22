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
  const dragType = useRef<'move' | 'left' | 'right'>('move');
  const initialMouseX = useRef(0);
  const initialStartPercent = useRef(0);

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const deltaX = clientX - initialMouseX.current;
    const deltaPercent = (deltaX / containerWidth) * 100;

    let newStartPercent: number;
    let newEndPercent: number;

    if (dragType.current === 'move') {
      newStartPercent = clamp(initialStartPercent.current + deltaPercent, 0, 100 - selectorWidthPercent);
      newEndPercent = newStartPercent + selectorWidthPercent;
    } else if (dragType.current === 'left') {
      newStartPercent = clamp(initialStartPercent.current + deltaPercent, 0, startPercent + selectorWidthPercent - 5);
      newEndPercent = startPercent + selectorWidthPercent;
    } else {
      // right
      newEndPercent = clamp(initialStartPercent.current + selectorWidthPercent + deltaPercent, startPercent + 5, 100);
      newStartPercent = startPercent;
    }

    setStartPercent(newStartPercent);
    onWindowChange?.(newStartPercent, newEndPercent);
  }, [selectorWidthPercent, onWindowChange, startPercent]);

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

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'left' | 'right') => {
    isDragging.current = true;
    dragType.current = type;
    initialMouseX.current = e.clientX;
    initialStartPercent.current = startPercent;
    e.preventDefault();
  };

  // When selector width changes, adjust start position to keep right edge aligned
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
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
        {/* Left handle */}
        <div
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-6 bg-[#b39cf1] rounded-full pointer-events-auto cursor-ew-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'left');
          }}
        />
        {/* Right handle */}
        <div
          className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-6 bg-[#b39cf1] rounded-full pointer-events-auto cursor-ew-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown(e, 'right');
          }}
        />
      </div>
    </div>
  );
};

export default TimeWindowSelector;
