import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useAnimation, Variants, useSpring, useMotionValue } from 'framer-motion';
import { Cpu, Zap, Wifi, MapPin, ShieldCheck, Crosshair, Clock, Users } from 'lucide-react';

// --- ASSETS & LINKS ---
const HERO_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-abstract-tunnel-with-blue-lights-2572-large.mp4";
const HERO_POSTER = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop";

const MAPS_LINK = "https://www.google.com/maps/place/GGwellplayed+Gaming+Cafe/@18.4612294,73.855768,17z/data=!3m2!4b1!5s0x3bc2eab8c0ba027d:0x3c4c2bf374284859!4m6!3m5!1s0x3bc2eab8a395f5e7:0xdb3f6dd31ef1a76e!8m2!3d18.4612294!4d73.8583429!16s%2Fg%2F11f121p_h0?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D";
const INSTA_LINK = "https://www.instagram.com/ggwellplayedcafe/";
const YT_LINK = "https://www.youtube.com/c/GGwellplayed";

// --- UTILITY COMPONENTS ---

// Custom Brand Icons
const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#insta-gradient)" />
    <path d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM12 15.2C10.2327 15.2 8.8 13.7673 8.8 12C8.8 10.2327 10.2327 8.8 12 8.8C13.7673 8.8 15.2 10.2327 15.2 12C15.2 13.7673 13.7673 15.2 12 15.2Z" fill="white" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
    <defs>
      <linearGradient id="insta-gradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f09433" />
        <stop offset="0.25" stopColor="#e6683c" />
        <stop offset="0.5" stopColor="#dc2743" />
        <stop offset="0.75" stopColor="#cc2366" />
        <stop offset="1" stopColor="#bc1888" />
      </linearGradient>
    </defs>
  </svg>
);

const YouTubeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
    </svg>
);

