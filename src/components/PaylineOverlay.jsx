import React from 'react';

export default function PaylineOverlay({ showFor = [] }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {showFor.includes('middle') && (
        <div className="absolute top-1/2 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent transform -translate-y-1/2"></div>
      )}
      {showFor.includes('diag1') && (
        <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent transform -rotate-12 origin-left"></div>
      )}
      {showFor.includes('diag2') && (
        <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent transform rotate-12 origin-left"></div>
      )}
    </div>
  );
}