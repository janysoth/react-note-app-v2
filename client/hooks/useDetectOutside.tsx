import React, { useEffect } from "react";

interface useDetectOutsideProps {
  ref: React.RefObject<HTMLDivElement | null>;
  callback: () => void;
}

function useDetectOutside({ ref, callback }: useDetectOutsideProps) {
  useEffect(() => {
    // Handler to detect clicks outside the ref
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target))
        callback();
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);

  return ref;
}

export default useDetectOutside;
