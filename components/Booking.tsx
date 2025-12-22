import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Monitor, Gamepad, User, Phone, CheckCircle, Loader2, CreditCard, Clock, Zap, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, animate, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { SeatMap } from './SeatMap';
import { Booking as BookingType } from '../types';

const WHATSAPP_NUMBER = "918888237925";
const LOCAL_STORAGE_KEY = 'ggwellplayed_bookings';

const TIERS = [
  { 
    id: 'mid', 
    name: 'Standard PC', 
    type: 'PC', 
    basePrice: 50, 
    label: 'Mid-End 144Hz', 
    borderColor: 'border-gg-purple', 
    glowColor: 'shadow-gg-purple/50',
    textColor: 'text-gg-purple',
    accent: '#9D00FF'
  },
  { 
    id: 'high', 
    name: 'Elite PC', 
    type: 'PC', 
    basePrice: 70, 
    label: 'High-End 240Hz', 
    borderColor: 'border-gg-cyan', 
    glowColor: 'shadow-gg-cyan/50',
    textColor: 'text-gg-cyan',
    accent: '#00D9FF'
  },
  { 
    id: 'ps4', 
    name: 'PS5 Console', 
    type: 'CONSOLE', 
    basePrice: 100, 
    label: 'Console PS5', 
    borderColor: 'border-gg-pink', 
    glowColor: 'shadow-gg-pink/50',
    textColor: 'text-gg-pink',
    accent: '#FF006E'
  },
];

const DURATIONS = [
  { id: 1, label: '1H', fullLabel: '1 Hour', value: 1, multiplier: 1 },
  { id: 3, label: '3H', fullLabel: '3 Hours', value: 3, multiplier: 3.0 },
  { id: 6, label: '6H', fullLabel: '6 Hours', value: 6, multiplier: 5.5, isBestValue: true },
  { id: 8, label: '8H', fullLabel: '8 Hours', value: 8, multiplier: 7.0 },
];

