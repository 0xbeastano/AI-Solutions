import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: "Do I need to bring my own peripherals?",
    answer: "No! We provide high-end mechanical keyboards (Logitech/Razer), gaming mice, and headsets. However, you are welcome to bring your own mouse or controller if you prefer."
  },
  {
    question: "Can I log in to my own Steam/Epic account?",
    answer: "Yes, absolutely. We recommend using your own accounts to track progress. We also have 'Cafe Accounts' with premium games if you just want to try something new."
  },
  {
    question: "Is there food available?",
    answer: "We serve energy drinks, coffee, sodas, and packaged snacks (chips, noodles). For larger meals, we allow ordering from outside delivery apps to the lounge area."
  },
  {
    question: "How do I book for a tournament?",
    answer: "Tournament registrations are handled separately. Check our 'Tournaments' section or join our Discord server for registration links and bracket details."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gg-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gg-purple/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gg-cyan/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-white flex items-center justify-center gap-3">
            <HelpCircle className="text-gg-cyan" /> FREQUENTLY ASKED
          </h2>
        </div>

        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            const contentId = `faq-content-${index}`;
            const headerId = `faq-header-${index}`;

            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'bg-gg-medium border-gg-cyan/50 shadow-[0_0_15px_rgba(0,217,255,0.1)]' 
                    : 'bg-gg-medium/50 border-gray-800 hover:border-gg-purple/50'
                }`}
              >
                <button
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gg-cyan rounded-t-lg group"
                >
                  <span className={`font-bold text-lg transition-colors duration-300 ${isOpen ? 'text-gg-cyan' : 'text-white group-hover:text-gray-200'}`}>
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`flex-shrink-0 ml-4 ${isOpen ? 'text-gg-cyan' : 'text-gray-500 group-hover:text-white'}`}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={contentId}
                      role="region"
                      aria-labelledby={headerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-gray-400 font-mono text-sm leading-relaxed border-t border-gray-700/50">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};