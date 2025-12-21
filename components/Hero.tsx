import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface VideoConfig {
  id: string;
  src: string;
  poster: string;
  alt: string;
}

const VIDEOS: VideoConfig[] = [
  {
    id: 'fps-gameplay',
    // Futuristic HUD / FPS Style
    src: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-interface-hud-scanning-data-3174-large.mp4",
    poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop", 
    alt: "Tactical FPS Gameplay"
  },
  {
    id: 'racing-gameplay',
    // High speed tunnel (Racing feel)
    src: "https://assets.mixkit.co/videos/preview/mixkit-abstract-tunnel-with-blue-lights-2572-large.mp4",
    poster: "https://images.unsplash.com/photo-1547924667-62ca45b7e2a8?q=80&w=1600&auto=format&fit=crop", 
    alt: "High Speed Racing Simulator"
  },
  {
    id: 'rpg-gameplay',
    // Cyberpunk City (Open World feel)
    src: "https://assets.mixkit.co/videos/preview/mixkit-purple-and-blue-lights-in-a-cyberpunk-city-4037-large.mp4", 
    poster: "https://images.unsplash.com/photo-1533972724312-6eaf65e81882?q=80&w=1600&auto=format&fit=crop", 
    alt: "Open World RPG Atmosphere"
  }
];

