import React, { useState } from 'react';
import { Menu, ChevronDown, LayoutDashboard, BarChart2, BookOpen, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationMenuProps {
  onSignOut: () => void;
  userName: string;
}

export default function NavigationMenu({ onSignOut, userName }: NavigationMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      label: 'Energy Log',
      icon: <LayoutDashboard className="w-4 h-4" />,
      href: '#energy-tracker'
    },
    {
      label: 'Analytics',
      icon: <BarChart2 className="w-4 h-4" />,
      href: '#analytics'
    },
    {
      label: 'Insights',
      icon: <BookOpen className="w-4 h-4" />,
      href: '#insights'
    },
    {
      label: 'Achievements',
      icon: <Award className="w-4 h-4" />,
      href: '#achievements'
    }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center space-x-4 md:space-x-8">
            {/* Hamburger Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <span className="w-5 h-0.5 bg-gray-600"></span>
                <span className="w-5 h-0.5 bg-gray-600"></span>
                <span className="w-5 h-0.5 bg-gray-600"></span>
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1">
                      {menuItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logo and Slogan */}
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                <div>
                  <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                    Zenflowz
                  </h1>
                  <p className="text-[10px] md:text-xs text-gray-600 hidden sm:block">
                    Personal Energy Optimisation for Peak Performance 🎯
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="text-xs md:text-sm font-medium text-gray-700 hidden sm:block">
              Hello {userName} ⭐
            </div>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-1 px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu for very small screens */}
      <div className="sm:hidden">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 border-t border-gray-200"
            >
              <div className="px-4 py-2">
                <div className="text-xs font-medium text-gray-700">
                  Hello {userName} ⭐
                </div>
                <p className="text-[10px] text-gray-600">
                  Personal Energy Optimisation for Peak Performance 🎯
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}