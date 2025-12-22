import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Gamepad, Lock, Armchair, MoveHorizontal, Cpu, Zap } from 'lucide-react';

interface Seat {
  id: string;
  label: string;
  type: 'PC' | 'CONSOLE';
  tierId: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  x: number;
  y: number;
  rotation?: number;
  specs: string; // Added specs field
}

const SEAT_LAYOUT: Seat[] = [
  // --- PC ARENA (Left Side) ---
  { id: 'PC-01', label: 'VIP-1', type: 'PC', tierId: 'high', status: 'AVAILABLE', x: 2, y: 2, rotation: 0, specs: 'RTX 4090 | i9-14900K | 360Hz' },
  { id: 'PC-02', label: 'VIP-2', type: 'PC', tierId: 'high', status: 'OCCUPIED', x: 3, y: 2, rotation: 0, specs: 'RTX 4090 | i9-14900K | 360Hz' },
  { id: 'PC-03', label: 'VIP-3', type: 'PC', tierId: 'high', status: 'AVAILABLE', x: 4, y: 2, rotation: 0, specs: 'RTX 4080 | i7-13700K | 240Hz' },
  { id: 'PC-04', label: 'VIP-4', type: 'PC', tierId: 'high', status: 'AVAILABLE', x: 5, y: 2, rotation: 0, specs: 'RTX 4080 | i7-13700K | 240Hz' },
  
  { id: 'PC-05', label: 'STD-1', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 2, y: 5, rotation: 180, specs: 'RTX 3070 | i5-13600 | 165Hz' },
  { id: 'PC-06', label: 'STD-2', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 3, y: 5, rotation: 180, specs: 'RTX 3070 | i5-13600 | 165Hz' },
  { id: 'PC-07', label: 'STD-3', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 4, y: 5, rotation: 180, specs: 'RTX 3060 | i5-12400 | 144Hz' },
  { id: 'PC-08', label: 'STD-4', type: 'PC', tierId: 'mid', status: 'MAINTENANCE', x: 5, y: 5, rotation: 180, specs: 'RTX 3060 | i5-12400 | 144Hz' },
  
  { id: 'PC-09', label: 'STD-5', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 2, y: 6, rotation: 0, specs: 'RTX 3060 | i5-12400 | 144Hz' },
  { id: 'PC-10', label: 'STD-6', type: 'PC', tierId: 'mid', status: 'OCCUPIED', x: 3, y: 6, rotation: 0, specs: 'RTX 3060 | i5-12400 | 144Hz' },
  { id: 'PC-11', label: 'STD-7', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 4, y: 6, rotation: 0, specs: 'RTX 3060 | i5-12400 | 144Hz' },
  { id: 'PC-12', label: 'STD-8', type: 'PC', tierId: 'mid', status: 'AVAILABLE', x: 5, y: 6, rotation: 0, specs: 'RTX 3060 | i5-12400 | 144Hz' },

  // --- CONSOLE LOUNGE (Right Side) ---
  { id: 'PS-01', label: 'PS5-A', type: 'CONSOLE', tierId: 'ps4', status: 'AVAILABLE', x: 10, y: 2, rotation: -90, specs: 'PS5 Pro | 4K OLED TV' },
  { id: 'PS-02', label: 'PS5-B', type: 'CONSOLE', tierId: 'ps4', status: 'OCCUPIED', x: 10, y: 4, rotation: -90, specs: 'PS5 Slim | 4K HDR TV' },
  { id: 'PS-03', label: 'PS5-C', type: 'CONSOLE', tierId: 'ps4', status: 'AVAILABLE', x: 10, y: 6, rotation: -90, specs: 'Xbox Series X | 120Hz TV' },
];

