import React, { useRef, useCallback, useEffect, useState } from 'react';

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
  const dragType = useRef<'move' | 'resize-left' | 'resize-right'>('move');
  const initialMouseX = useRef(0);
  const initialStartPercent = useRef(0);
  const initialEndPercent = useRef(0);
  const [activeEdge, setActiveEdge] = useState<'left' | 'right' | null>(null);

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const deltaX = clientX - initialMouseX.current;
    const deltaPercent = (deltaX / containerWidth) * 100;

    if (dragType.current === 'move') {
      const newStartPercent = clamp(initialStartPercent.current + deltaPercent, 0, 100 - selectorWidthPercent);
      const newEndPercent = newStartPercent + selectorWidthPercent;
      onWindowChange?.(newStartPercent, newEndPercent);
    } else if (dragType.current === 'resize-left') {
      const newStartPercent = clamp(initialStartPercent.current + deltaPercent, 0, initialEndPercent.current - 1);
      onWindowChange?.(newStartPercent, initialEndPercent.current);
    } else if (dragType.current === 'resize-right') {
      const newEndPercent = clamp(initialEndPercent.current + deltaPercent, initialStartPercent.current + 1, 100);
      onWindowChange?.(initialStartPercent.current, newEndPercent);
    }
  }, [selectorWidthPercent, onWindowChange]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) updatePosition(e.clientX);
    };
    const handleMouseUp = () => { 
      isDragging.current = false;
      setActiveEdge(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [updatePosition]);

  const handleMoveMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragType.current = 'move';
    initialMouseX.current = e.clientX;
    initialStartPercent.current = startPercent;
    initialEndPercent.current = startPercent + selectorWidthPercent;
    e.preventDefault();
  };

  const handleLeftResizeMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragType.current = 'resize-left';
    initialMouseX.current = e.clientX;
    initialStartPercent.current = startPercent;
    initialEndPercent.current = startPercent + selectorWidthPercent;
    setActiveEdge('left');
    e.stopPropagation();
    e.preventDefault();
  };

  const handleRightResizeMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragType.current = 'resize-right';
    initialMouseX.current = e.clientX;
    initialStartPercent.current = startPercent;
    initialEndPercent.current = startPercent + selectorWidthPercent;
    setActiveEdge('right');
    e.stopPropagation();
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
          borderLeft: `2px solid ${activeEdge === 'left' ? '#ffffff' : '#b39cf1'}`,
          borderRight: `2px solid ${activeEdge === 'right' ? '#ffffff' : '#b39cf1'}`,
        }}
        onMouseDown={handleMoveMouseDown}
      >
        {/* Left handle */}
        <div 
          className={`absolute left-0 top-full -translate-x-1/2 w-3 h-3 rounded-full cursor-ew-resize ${activeEdge === 'left' ? 'bg-white' : 'bg-[#b39cf1]'}`}
          onMouseDown={handleLeftResizeMouseDown}
        />
        {/* Right handle */}
        <div 
          className={`absolute right-0 top-full translate-x-1/2 w-3 h-3 rounded-full cursor-ew-resize ${activeEdge === 'right' ? 'bg-white' : 'bg-[#b39cf1]'}`}
          onMouseDown={handleRightResizeMouseDown}
        />
      </div>
    </div>
  );
};

export default DisclosureSelector;
