import React from 'react';

interface DividerProps {
  vertical?: boolean;
}

const Divider: React.FC<DividerProps> = ({ vertical = false }) => {
  if (vertical) {
    return (
      <div className="w-px bg-[#373b3d] self-stretch" />
    );
  }

  return (
    <div className="w-full h-px bg-[#373b3d]" />
  );
};

export default Divider;
