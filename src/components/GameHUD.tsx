import React from 'react';
import { Gauge, Zap, Clock, Trophy } from 'lucide-react';
import { GameState } from '../types/game';

interface GameHUDProps {
  gameState: GameState;
}

const GameHUD: React.FC<GameHUDProps> = ({ gameState }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-orange-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top HUD */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-8 bg-black/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-cyan-500/30">
          {/* Position */}
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Position</div>
            <div className={`text-3xl font-black ${getPositionColor(gameState.position)}`}>
              #{gameState.position}
            </div>
          </div>

          {/* Lap */}
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Lap</div>
            <div className="text-2xl font-bold text-white">
              {gameState.currentLap}/{gameState.totalLaps}
            </div>
          </div>

          {/* Time */}
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Time
            </div>
            <div className="text-2xl font-bold text-cyan-400">
              {formatTime(gameState.timeRemaining)}
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1 flex items-center">
              <Trophy className="w-4 h-4 mr-1" />
              Score
            </div>
            <div className="text-2xl font-bold text-green-400">
              {gameState.score}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left - Speedometer */}
      <div className="absolute bottom-6 left-6">
        <div className="speedometer w-32 h-32 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500"></div>
          
          {/* Speed arc */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(0, 255, 255, 0.2)"
              strokeWidth="8"
              strokeDasharray="282.7"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#speedGradient)"
              strokeWidth="8"
              strokeDasharray="282.7"
              strokeDashoffset={282.7 - (gameState.speed / 200) * 282.7}
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffff" />
                <stop offset="50%" stopColor="#ff00ff" />
                <stop offset="100%" stopColor="#ffff00" />
              </linearGradient>
            </defs>
          </svg>

          <div className="text-center z-10">
            <div className="text-2xl font-black text-white">{gameState.speed}</div>
            <div className="text-xs text-gray-400">KM/H</div>
          </div>
        </div>
      </div>

      {/* Bottom Center - Nitro Bar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-purple-500/30">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-purple-400" />
            <div className="text-sm text-gray-400">NITRO</div>
            <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${gameState.nitroLevel}%` }}
              ></div>
            </div>
            <div className="text-sm font-bold text-purple-400">
              {Math.round(gameState.nitroLevel)}%
            </div>
          </div>
        </div>
      </div>

      {/* Mini Map (Top Right) */}
      <div className="absolute top-20 right-6">
        <div className="w-32 h-24 bg-black/60 backdrop-blur-sm rounded-lg border border-cyan-500/30 p-2">
          <div className="text-xs text-gray-400 mb-2">TRACK MAP</div>
          <div className="relative w-full h-16 bg-gray-800 rounded">
            {/* Track outline */}
            <div className="absolute inset-1 border border-gray-600 rounded"></div>
            
            {/* Player dot */}
            <div
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                left: '50%',
                top: '70%',
                transform: 'translate(-50%, -50%)',
              }}
            ></div>
            
            {/* Opponent dots */}
            <div className="absolute w-1 h-1 bg-red-400 rounded-full" style={{ left: '45%', top: '65%' }}></div>
            <div className="absolute w-1 h-1 bg-green-400 rounded-full" style={{ left: '55%', top: '60%' }}></div>
            <div className="absolute w-1 h-1 bg-blue-400 rounded-full" style={{ left: '48%', top: '55%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;