import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const featureList = [
  "1000MBPS Internet Backup",
  "Air-Conditioned Environment",
  "Professional Gaming Chairs",
  "RGB Lighting Setup",
  "ASUS ROG Certified Rigs",
  "NVIDIA GeForce Gaming PCs",
  "Free Snacks & Beverages",
  "Bootcamp Room Available"
];

export const Features: React.FC = () => {
  return (
    <section className="py-12 md:py-24 bg-gg-dark relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden border border-gray-800 bg-gg-medium shadow-2xl relative">
          
          {/* Left Image Side */}
          <div className="w-full md:w-1/2 relative h-[300px] md:h-auto min-h-[300px] md:min-h-[500px] group bg-gray-900">
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
              alt="Gaming Cafe Interior" 
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gg-dark/50" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,217,255,0.1)_50%,transparent_100%)] bg-[length:100%_200%] animate-scan pointer-events-none" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQgMEgwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMjE3LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-30" />
          </div>

          {/* Right Content Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-heading font-bold mb-8 text-white"
            >
              PREMIUM <span className="text-gg-cyan">AMENITIES</span>
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              {featureList.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start group cursor-default"
                >
                  <CheckCircle2 className="text-gg-lime mr-3 w-5 h-5 group-hover:scale-125 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(204,255,0,0.5)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-gray-300 font-sans group-hover:text-gg-cyan transition-colors duration-300 leading-tight">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};