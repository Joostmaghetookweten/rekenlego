import React from 'react';

// Dit component tekent een 'blokje' met nopjes
const LegoBlock = ({ number, color = 'bg-lego-blue' }) => {
  // We maken een array van lege items ter grootte van het getal (bijv. 4 items)
  const dots = Array.from({ length: number });

  // Bepaal de breedte op basis van het getal (voor 1 of 2 is het smal, voor meer is het breder)
  // Even getallen krijgen een 2-breedte grid, oneven passen we aan.
  const isEven = number % 2 === 0;
  const gridUX = number <= 2 ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <div className={`${color} p-2 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.2)] inline-block transform transition-transform hover:scale-105`}>
      <div className={`grid ${gridUX} gap-1`}>
        {dots.map((_, i) => (
          <div 
            key={i} 
            className="w-4 h-4 rounded-full bg-black/20 shadow-inner"
            title="nopje"
          />
        ))}
      </div>
      {/* Toon het cijfer ook klein in het blokje ter ondersteuning */}
      <div className="text-white font-bold text-center text-xs mt-1 drop-shadow-md">
        {number}
      </div>
    </div>
  );
};

export default LegoBlock;