import React, { useRef, useCallback, useEffect } from 'react';

interface DisclosureSelectorProps {
  startPercent: number;
  selectorWidthPercent: number;
  onWindowChange?: (startPercent: number, endPercent: number) => void;
}

const DisclosureSelector: React.FC<DisclosureSelectorProps> = ({
  startPercent,
  selectorWidthPercent,
  onWindowChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
    onWindowChange?.(newStartPercent, newEndPercent);
  }, [selectorWidthPercent, onWindowChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) updatePosition(e.clientX);
    };
    const handleMouseUp = () => { isDragging.current = false; };
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

  return (
    <div 
      ref={containerRef}
      className="absolute inset-y-0 z-[6] pointer-events-none"
      style={{ left: '130px', width: '413px' }}
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
      >
        {/* Left handle */}
        <div 
          className="absolute left-0 top-full -translate-x-1/2 w-3 h-3 bg-[#b39cf1] rounded-full"
        />
        {/* Right handle */}
        <div 
          className="absolute right-0 top-full translate-x-1/2 w-3 h-3 bg-[#b39cf1] rounded-full"
        />
      </div>
    </div>
  );
};

export default DisclosureSelector;
