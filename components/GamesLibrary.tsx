import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';

// Official Game Cover Art (Steam Library Vertical Assets & Twitch Box Art)
const games = [
  { 
    title: "Valorant", 
    genre: "Tac-Shooter", 
    // Official Twitch Box Art
    img: "https://static-cdn.jtvnw.net/ttv-boxart/516575-600x800.jpg" 
  },
  { 
    title: "Counter-Strike 2", 
    genre: "FPS", 
    // Official Steam Library Asset
    img: "https://steamcdn-a.akamaihd.net/steam/apps/730/library_600x900.jpg" 
  },
  { 
    title: "Forza Horizon 5", 
    genre: "Racing", 
    // Official Steam Library Asset
    img: "https://steamcdn-a.akamaihd.net/steam/apps/1551360/library_600x900.jpg" 
  },
  { 
    title: "Dota 2", 
    genre: "MOBA", 
    // Official Steam Library Asset
    img: "https://steamcdn-a.akamaihd.net/steam/apps/570/library_600x900.jpg" 
  },
  { 
    title: "Call of Duty: MW3", 
    genre: "FPS / Warzone", 
    // Official Steam Library Asset
    img: "https://steamcdn-a.akamaihd.net/steam/apps/2519060/library_600x900.jpg" 
  },
  { 
    title: "Apex Legends", 
    genre: "Battle Royale", 
    // Official Steam Library Asset
    img: "https://steamcdn-a.akamaihd.net/steam/apps/1172470/library_600x900.jpg" 
  },
  { 
    title: "Tekken 8", 
    genre: "Fighting", 
    // Official Steam Library Asset
    img: "https://steamcdn-a.akamaihd.net/steam/apps/1778820/library_600x900.jpg" 
  },
  { 
    title: "EA SPORTS FC™ 24", 
    genre: "Sports", 
    // Official Steam Library Asset
    img: "https://steamcdn-a.akamaihd.net/steam/apps/2195250/library_600x900.jpg" 
  },
  { 
    title: "Cyberpunk 2077", 
    genre: "RPG", 
    // Official Steam Library Asset
    img: "https://steamcdn-a.akamaihd.net/steam/apps/1091500/library_600x900.jpg" 
  }
];

const GameCard: React.FC<{ game: typeof games[0] }> = ({ game }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative flex-shrink-0 w-36 h-56 md:w-64 md:h-96 rounded-xl cursor-pointer touch-manipulation group"
    >
      <TiltCard 
        className="w-full h-full rounded-xl overflow-hidden border border-gray-800 shadow-lg bg-gray-900 transition-all duration-300 group-hover:border-gg-cyan group-hover:shadow-[0_0_30px_rgba(0,217,255,0.6)]"
        glowColor="#00D9FF"
      >
        {/* Background placeholder if image loads slow */}
        <div className="absolute inset-0 bg-gray-800" />
        
        <img 
          src={game.img} 
          alt={game.title} 
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover relative z-0 transition-all duration-700 group-hover:scale-110 ${
            isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
          }`}
          loading="lazy" 
          decoding="async"
        />
        
        {/* 
           Gradient Overlay:
           - Stronger gradient (opacity-100) at bottom to ensure white text is readable 
             against colorful official game covers.
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-gg-dark via-transparent to-transparent opacity-90 transition-opacity duration-300 z-10" />
        
        {/* 
           Text Content:
           - Neon accent on hover
           - Strong text shadow for readability
        */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20">
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-gg-lime mb-1 block drop-shadow-[0_2px_2px_rgba(0,0,0,1)] group-hover:text-gg-cyan transition-colors">
            {game.genre}
          </span>
          <h3 className="text-sm md:text-lg font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,1)] group-hover:text-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {game.title}
          </h3>
        </div>
      </TiltCard>
    </motion.div>
  );
};

export const GamesLibrary: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-gg-dark overflow-hidden">
      <div className="container mx-auto px-4 mb-8 md:mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">INSTALLED & READY</h2>
        <div className="w-16 md:w-24 h-1 bg-gg-purple mx-auto rounded-full" />
      </div>

      <div className="relative w-full">
        {/* Continuous scroll effect */}
        <motion.div 
          className="flex space-x-4 md:space-x-6 px-4 will-change-transform touch-pan-x"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          style={{ width: "fit-content" }}
          whileHover={{ animationPlayState: "paused" }}
          whileTap={{ animationPlayState: "paused" }}
        >
          {/* Duplicated list for infinite scroll - Using unique keys to prevent React warnings */}
          {[...games, ...games].map((game, index) => (
            <GameCard key={`${game.title}-${index}`} game={game} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};