// 1. Precise Star Rating Component (Animated)
const StarRating = ({ rating = 4.8 }: { rating?: number }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1">
      {stars.map((star, i) => {
        let fillPercentage = 0;
        if (rating >= star) {
          fillPercentage = 100;
        } else if (rating > star - 1) {
          fillPercentage = (rating - (star - 1)) * 100;
        }
        return (
          <motion.div 
            key={star} 
            className="relative w-3 h-3 md:w-4 md:h-4"
            variants={{
              hover: {
                scale: [1, 1.3, 1],
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                transition: { duration: 0.4, delay: i * 0.05 }
              }
            }}
          >
            <svg className="w-full h-full text-gray-700" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
               <svg className="w-full h-full text-gg-lime drop-shadow-[0_0_5px_rgba(204,255,0,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
               </svg>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// 2. Glitch Text Effect
const GlitchTextWrapper = ({ children, className = "", isOutline = false }: { children?: React.ReactNode, className?: string, isOutline?: boolean }) => {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const triggerGlitch = async () => {
      if (!isHovered) {
        await controls.start("glitch");
        controls.start("idle");
      }
    };
    const interval = setInterval(triggerGlitch, 5000 + Math.random() * 3000); 
    const startUp = async () => {
        await controls.start("powerOn");
        controls.start("idle");
    };
    startUp();
    return () => clearInterval(interval);
  }, [controls, isHovered]);

  const wrapperVariants: Variants = {
    powerOn: {
      opacity: [0, 1],
      filter: ["brightness(0) blur(10px)", "brightness(1) blur(0px)"],
      scale: [0.95, 1],
      transition: { duration: 0.8, ease: "circOut" }
    },
    idle: {
      scale: 1,
      filter: "brightness(1) blur(0px)",
      textShadow: isOutline 
        ? ["0 0 0px rgba(0,217,255,0)"]
        : ["0 0 20px rgba(255,255,255,0.1)"],
      transition: { duration: 0.5 }
    },
    glitch: {
      x: [0, -2, 2, 0],
      y: [0, 1, -1, 0],
      filter: ["brightness(1)", "hue-rotate(0deg)", "hue-rotate(90deg)", "brightness(1)"],
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.02,
      // Create a chaotic neon flicker
      textShadow: [
        "0 0 8px rgba(0,217,255,0.8), 2px 2px 0px rgba(255,0,60,0.5)",
        "0 0 20px rgba(157,0,255,0.8), -2px -2px 0px rgba(204,255,0,0.5)",
        "0 0 8px rgba(0,217,255,0.8), 2px 2px 0px rgba(255,0,60,0.5)"
      ],
      filter: ["brightness(1) contrast(1)", "brightness(1.4) contrast(1.2)", "brightness(1) contrast(1)"],
      x: [0, -1, 1, 0], // Micro-shake
      transition: { 
        duration: 0.1, 
        repeat: Infinity,
        repeatType: "mirror" 
      }
    }
  };

  return (
    <motion.div 
      className={`relative inline-block cursor-default ${className}`}
      initial="powerOn"
      animate={controls}
      whileHover="hover"
      whileTap="glitch"
      onHoverStart={() => { setIsHovered(true); controls.start("hover"); }}
      onHoverEnd={() => { setIsHovered(false); controls.start("idle"); }}
    >
      <motion.div variants={wrapperVariants} className="relative z-20">
        {children}
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-10 opacity-0 mix-blend-screen"
        animate={isHovered ? { opacity: 0.5, x: -3 } : { opacity: 0 }}
        style={{ color: '#00D9FF' }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-10 opacity-0 mix-blend-screen"
        animate={isHovered ? { opacity: 0.5, x: 3 } : { opacity: 0 }}
        style={{ color: '#FF003C' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// 3. Stat Bar (Weapon Stats Style)
const StatBar = ({ label, value, max, color = "bg-gg-cyan" }: { label: string, value: string, max: number, color?: string }) => {
    return (
        <div className="mb-3 group cursor-default">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] font-mono uppercase text-gray-400 group-hover:text-white transition-colors">{label}</span>
                <span className={`text-xs font-bold ${color.replace('bg-', 'text-')}`}>{value}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-sm overflow-hidden flex gap-0.5">
                {[...Array(10)].map((_, i) => (
                     <div 
                        key={i}
                        className={`h-full flex-1 rounded-sm transition-all duration-500 ${i < max ? color : 'bg-transparent'}`}
                        style={{ opacity: i < max ? 1 : 0.1 }}
                     />
                ))}
            </div>
        </div>
    );
};

// 4. Social Proof Hub (Enhanced)
const SocialHub = () => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1 }}
    className="flex flex-col md:flex-row gap-3 items-center justify-center lg:justify-start"
  >
    {/* Google Maps Badge (Interactive) */}
    <motion.a 
      href={MAPS_LINK}
      target="_blank"
      rel="noopener noreferrer"
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="inline-flex items-center gap-4 bg-gg-medium/50 backdrop-blur-md border border-gray-700 rounded-lg p-2 pr-6 group transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] hover:border-gg-cyan/50 hover:bg-gg-medium/80 w-full md:w-auto justify-center md:justify-start"
    >
      <motion.div 
        variants={{ hover: { rotate: [0, -10, 10, 0], transition: { duration: 0.5 } } }}
        className="bg-white p-2 rounded flex items-center justify-center shrink-0"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      </motion.div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-bold text-lg font-heading leading-none">4.8</span>
          <StarRating rating={4.8} />
        </div>
        <motion.div 
          variants={{ hover: { color: '#00D9FF' } }}
          className="text-[10px] text-gray-400 font-mono uppercase tracking-wide transition-colors flex items-center gap-1"
        >
          <ShieldCheck size={10} /> 344 Verified Reviews
        </motion.div>
      </div>
    </motion.a>

    {/* Static Social Counters with Original Logos & Full Text */}
    <div className="flex flex-row gap-2 w-full md:w-auto">
      <a href={INSTA_LINK} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-2 bg-gg-medium/50 border border-gray-700 rounded-lg hover:border-gg-pink/50 hover:bg-gg-pink/5 group transition-all">
        <div className="shrink-0 transition-transform group-hover:scale-110">
            <InstagramIcon />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold font-heading text-lg leading-none group-hover:text-gg-pink transition-colors">935</span>
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wide group-hover:text-white transition-colors leading-tight hidden sm:block">Instagram<br/>Followers</span>
        </div>
      </a>

      <a href={YT_LINK} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-2 bg-gg-medium/50 border border-gray-700 rounded-lg hover:border-red-500/50 hover:bg-red-500/5 group transition-all">
        <div className="shrink-0 transition-transform group-hover:scale-110">
            <YouTubeIcon />
        </div>
         <div className="flex flex-col">
          <span className="text-white font-bold font-heading text-lg leading-none group-hover:text-red-500 transition-colors">250</span>
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wide group-hover:text-white transition-colors leading-tight hidden sm:block">YouTube<br/>Subscribers</span>
        </div>
      </a>
    </div>
  </motion.div>
);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  // Parallax effect for the background video: moves slightly down as user scrolls
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]); 
  // Zoom-out effect: Scales from 1.25 down to 1.0 as user scrolls
  const scaleBg = useTransform(scrollY, [0, 1000], [1.25, 1.0]);

  const [isOpen, setIsOpen] = useState(false);

  // Check shop status (9 AM to 10 PM)
  useEffect(() => {
    const checkStatus = () => {
        const hour = new Date().getHours();
        setIsOpen(hour >= 9 && hour < 22);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every min
    return () => clearInterval(interval);
  }, []);

  // Ensure video playback and adjust rate
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = 0.75; 
        // Force play in case autoplay attribute is blocked by some policy without interaction
        videoRef.current.play().catch(e => console.log("Video autoplay blocked by browser policy, requires interaction"));
    }
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col lg:flex-row items-center bg-gg-dark px-4 md:px-0"
    >
      {/* 1. ATMOSPHERIC BACKGROUND WITH PARALLAX */}
      <motion.div 
        style={{ y: yBg, scale: scaleBg }} 
        className="absolute inset-0 z-0 h-[120%]" // Increased height to allow scrolling movement without showing bottom gap
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="auto"
          poster={HERO_POSTER}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        
        {/* Darker overlay on mobile for better text contrast */}
        <div className="absolute inset-0 bg-gg-dark/70 md:bg-gg-dark/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-gg-dark via-gg-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gg-dark via-transparent to-gg-dark/50" />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
      </motion.div>

      {/* 2. MAIN CONTENT CONTAINER */}
      <motion.div 
        style={{ y: yText }}
        // Adjusted padding: pb-32 on mobile/tablet to clear the Scroll Prompt, reset on LG
        // Padding top reduced to 24 (96px) on mobile for better view
        className="container relative z-20 mx-auto px-4 md:px-12 pt-24 md:pt-36 h-full flex flex-col justify-center items-center pb-20"
      >
        
        {/* CONTENT WRAPPER: SPLIT LAYOUT FOR TEXT & STATS */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0 mb-12">
            {/* LEFT COLUMN: THE MISSION BRIEF */}
            <div className="w-full lg:w-3/5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left pt-4 md:pt-0">
                
                {/* Status & Location Badge - Increased top margin for mobile navbar safety */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6"
                >
                    <div className={`px-3 py-1 border rounded flex items-center gap-2 ${isOpen ? 'bg-gg-lime/10 border-gg-lime/20 text-gg-lime' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-gg-lime' : 'bg-red-500'} animate-pulse shadow-[0_0_8px_currentColor]`} />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                            {isOpen ? "ARENA OPEN" : "ARENA CLOSED"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gg-cyan/10 border border-gg-cyan/20 rounded text-[10px] font-mono text-gg-cyan uppercase tracking-widest">
                        <MapPin size={12} />
                        PUNE // KATRAJ SECTOR
                    </div>
                </motion.div>

                {/* HEADLINE */}
                <div className="mb-6 relative z-30">
                    <GlitchTextWrapper>
                        {/* Responsive typography scaling: text-4xl on mobile, 6xl on tablet, 9xl on desktop */}
                        <h1 className="text-4xl sm:text-6xl lg:text-9xl font-heading font-black text-white leading-[0.9] tracking-tighter italic drop-shadow-2xl">
                            PUNE'S
                        </h1>
                    </GlitchTextWrapper>
                    <div className="h-2 md:h-4" /> 
                    <GlitchTextWrapper>
                        <h1 className="text-4xl sm:text-6xl lg:text-9xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-gg-cyan via-white to-gg-cyan leading-[0.9] tracking-tighter italic pb-2 pr-4 drop-shadow-[0_0_30px_rgba(0,217,255,0.4)]">
                            RANKED HQ
                        </h1>
                    </GlitchTextWrapper>
                </div>

                {/* SUB-LINE */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    // Reset border on mobile/tablet, add border on LG
                    className="text-gray-300 font-mono text-sm md:text-lg max-w-xl mb-8 leading-relaxed border-l-0 lg:border-l-2 border-gg-purple pl-0 lg:pl-4"
                >
                    Leave the lag at home. Step into a tournament-grade ecosystem built for one purpose: <strong className="text-white text-shadow-neon">Winning</strong>.
                </motion.p>

                {/* TRUST & SOCIALS */}
                <div className="mb-10 relative z-40 w-full">
                    <SocialHub />
                </div>
            </div>

            {/* RIGHT COLUMN: ARENA CAPABILITIES */}
            {/* Changed from 'hidden md:flex' to 'flex' to show on mobile. Added 'mt-12' for stacking separation. */}
            <div className="flex w-full lg:w-2/5 h-full items-center justify-center lg:justify-end mt-4 lg:mt-0">
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="w-full max-w-sm relative group"
                >
                    {/* Floating Animation */}
                    <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-[#0B0E1E]/80 backdrop-blur-xl border border-gg-cyan/30 p-1 rounded-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gg-cyan to-transparent opacity-50 animate-scan" />
                        
                        <div className="bg-gg-dark/60 rounded-lg p-6 border border-white/5 relative z-10">
                            {/* Header: Arena Specs */}
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                <div>
                                    <h3 className="text-white font-heading font-bold text-lg tracking-widest flex items-center gap-2">
                                        <Cpu className="text-gg-purple" size={18} /> ARENA SPECS
                                    </h3>
                                    <p className="text-[10px] text-gray-500 font-mono uppercase">SYSTEM CAPABILITIES</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-mono text-white bg-gg-purple/20 px-2 py-0.5 rounded border border-gg-purple/40">TIER 1</span>
                                </div>
                            </div>

                            {/* "Weapon Stats" Bars */}
                            <div className="space-y-4 mb-6">
                                <StatBar label="FPS POTENTIAL" value="500+" max={10} color="bg-gg-lime" />
                                <StatBar label="REFRESH RATE" value="240Hz" max={9} color="bg-gg-cyan" />
                                <StatBar label="NETWORK SPEED" value="1GBPS" max={8} color="bg-gg-purple" />
                                <StatBar label="ERGONOMICS" value="MAX" max={9} color="bg-gg-pink" />
                            </div>

                            {/* Promo / Squad Pack */}
                            <div className="bg-gradient-to-r from-gg-cyan/10 to-transparent rounded p-3 border-l-2 border-gg-cyan relative overflow-hidden group/promo cursor-pointer"
                                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <div className="text-[10px] text-gg-cyan font-bold font-mono uppercase mb-0.5 flex items-center gap-1">
                                            <Users size={12} /> SQUAD DEPLOY
                                        </div>
                                        <div className="text-white font-bold text-sm">BOOK 5 SEATS = 10% OFF</div>
                                    </div>
                                    <div className="h-8 w-8 bg-gg-cyan text-gg-dark rounded-full flex items-center justify-center font-bold">
                                        GO
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gg-cyan/5 group-hover/promo:bg-gg-cyan/20 transition-colors" />
                            </div>

                            {/* Decor Elements */}
                            <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
                                <Zap size={64} className="text-white" />
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Glow Effect behind card */}
                    <div className="absolute -inset-4 bg-gg-purple/10 blur-3xl rounded-full z-[-1] opacity-50 pointer-events-none group-hover:opacity-75 transition-opacity duration-500" />
                </motion.div>
            </div>
        </div>

        {/* CTA - CENTERED ON ALL SCREENS - Moved out of columns to center relative to viewport */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative z-40 w-full flex justify-center"
        >
            <button 
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative w-full sm:w-auto px-6 py-4 md:px-8 md:py-4 bg-gg-cyan text-gg-dark font-heading font-black text-lg tracking-wider uppercase clip-path-slant hover:bg-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
                BOOK SESSION <Crosshair size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
        </motion.div>

      </motion.div>

    </section>
  );
};