// --- SYNCED GLITCH COMPONENT ---
const GlitchTextWrapper = ({ children, className = "", isOutline = false }: { children?: React.ReactNode, className?: string, isOutline?: boolean }) => {
  return (
    <motion.div 
      className={`relative inline-block cursor-default ${className}`}
      initial="initial"
      whileHover="hover"
      whileTap="hover" // Enable glitch on tap for mobile
      style={{ transform: "translateZ(0)" }}
    >
      {/* Base Layer */}
      <motion.div
        variants={{
          initial: { x: 0, skewX: 0, textShadow: "0px 0px 0px transparent" },
          hover: {
            x: [0, -2, 2, 0],
            skewX: [0, 5, -5, 0],
            textShadow: [
              "0px 0px 0px transparent",
              "-2px 0px 0px #00D9FF, 2px 0px 0px #FF006E",
              "0px 0px 0px transparent"
            ],
            transition: { duration: 0.2, repeat: Infinity, repeatType: "mirror" }
          }
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Ghost Layer */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0 select-none pointer-events-none"
        variants={{
          initial: { opacity: 0, x: 0, display: "none" },
          hover: {
            opacity: [0, 0.6, 0],
            x: [0, -5, 5, 0],
            skewX: [0, 20, -20, 0],
            display: "block",
            transition: { duration: 0.2, repeat: Infinity, repeatType: "mirror" }
          }
        }}
        style={{ 
          color: isOutline ? '#00D9FF' : undefined,
          WebkitTextStroke: isOutline ? '0px' : undefined
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Advanced Particle Definition
interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string; // RGB values only (e.g. "0, 217, 255")
  depth: number; // 0.1 (background) to 1.0 (foreground)
}

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isInView = useInView(containerRef);
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 200]);
  
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Robust Video Handling
  const handleVideoLoaded = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
        // Mobile optimization: If hidden, don't force play
        if (window.innerWidth < 768 && index > 0) return;
        
        video.play().then(() => {
            video.style.opacity = '1';
        }).catch((e) => {
            console.warn("Autoplay prevented:", e);
        });
    }
  };

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      // Mobile optimization: Pause videos that are hidden via CSS
      if (window.innerWidth < 768 && idx > 0) {
        video.pause();
        return;
      }

      if (isInView) {
        if (video.paused && video.readyState >= 3) {
             video.play().catch(() => {});
        }
      } else {
        video.pause();
      }
    });
  }, [isInView]);

  // --- ADVANCED PARTICLE SYSTEM ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Configuration
    // Performance: Significantly reduce particles on mobile
    const PARTICLE_COUNT = window.innerWidth < 768 ? 25 : 80;
    const CONNECTION_DISTANCE = window.innerWidth < 768 ? 100 : 120; 
    const PARALLAX_STRENGTH = 0.04; 

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const depth = Math.random() * 0.8 + 0.2; 
        const x = Math.random() * width;
        const y = Math.random() * height;
        const isCyan = Math.random() > 0.5;
        
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.5 * (1 + depth),
          vy: (Math.random() - 0.5) * 0.5 * (1 + depth),
          size: (Math.random() * 2 + 0.5) * depth,
          color: isCyan ? '0, 217, 255' : '157, 0, 255',
          depth
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      const targetOffsetX = (mouseRef.current.x - centerX) * PARALLAX_STRENGTH;
      const targetOffsetY = (mouseRef.current.y - centerY) * PARALLAX_STRENGTH;

      particles.forEach((p, i) => {
        p.baseX += p.vx;
        p.baseY += p.vy;

        if (p.baseX < -50) p.baseX = width + 50;
        if (p.baseX > width + 50) p.baseX = -50;
        if (p.baseY < -50) p.baseY = height + 50;
        if (p.baseY > height + 50) p.baseY = -50;

        // Mobile optimization: Reduce complex math if possible, but simple parallax is fine
        p.x = p.baseX - (targetOffsetX * p.depth);
        p.y = p.baseY - (targetOffsetY * p.depth);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.depth * 0.8 + 0.2})`; 
        
        // Performance: Only glow on high-end or desktop (approximated by width)
        if (width > 768 && p.depth > 0.6) {
             ctx.shadowBlur = 10 * p.depth;
             ctx.shadowColor = `rgb(${p.color})`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            if (Math.abs(dx) > CONNECTION_DISTANCE || Math.abs(dy) > CONNECTION_DISTANCE) continue;
            
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < CONNECTION_DISTANCE) {
                ctx.beginPath();
                const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.25 * Math.min(p.depth, p2.depth);
                
                ctx.strokeStyle = `rgba(${p.color}, ${alpha})`;
                ctx.lineWidth = 1 * Math.min(p.depth, p2.depth);
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Optional: Disable mouse tracking on mobile to save battery since touch doesn't trigger hover same way
    if (window.innerWidth < 768) return;

    const { clientX, clientY } = e;
    if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${clientY}px`);
    }
    mouseRef.current = { x: clientX, y: clientY };
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col items-center justify-center text-center bg-gg-dark perspective-1000 px-4 touch-manipulation"
    >
      {/* LAYER 1: BACKGROUND GRID (IMAGES + VIDEOS) */}
      <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-3 pointer-events-none bg-black">
        {VIDEOS.map((video, idx) => (
          // PERFORMANCE: On mobile (idx > 0), hide the extra videos completely to save rendering resources
          <div key={video.id} className={`relative w-full h-full overflow-hidden border-b md:border-b-0 md:border-r border-gg-cyan/20 group ${idx > 0 ? 'hidden md:block' : ''}`}>
            
            {/* 1. Background Image Layer */}
            <img 
              src={video.poster}
              alt={video.alt}
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105 filter brightness-75"
              loading="eager"
            />
            
            {/* 2. Video Layer */}
            <video
              ref={el => { videoRefs.current[idx] = el }}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10"
              style={{ opacity: 0 }} 
              muted
              loop
              playsInline
              preload="auto"
              onLoadedData={() => handleVideoLoaded(idx)}
            >
              <source src={video.src} type="video/mp4" />
            </video>
            
            {/* 3. Scanline & Overlays */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
            <div className="absolute inset-0 bg-gg-dark/30 mix-blend-multiply z-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-gg-dark/90 via-transparent to-gg-dark/90 z-20" />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-gg-cyan/50 transition-colors duration-500 z-30 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* LAYER 1.5: PARTICLE SYSTEM CANVAS */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-[15] pointer-events-none"
      />

      {/* LAYER 2: SPOTLIGHT (Desktop Only) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(circle 600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 217, 255, 0.05) 0%, rgba(0, 0, 0, 0.4) 100%)`,
        }}
      />

      {/* LAYER 3: MAIN CONTENT */}
      <motion.div 
        style={{ y: yText, z: 20 }}
        className="relative flex flex-col items-center justify-center w-full max-w-full mx-auto z-20"
      >
        <div className="relative mb-8 w-full flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-8 select-none">
            <GlitchTextWrapper>
              <h1 className="font-heading font-black tracking-tighter leading-none text-white drop-shadow-2xl
                  text-[25vw] sm:text-[20vw] lg:text-[14rem] xl:text-[16rem]
                  bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400
              ">
                GG
              </h1>
            </GlitchTextWrapper>

            <GlitchTextWrapper isOutline>
              <h1 className="font-heading font-black tracking-tighter leading-none
                  text-[12vw] sm:text-[10vw] lg:text-[7rem] xl:text-[8rem]
                  text-transparent relative
              "
              style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.9)' }}
              >
                WELL
                <br className="lg:hidden" />
                PLAYED
              </h1>
            </GlitchTextWrapper>
        </div>
        
        <div className="w-48 md:w-96 h-1 bg-gradient-to-r from-transparent via-gg-cyan to-transparent mb-8 animate-pulse" />

        {/* TAGLINE */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 0.8 }}
           className="relative px-4 py-3 md:px-6 md:py-4 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] max-w-[95vw]"
        >
           <p className="font-mono text-[10px] sm:text-sm md:text-lg tracking-wide text-center font-bold flex flex-wrap justify-center items-center gap-x-2 md:gap-x-3 gap-y-2 uppercase">
              <span className="text-gg-cyan drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]">High-End PCs</span>
              <span className="text-gray-600 align-middle">•</span>
              <span className="text-gg-purple drop-shadow-[0_0_8px_rgba(157,0,255,0.6)]">PS5 Consoles</span>
              <span className="hidden sm:inline text-gray-600 align-middle">•</span>
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">240Hz Monitors</span>
           </p>
        </motion.div>

        {/* ACTION BUTTON */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 md:mt-12 group relative inline-flex items-center justify-center min-w-[200px] min-h-[56px] px-8 md:px-12 py-3 md:py-4 font-heading font-bold text-gg-dark bg-gg-cyan clip-path-slant hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all duration-300 touch-manipulation"
        >
            <span className="relative flex items-center gap-3 text-lg md:text-xl tracking-widest uppercase">
                Reserve Slot
                <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
            </span>
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/70 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase animate-pulse">Scroll</span>
        <div className="w-px h-12 md:h-16 bg-gradient-to-b from-gg-cyan to-transparent" />
      </motion.div>
    </section>
  );
};