// --- UTILITY: GENERATE TIME SLOTS (9:30 AM to 10:00 PM) ---
const generateTimeSlots = () => {
  const slots: string[] = [];
  const startHour = 9;
  const startMin = 30;
  const endHour = 22; // 10 PM

  let currentH = startHour;
  let currentM = startMin;

  while (currentH < endHour || (currentH === endHour && currentM === 0)) {
    const period = currentH >= 12 ? 'PM' : 'AM';
    let displayH = currentH > 12 ? currentH - 12 : currentH;
    if (displayH === 0) displayH = 12; // Handle 12 PM/AM edge case if needed, though loop starts at 9
    
    const displayM = currentM === 0 ? '00' : currentM;
    
    slots.push(`${displayH}:${displayM} ${period}`);

    currentM += 30;
    if (currentM === 60) {
      currentM = 0;
      currentH++;
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// --- ANIMATED COUNTER COMPONENT ---
const PriceCounter = ({ value, color }: { value: number, color: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
    const controls = animate(count, value, { 
        duration: 0.8, 
        ease: "circOut",
        onComplete: () => setIsAnimating(false)
    });
    return controls.stop;
  }, [value, count]);

  return (
    <motion.span 
        className="inline-block transition-colors duration-200"
        style={{ 
            color: isAnimating ? color : '#FFFFFF',
            textShadow: isAnimating ? `0 0 15px ${color}` : 'none'
        }}
    >
        {rounded}
    </motion.span>
  );
};

export const Booking: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  
  const [selectedTier, setSelectedTier] = useState(TIERS[0]);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1]); // Default 3H
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(150);
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'REDIRECTING'>('IDLE');

  // Calculate price when tier or duration changes
  useEffect(() => {
    setTotalPrice(Math.ceil(selectedTier.basePrice * selectedDuration.multiplier));
  }, [selectedTier, selectedDuration]);

  // Listen for 'selectBookingTier' event from Pricing component
  useEffect(() => {
    const handleTierSelect = (e: CustomEvent) => {
        const tierId = e.detail;
        const tier = TIERS.find(t => t.id === tierId);
        if (tier) setSelectedTier(tier);
    };
    window.addEventListener('selectBookingTier', handleTierSelect as EventListener);
    return () => window.removeEventListener('selectBookingTier', handleTierSelect as EventListener);
  }, []);

  const handleSeatSelect = (seatId: string, tierId: string) => {
    setSelectedSeatId(seatId);
    // Auto-select the corresponding tier
    const tier = TIERS.find(t => t.id === tierId);
    if (tier) {
        setSelectedTier(tier);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !bookingDate || !bookingTime || !selectedSeatId) {
        alert("Please fill in all details, select a date/time, and choose a seat.");
        return;
    }

    setStatus('PROCESSING');

    setTimeout(() => {
        const fullDateTime = `${bookingDate} ${bookingTime}`;
        
        const newBooking: BookingType = {
            id: `BK-${Date.now().toString().slice(-6)}`,
            customerName,
            phoneNumber,
            date: fullDateTime,
            platform: selectedTier.name,
            duration: selectedDuration.fullLabel,
            price: totalPrice,
            timestamp: Date.now(),
            status: 'CONFIRMED'
        };

        try {
            const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
            const bookings = existing ? JSON.parse(existing) : [];
            bookings.push(newBooking);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
            window.dispatchEvent(new Event('bookingUpdated'));
            
            setStatus('REDIRECTING');
            
            const message = `*NEW BOOKING REQUEST*%0A------------------%0A👤 Name: ${customerName}%0A📱 Phone: ${phoneNumber}%0A📅 Date: ${bookingDate}%0A⏰ Time: ${bookingTime}%0A🎮 Seat: ${selectedSeatId}%0A⚙️ Rig: ${selectedTier.name}%0A⏱️ Duration: ${selectedDuration.fullLabel}%0A💰 Total: ₹${totalPrice}`;
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                setCustomerName('');
                setPhoneNumber('');
                setBookingDate('');
                setBookingTime('');
                setSelectedSeatId(null);
                setStatus('IDLE');
            }, 1500);

        } catch (error) {
            console.error("Booking Error", error);
            setStatus('IDLE');
            alert("Error saving booking locally.");
        }
    }, 2000);
  };

  return (
    <section id="booking" className="py-12 md:py-24 bg-gg-dark relative w-full overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8 md:mb-10"
            >
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-2">
                    BOOK YOUR <span className="text-gg-cyan">SESSION</span>
                </h2>
                <p className="text-gray-400 font-mono text-xs md:text-sm">Select your rig from the map below or fill out the form directly.</p>
            </motion.div>

            <div className="flex flex-col xl:flex-row gap-6 md:gap-8 items-start">
                
                {/* LEFT: INTERACTIVE MAP (Interactive floor plan) */}
                <div className="w-full xl:w-7/12 order-1">
                    <div className="bg-[#0B0E1E] border border-gray-800 rounded-xl p-1 shadow-2xl relative overflow-hidden group">
                        {/* Header Bar */}
                        <div className="bg-gg-medium/50 px-4 py-3 border-b border-gray-800 flex justify-between items-center rounded-t-lg">
                             <div className="flex items-center gap-2 text-gg-cyan font-heading font-bold tracking-wider text-xs md:text-sm">
                                <Monitor size={14} className="md:w-4 md:h-4" /> INTERACTIVE FLOOR PLAN
                             </div>
                             <div className="flex gap-1.5 md:gap-2">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gg-cyan animate-pulse" />
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gg-purple animate-pulse delay-75" />
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gg-pink animate-pulse delay-150" />
                             </div>
                        </div>
                        
                        {/* Map Container - Ensuring robust scrolling and container containment */}
                        <div className="p-2 md:p-6 bg-gg-dark/50 relative min-h-[350px] md:min-h-[450px]">
                             <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
                             {/* SeatMap handles its own horizontal overflow, parent ensures containment */}
                             <SeatMap selectedSeatId={selectedSeatId} onSeatSelect={handleSeatSelect} />
                             <p className="mt-4 text-[10px] text-gray-500 font-mono flex items-center gap-2 justify-center md:justify-start">
                                <Zap size={10} className="text-gg-lime" />
                                Click a seat to automatically select platform.
                             </p>
                        </div>
                        
                        {/* Animated Border Gradient */}
                        <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none bg-gradient-to-b from-gg-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ maskImage: 'linear-gradient(black, transparent)' }} />
                    </div>
                </div>

                {/* RIGHT: BOOKING FORM */}
                <div className="w-full xl:w-5/12 order-2">
                    <div className="bg-[#0B0E1E] border border-gray-800 rounded-xl p-5 md:p-8 shadow-2xl relative">
                        {/* Status Overlay */}
                        <AnimatePresence>
                            {status !== 'IDLE' && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-gg-dark/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center rounded-xl border border-gg-cyan/30"
                                >
                                    {status === 'PROCESSING' ? (
                                        <>
                                            <div className="relative mb-6">
                                                <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
                                                <div className="w-16 h-16 rounded-full border-4 border-t-gg-cyan border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                                                <Loader2 className="absolute inset-0 m-auto text-gg-cyan w-8 h-8 animate-pulse" />
                                            </div>
                                            <h4 className="text-xl font-heading font-bold text-white mb-2 tracking-widest">INITIALIZING</h4>
                                            <p className="text-xs text-gg-cyan font-mono animate-pulse">Establishing secure uplink...</p>
                                        </>
                                    ) : (
                                        <>
                                            <motion.div 
                                                initial={{ scale: 0 }} 
                                                animate={{ scale: 1, rotate: 360 }} 
                                                className="w-20 h-20 bg-gg-lime/10 rounded-full flex items-center justify-center mb-6 border border-gg-lime/50 shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                                            >
                                                <CheckCircle className="w-10 h-10 text-gg-lime" />
                                            </motion.div>
                                            <h4 className="text-2xl font-heading font-bold text-white mb-2">ACCESS GRANTED</h4>
                                            <p className="text-xs text-gray-400 font-mono">Redirecting to payment gateway...</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            
                            {/* 1. PERSONAL DETAILS */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <div className="group">
                                    <label className="text-[10px] font-mono text-gray-500 uppercase font-bold mb-1.5 flex items-center gap-1">
                                        <User size={10} /> Name
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="Enter your name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        // CRITICAL: text-base prevents iOS zoom on focus
                                        className="w-full bg-gg-dark border border-gray-700 rounded p-2.5 md:p-3 text-base text-white focus:border-gg-cyan focus:shadow-[0_0_10px_rgba(0,217,255,0.2)] outline-none transition-all placeholder-gray-600 font-sans"
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-[10px] font-mono text-gray-500 uppercase font-bold mb-1.5 flex items-center gap-1">
                                        <Phone size={10} /> Phone
                                    </label>
                                    <input 
                                        type="tel"
                                        required
                                        placeholder="10-digit number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        // CRITICAL: text-base prevents iOS zoom on focus
                                        className="w-full bg-gg-dark border border-gray-700 rounded p-2.5 md:p-3 text-base text-white focus:border-gg-cyan focus:shadow-[0_0_10px_rgba(0,217,255,0.2)] outline-none transition-all placeholder-gray-600 font-sans"
                                    />
                                </div>
                            </div>

                            {/* 2. DATE & TIME SELECT (12h FORMAT) */}
                            <div>
                                <label className="text-[10px] font-mono text-gg-cyan uppercase font-bold mb-1.5 flex items-center gap-1">
                                    <Calendar size={10} /> Date & Time Slot
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Date Input */}
                                    <div className="relative">
                                        <input 
                                            type="date"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            className="w-full bg-gg-dark border border-gray-700 rounded p-2.5 md:p-3 text-sm md:text-base text-white focus:border-gg-cyan outline-none transition-all font-mono appearance-none [color-scheme:dark]"
                                        />
                                    </div>
                                    
                                    {/* Time Dropdown (12h format) */}
                                    <div className="relative">
                                        <select
                                            required
                                            value={bookingTime}
                                            onChange={(e) => setBookingTime(e.target.value)}
                                            className="w-full bg-gg-dark border border-gray-700 rounded p-2.5 md:p-3 text-sm md:text-base text-white focus:border-gg-cyan outline-none transition-all font-mono appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Time</option>
                                            {TIME_SLOTS.map((slot) => (
                                                <option key={slot} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-500 mt-1 font-mono pl-1">
                                    *Hours: 09:30 AM - 10:00 PM
                                </p>
                            </div>

                            {/* 3. PLATFORM SELECT */}
                            <div>
                                <label className="text-[10px] font-mono text-gg-purple uppercase font-bold mb-2 flex items-center gap-1">
                                    <Monitor size={10} /> Platform
                                </label>
                                <div className="flex flex-col gap-2 md:gap-3">
                                    {TIERS.map((tier) => {
                                        const isSelected = selectedTier.id === tier.id;
                                        return (
                                            <button
                                                key={tier.id}
                                                type="button"
                                                onClick={() => setSelectedTier(tier)}
                                                className={`relative w-full p-2.5 md:p-3 rounded-lg border transition-all duration-300 flex justify-between items-center group overflow-hidden ${
                                                    isSelected 
                                                    ? `${tier.borderColor} bg-gg-dark ${tier.glowColor} shadow-md` 
                                                    : 'border-gray-800 bg-gg-dark/50 hover:border-gray-600'
                                                }`}
                                            >
                                                {/* Active Indicator Bar */}
                                                {isSelected && (
                                                    <motion.div 
                                                        layoutId="activePlatform"
                                                        className={`absolute left-0 top-0 bottom-0 w-1 ${tier.textColor.replace('text-', 'bg-')}`} 
                                                    />
                                                )}
                                                
                                                <div className="flex items-center gap-3 relative z-10 pl-2">
                                                    <div className={`text-base md:text-lg ${isSelected ? tier.textColor : 'text-gray-500'} group-hover:scale-110 transition-transform`}>
                                                        {tier.type === 'PC' ? <Monitor size={18} className="md:w-5 md:h-5" /> : <Gamepad size={18} className="md:w-5 md:h-5" />}
                                                    </div>
                                                    <span className={`font-bold text-xs md:text-sm tracking-wide text-left ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                                        {tier.label}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] md:text-xs font-mono relative z-10 flex items-center gap-2">
                                                    <span className={`${isSelected ? tier.textColor : 'text-gray-600'}`}>₹{tier.basePrice}/hr</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 4. DURATION SELECT */}
                            <div>
                                <label className="text-[10px] font-mono text-gg-lime uppercase font-bold mb-2 flex items-center gap-1">
                                    <Clock size={10} /> Duration
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {DURATIONS.map((dur) => {
                                        const isSelected = selectedDuration.id === dur.id;
                                        return (
                                            <button
                                                key={dur.id}
                                                type="button"
                                                onClick={() => setSelectedDuration(dur)}
                                                className={`relative py-3 md:py-4 rounded-lg border text-xs md:text-base font-bold transition-all duration-200 overflow-hidden ${
                                                    isSelected
                                                    ? 'border-gg-lime text-gg-lime bg-gg-lime/10 shadow-[0_0_10px_rgba(204,255,0,0.2)]'
                                                    : 'border-gray-800 bg-gg-dark/50 text-gray-500 hover:text-white hover:border-gray-600'
                                                }`}
                                            >
                                                {dur.label}
                                                {dur.isBestValue && (
                                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-gg-red rounded-full flex items-center justify-center animate-pulse">
                                                        <span className="w-full h-full rounded-full bg-gg-red opacity-75 animate-ping absolute" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 5. PRICE HUD PANEL - Auto Optimized for Screen Size */}
                            <div className="bg-[#15192C] rounded-xl p-4 md:p-5 border border-gray-800 relative overflow-hidden mt-4 group hover:border-gray-700 transition-colors">
                                {/* Background Grid Texture */}
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:8px_8px]" />
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-1">
                                         <h5 className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">Estimated Total</h5>
                                         <div className="w-1.5 h-1.5 bg-gg-red rounded-full animate-pulse shadow-[0_0_5px_red]" />
                                    </div>
                                    
                                    {/* Responsive Price Display */}
                                    <div className="flex items-baseline mb-4 md:mb-6 flex-wrap">
                                        <span className={`text-xl md:text-2xl mr-1 md:mr-2 font-mono ${selectedTier.textColor}`}>₹</span>
                                        {/* THE PRICE COUNTER WITH COLOR ANIMATION */}
                                        <span className="text-4xl md:text-6xl font-heading font-black tracking-tighter drop-shadow-lg">
                                            <PriceCounter value={totalPrice} color={selectedTier.accent} />
                                        </span>
                                    </div>

                                    <div className="space-y-1.5 md:space-y-2 border-t border-gray-700/50 pt-2 md:pt-3">
                                        <div className="flex justify-between text-[10px] md:text-xs font-mono text-gray-400">
                                            <span>Platform Rate</span>
                                            <span className="text-white">₹{selectedTier.basePrice}/hr</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] md:text-xs font-mono text-gray-400">
                                            <span>Duration</span>
                                            <span className="text-white">{selectedDuration.fullLabel}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] md:text-xs font-mono">
                                            <span className="text-gg-lime">Multiplier</span>
                                            <span className="text-gg-lime font-bold">x{selectedDuration.multiplier}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={status !== 'IDLE'}
                                className="w-full py-3 md:py-4 bg-gradient-to-r from-gg-cyan to-gg-purple text-white font-heading font-black text-base md:text-lg uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed clip-path-slant relative group overflow-hidden border border-white/10"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    CONFIRM BOOKING <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>

                            <p className="text-[8px] md:text-[9px] text-gray-600 text-center font-mono">
                                By clicking confirm, you will be redirected to WhatsApp to finalize your payment and slot.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};