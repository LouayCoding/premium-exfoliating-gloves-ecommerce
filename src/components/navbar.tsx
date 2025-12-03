'use client';

import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/contexts/cart-context';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state, toggleCart } = useCart();

  const navigationItems = [
    { name: 'Home', href: '#home' },
    { name: 'Shop', href: '#shop' },
    { name: 'Voordelen', href: '#voordelen' },
    { name: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Check if we're on homepage
    const isHomePage = window.location.pathname === '/';
    
    if (!isHomePage) {
      // Navigate to homepage with hash
      window.location.href = '/' + href;
      setIsMobileMenuOpen(false);
      return;
    }
    
    // Scroll to section on same page
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const navHeight = 80;
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile menu button */}
        <motion.button
          className="md:hidden p-2 -ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-gray-900" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6 text-gray-900" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Logo - Klikbaar naar homepage */}
        <a href="/" className="flex items-center cursor-pointer">
          <h1 className="text-2xl md:text-3xl font-avantt font-bold text-gray-900 hover:text-gray-700 transition-colors">
            HDS Gloves
          </h1>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-gray-900 hover:text-gray-600 transition-colors duration-200 font-avantt font-medium cursor-pointer"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Shopping cart */}
          <motion.button 
            onClick={toggleCart}
            className="relative p-2 text-gray-900 hover:text-gray-600 transition-colors duration-200"
            aria-label="Open winkelwagen"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={state.items.length > 0 ? { rotate: [0, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.div>
            <AnimatePresence>
              {state.items.length > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  key={state.items.length}
                >
                  {state.items.length > 99 ? '99+' : state.items.length}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation - Fullscreen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed inset-0 bg-white z-50 flex flex-col"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ 
              type: 'spring',
              damping: 25,
              stiffness: 200,
              duration: 0.5
            }}
          >
          {/* Mobile Menu Header - Safe Zone */}
          <div className="flex items-center justify-between px-4 pt-safe pb-4 bg-white border-b border-gray-100">
            <h1 className="text-2xl font-avantt font-bold text-gray-900">
              HDS Gloves
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 flex flex-col justify-center px-6 bg-white">
            <motion.div 
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              {navigationItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="block text-3xl font-avantt font-bold text-gray-900 hover:text-[#D4AF37] transition-colors duration-200 text-center cursor-pointer"
                  onClick={(e) => handleNavClick(e, item.href)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Mobile Menu Footer - Safe Zone */}
          <div className="px-6 pt-6 pb-safe bg-white border-t border-gray-100">
            <div className="text-center space-y-2">
              <p className="font-avantt text-sm font-semibold text-gray-900">
                ✓ Gratis verzending
              </p>
              <p className="font-avantt text-xs text-gray-600">
                9,834+ tevreden klanten
              </p>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
