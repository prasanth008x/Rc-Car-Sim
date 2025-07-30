import React from 'react';
import { Car, Zap, Trophy, Settings } from 'lucide-react';

interface MainMenuProps {
  onScreenChange: (screen: 'customization' | 'tracks' | 'racing') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onScreenChange }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 racing-grid opacity-20"></div>
      
      {/* Main title */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-6xl md:text-8xl font-black neon-text mb-4 tracking-wider">
          ULTRA RACING
        </h1>
        <p className="text-xl md:text-2xl text-cyan-400 font-light tracking-widest">
          SIMULATION CHAMPIONSHIP
        </p>
        <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto mt-4"></div>
      </div>

      {/* Menu buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 w-full max-w-2xl px-6">
        <button
          onClick={() => onScreenChange('customization')}
          className="menu-button p-8 rounded-xl text-left group hover:scale-105 transition-all duration-300"
        >
          <Car className="w-12 h-12 text-cyan-400 mb-4 group-hover:text-white transition-colors" />
          <h3 className="text-2xl font-bold mb-2">CAR GARAGE</h3>
          <p className="text-gray-400 text-sm">Customize your ultimate racing machine</p>
        </button>

        <button
          onClick={() => onScreenChange('tracks')}
          className="menu-button p-8 rounded-xl text-left group hover:scale-105 transition-all duration-300"
        >
          <Zap className="w-12 h-12 text-purple-400 mb-4 group-hover:text-white transition-colors" />
          <h3 className="text-2xl font-bold mb-2">QUICK RACE</h3>
          <p className="text-gray-400 text-sm">Jump into action with default setup</p>
        </button>

        <button
          className="menu-button p-8 rounded-xl text-left group hover:scale-105 transition-all duration-300 opacity-75 cursor-not-allowed"
          disabled
        >
          <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
          <h3 className="text-2xl font-bold mb-2">CHAMPIONSHIP</h3>
          <p className="text-gray-400 text-sm">Coming soon - Tournament mode</p>
        </button>

        <button
          className="menu-button p-8 rounded-xl text-left group hover:scale-105 transition-all duration-300 opacity-75 cursor-not-allowed"
          disabled
        >
          <Settings className="w-12 h-12 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold mb-2">SETTINGS</h3>
          <p className="text-gray-400 text-sm">Audio, controls, and preferences</p>
        </button>
      </div>

      {/* Racing cars animation */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-8 opacity-30">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-16 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            style={{
              animation: `car-drive ${2 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes car-drive {
          0% { transform: translateX(-50px) scale(0.8); }
          100% { transform: translateX(50px) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default MainMenu;