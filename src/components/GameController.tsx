import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { GameControls } from '../types/game';

interface GameControllerProps {
  controls: GameControls;
  onControlChange: (controls: GameControls) => void;
  disabled?: boolean;
}

const GameController: React.FC<GameControllerProps> = ({
  controls,
  onControlChange,
  disabled = false,
}) => {
  const handleControlPress = (control: keyof GameControls, pressed: boolean) => {
    if (disabled) return;
    onControlChange({ ...controls, [control]: pressed });
  };
  
  // Touch event handlers for mobile
  const handleTouchStart = (control: keyof GameControls) => {
    if (disabled) return;
    onControlChange({ ...controls, [control]: true });
  };
  
  const handleTouchEnd = (control: keyof GameControls) => {
    if (disabled) return;
    onControlChange({ ...controls, [control]: false });
  };

  return (
    <div className="absolute bottom-20 right-6 z-20">
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-cyan-400">CONTROLS</h3>
        </div>

        {/* D-Pad */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div></div>
          <button
            className={`controller-button w-16 h-16 rounded-lg flex items-center justify-center ${
              controls.accelerate ? 'bg-green-500/50' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseDown={() => handleControlPress('accelerate', true)}
            onMouseUp={() => handleControlPress('accelerate', false)}
            onMouseLeave={() => handleControlPress('accelerate', false)}
            onTouchStart={() => handleTouchStart('accelerate')}
            onTouchEnd={() => handleTouchEnd('accelerate')}
            disabled={disabled}
          >
            <ArrowUp className="w-8 h-8 text-white" />
          </button>
          <div></div>

          <button
            className={`controller-button w-16 h-16 rounded-lg flex items-center justify-center ${
              controls.turnLeft ? 'bg-blue-500/50' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseDown={() => handleControlPress('turnLeft', true)}
            onMouseUp={() => handleControlPress('turnLeft', false)}
            onMouseLeave={() => handleControlPress('turnLeft', false)}
            onTouchStart={() => handleTouchStart('turnLeft')}
            onTouchEnd={() => handleTouchEnd('turnLeft')}
            disabled={disabled}
          >
            <ArrowLeft className="w-8 h-8 text-white" />
          </button>

          <button
            className={`controller-button w-16 h-16 rounded-lg flex items-center justify-center ${
              controls.brake ? 'bg-red-500/50' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseDown={() => handleControlPress('brake', true)}
            onMouseUp={() => handleControlPress('brake', false)}
            onMouseLeave={() => handleControlPress('brake', false)}
            onTouchStart={() => handleTouchStart('brake')}
            onTouchEnd={() => handleTouchEnd('brake')}
            disabled={disabled}
          >
            <ArrowDown className="w-8 h-8 text-white" />
          </button>

          <button
            className={`controller-button w-16 h-16 rounded-lg flex items-center justify-center ${
              controls.turnRight ? 'bg-blue-500/50' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseDown={() => handleControlPress('turnRight', true)}
            onMouseUp={() => handleControlPress('turnRight', false)}
            onMouseLeave={() => handleControlPress('turnRight', false)}
            onTouchStart={() => handleTouchStart('turnRight')}
            onTouchEnd={() => handleTouchEnd('turnRight')}
            disabled={disabled}
          >
            <ArrowRight className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Nitro Button */}
        <div className="text-center">
          <button
            className={`controller-button w-20 h-20 rounded-full flex items-center justify-center ${
              controls.nitro ? 'bg-purple-500/50 nitro-effect' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onMouseDown={() => handleControlPress('nitro', true)}
            onMouseUp={() => handleControlPress('nitro', false)}
            onMouseLeave={() => handleControlPress('nitro', false)}
            onTouchStart={() => handleTouchStart('nitro')}
            onTouchEnd={() => handleTouchEnd('nitro')}
            disabled={disabled}
          >
            <Zap className="w-10 h-10 text-purple-400" />
          </button>
          <div className="text-xs text-gray-400 mt-2">NITRO</div>
        </div>

        {/* Control hints */}
        <div className="mt-6 text-xs text-gray-500 text-center space-y-1">
          <div>Keyboard: WASD / Arrow Keys</div>
          <div>Nitro: Spacebar</div>
          <div>Pause: P or ESC</div>
        </div>
      </div>
    </div>
  );
};

export default GameController;