interface SeatMapProps {
  selectedSeatId: string | null;
  onSeatSelect: (seatId: string, tierId: string) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({ selectedSeatId, onSeatSelect }) => {
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Responsive Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-between items-center bg-gg-dark/50 p-2 md:p-3 rounded-lg border border-gray-800 text-[10px] md:text-xs font-mono">
         <div className="flex gap-3 md:gap-4">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-gg-medium border border-gg-cyan/50 shadow-[0_0_5px_rgba(0,217,255,0.3)]" /> 
              <span className="text-gray-400">Open</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-red-900/30 border border-red-900/50" /> 
              <span className="text-gray-500">Booked</span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-white border border-white" /> 
              <span className="text-white font-bold">Selected</span>
            </div>
         </div>
         <div className="flex gap-2 text-[9px] md:text-[10px] uppercase tracking-wider opacity-60">
             <span className="flex items-center text-gg-cyan"><Monitor size={10} className="mr-1 md:w-3 md:h-3"/> PC</span>
             <span className="flex items-center text-gg-purple"><Gamepad size={10} className="mr-1 md:w-3 md:h-3"/> PS5</span>
         </div>
      </div>

      {/* 2. Scrollable Map Container */}
      <div className="relative w-full rounded-xl border border-gray-800 bg-[#0B0E1E] shadow-inner overflow-hidden">
        
        {/* Mobile Swipe Hint - Optimized for visibility */}
        <div className="absolute inset-0 z-30 pointer-events-none md:hidden flex items-center justify-center opacity-0 animate-[fadeOut_2s_ease-out_forwards] delay-1000">
            <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-white/90 border border-white/10 shadow-xl">
                <MoveHorizontal size={16} className="animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest">SWIPE MAP</span>
            </div>
        </div>

        {/* Scrollable Area - touch-action: pan-x/y for better scrolling */}
        <div className="w-full overflow-x-auto pb-4 custom-scrollbar relative z-10 touch-pan-x touch-pan-y">
            {/* 
              Min-width adjusted for optimal viewing.
            */}
            <div className="min-w-[600px] md:min-w-full aspect-[16/9] md:aspect-[21/9] relative p-4 md:p-6 select-none">
                
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.03)_1px,transparent_1px)] bg-[length:100px_100px] pointer-events-none" />

                {/* --- ZONES --- */}
                {/* PC Zone */}
                <div className="absolute left-2 md:left-4 top-4 bottom-16 w-[60%] rounded-2xl border-2 border-gg-cyan/10 bg-gg-cyan/5 pointer-events-none">
                    <div className="absolute -top-3 left-4 md:left-6 px-2 bg-[#0B0E1E] text-gg-cyan/70 text-[9px] md:text-[10px] font-bold tracking-widest uppercase border border-gg-cyan/20 rounded">
                        PC ARENA
                    </div>
                </div>

                {/* Console Zone */}
                <div className="absolute right-2 md:right-4 top-4 bottom-16 w-[30%] rounded-2xl border-2 border-gg-purple/10 bg-gg-purple/5 pointer-events-none">
                    <div className="absolute -top-3 right-4 md:right-6 px-2 bg-[#0B0E1E] text-gg-purple/70 text-[9px] md:text-[10px] font-bold tracking-widest uppercase border border-gg-purple/20 rounded">
                        PS5 LOUNGE
                    </div>
                </div>

                {/* --- SEAT GRID --- */}
                <div className="relative w-full h-full z-10" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(12, 1fr)', 
                    gridTemplateRows: 'repeat(8, 1fr)', 
                    gap: '4px md:gap-8px' // Adjusted gap for better density on mobile vs desktop
                }}>
                    {SEAT_LAYOUT.map((seat) => {
                    const isSelected = selectedSeatId === seat.id;
                    const isOccupied = seat.status === 'OCCUPIED';
                    const isMaintenance = seat.status === 'MAINTENANCE';
                    const isDisabled = isOccupied || isMaintenance;

                    return (
                        <div key={seat.id} className="relative group/seat" style={{ gridColumn: seat.x, gridRow: seat.y, gridRowEnd: seat.type === 'CONSOLE' ? 'span 2' : undefined }}>
                            <motion.button
                            onClick={() => !isDisabled && onSeatSelect(seat.id, seat.tierId)}
                            onMouseEnter={() => setHoveredSeat(seat)}
                            onMouseLeave={() => setHoveredSeat(null)}
                            whileTap={!isDisabled ? { scale: 0.9 } : {}}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * (seat.x + seat.y), type: 'spring' }}
                            // Added touch-manipulation to remove 300ms delay
                            // Added min-height/width for better touch target
                            className={`relative w-full h-full flex flex-col items-center justify-center rounded-lg transition-all duration-300 touch-manipulation
                                ${isSelected 
                                ? 'bg-white text-gg-dark ring-4 ring-gg-cyan/30 z-20 shadow-[0_0_20px_white]' 
                                : isDisabled 
                                    ? 'bg-red-900/10 border border-red-900/20 text-red-900/50 cursor-not-allowed'
                                    : `bg-gg-medium/80 border text-gray-400 hover:text-white hover:border-${seat.tierId === 'high' || seat.type === 'CONSOLE' ? 'gg-purple' : 'gg-cyan'} hover:bg-gg-medium active:bg-gg-medium/90`
                                }
                                ${!isSelected && !isDisabled ? (seat.tierId === 'high' ? 'border-gg-purple/30 text-gg-purple/70' : 'border-gg-cyan/20 text-gg-cyan/70') : ''}
                            `}
                            style={{
                                minHeight: '44px', // Increased touch target size
                                minWidth: '44px'   // Increased touch target size
                            }}
                            aria-label={`${seat.label} - ${seat.status}`}
                            >
                            {/* Seat Content */}
                            <div className="relative flex flex-col items-center pointer-events-none" style={{ transform: `rotate(${seat.rotation}deg)` }}>
                                {isMaintenance ? (
                                <Lock size={14} className="md:w-4 md:h-4" />
                                ) : seat.type === 'CONSOLE' ? (
                                <div className="flex flex-col items-center">
                                    <div className={`w-6 md:w-8 h-1 mb-1 rounded-full ${isSelected ? 'bg-gg-dark' : 'bg-current opacity-50'}`} />
                                    <Armchair size={20} className="md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>
                                ) : (
                                <>
                                    <div className={`w-5 md:w-6 h-1 mb-0.5 rounded-full ${isSelected ? 'bg-gg-dark' : 'bg-current opacity-50'}`} />
                                    <Monitor size={16} className="md:w-5 md:h-5" strokeWidth={1.5} />
                                    <div className={`w-3 md:w-4 h-0.5 mt-0.5 rounded-full ${isSelected ? 'bg-gg-dark' : 'bg-current opacity-30'}`} />
                                </>
                                )}
                            </div>

                            {/* Label - Larger on Mobile */}
                            <div className={`absolute -bottom-4 md:-bottom-5 text-[8px] md:text-[10px] font-bold font-mono whitespace-nowrap px-1 md:px-1.5 py-0.5 rounded ${isSelected ? 'bg-gg-dark text-white' : 'bg-gg-dark/80 text-gray-500'} pointer-events-none z-20`}>
                                {seat.label}
                            </div>
                            </motion.button>

                            {/* HOVER TOOLTIP (SPECS) */}
                            <AnimatePresence>
                                {hoveredSeat?.id === seat.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-32 bg-gg-dark/95 border border-gg-cyan/30 rounded-lg p-2 shadow-xl backdrop-blur-md pointer-events-none hidden md:block"
                                    >
                                        <div className="text-[10px] font-bold text-white mb-1 border-b border-gray-700 pb-1 flex justify-between">
                                            <span>{seat.label}</span>
                                            <span className={seat.status === 'AVAILABLE' ? 'text-gg-lime' : 'text-red-500'}>
                                                {seat.status === 'AVAILABLE' ? 'OPEN' : 'BUSY'}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-1.5 text-[9px] text-gray-300 font-mono mb-1">
                                            <Cpu size={10} className="mt-0.5 text-gg-purple" />
                                            <span className="leading-tight">{seat.specs.split('|')[0]}</span>
                                        </div>
                                        <div className="flex items-start gap-1.5 text-[9px] text-gray-300 font-mono">
                                            <Zap size={10} className="mt-0.5 text-gg-cyan" />
                                            <span className="leading-tight">{seat.specs.split('|')[2] || '60Hz'}</span>
                                        </div>
                                        {/* Little Arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gg-dark/95" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};