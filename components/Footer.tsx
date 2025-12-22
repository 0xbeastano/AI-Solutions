import React from 'react';
import { Twitter, Instagram, Youtube, Facebook, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const triggerDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event('toggleAdminDashboard'));
  };

  const socialLinks = [
    { icon: Instagram, label: "Instagram", url: "https://www.instagram.com/ggwellplayedcafe/" },
    { icon: Youtube, label: "YouTube", url: "https://www.youtube.com/c/GGwellplayed" },
    { icon: Facebook, label: "Facebook", url: "https://www.facebook.com/ggwellplayedgamingcafe/" }
  ];

  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const footerLinks = [
    { label: 'Home', id: 'home' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Games', id: 'games' },
    { label: 'Features', id: 'features' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <footer className="bg-gg-medium pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Adjusted Grid: 3 columns for better spacing after removing newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-16 mb-12 text-center md:text-left justify-items-center md:justify-items-start">
          
          {/* Branding & Socials */}
          <div className="space-y-6 flex flex-col items-center md:items-start w-full">
            <div className="flex flex-col gap-2 select-none">
              <div className="flex flex-col leading-none">
                <span className="font-heading font-black text-2xl tracking-widest text-white italic flex gap-2 shadow-black drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] justify-center md:justify-start">
                  GG <span className="text-gg-cyan drop-shadow-[0_0_10px_rgba(0,217,255,0.8)]">WELLPLAYED</span>
                </span>
                <span className="text-[10px] font-mono text-gray-400 tracking-[0.3em] uppercase mt-1">
                  Premium Esports Arena
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Level up your gaming experience with top-tier rigs, tournaments, and a community that plays to win.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item, i) => (
                <a 
                  key={i} 
                  href={item.url}
                  target={item.url !== '#' ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${item.label}`}
                  className="w-10 h-10 rounded-full bg-gg-dark flex items-center justify-center text-gray-400 hover:text-gg-cyan hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gg-cyan border border-gray-700 hover:border-gg-cyan/50"
                >
                  <item.icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full">
            <h3 className="font-heading font-bold text-white mb-6 uppercase tracking-wider text-lg border-b border-gg-cyan/30 pb-2 inline-block md:block md:border-none md:pb-0">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <button 
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-gg-cyan transition-colors relative group focus:text-gg-cyan focus:outline-none flex items-center justify-center md:justify-start gap-2 mx-auto md:mx-0"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gg-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full">
            <h3 className="font-heading font-bold text-white mb-6 uppercase tracking-wider text-lg border-b border-gg-purple/30 pb-2 inline-block md:block md:border-none md:pb-0">Get In Touch</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex flex-col items-center md:items-start gap-1">
                <span className="text-gg-purple font-bold font-mono text-xs uppercase">Location</span>
                <span>Satara Rd, Pune, Maharashtra<br/>Kojagiri Building, 2nd Floor</span>
              </li>
              <li className="flex flex-col items-center md:items-start gap-1">
                 <span className="text-gg-purple font-bold font-mono text-xs uppercase">Phone</span>
                 <span className="hover:text-white transition-colors cursor-pointer">+91 98765 43210</span>
              </li>
              <li className="flex flex-col items-center md:items-start gap-1">
                 <span className="text-gg-purple font-bold font-mono text-xs uppercase">Hours</span>
                 <span>09:00 AM - 10:00 PM Daily</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs md:text-sm font-mono gap-4">
          <p>© 2025 GGwellplayed Gaming Cafe. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <a href="#" className="hover:text-gg-cyan transition-colors focus:text-gg-cyan focus:outline-none">Privacy Policy</a>
            <a href="#" className="hover:text-gg-cyan transition-colors focus:text-gg-cyan focus:outline-none">Terms of Service</a>
            {/* Staff Access Button */}
            <button 
              onClick={triggerDashboard}
              className="flex items-center hover:text-gg-red transition-colors opacity-60 hover:opacity-100 focus:opacity-100 focus:outline-none gap-1 bg-gray-800/50 px-2 py-1 rounded border border-gray-700"
            >
              <Lock size={10} aria-hidden="true" /> Staff Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};