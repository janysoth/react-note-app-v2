import React from 'react';

interface TooltipProps {
  text: string;
  className?: string;
}

const Tooltip = ({ text, className }: TooltipProps) => {
  return (
    <span className={`u-triangle absolute top-1/2 left-full ml-2 transform -translate-y-1/2 text-xs text-white bg-[#3aafae] px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${className}`}>
      {text}
    </span>
  )
}

export default Tooltip