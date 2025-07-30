import React, { useState } from 'react';
import { ArrowLeft, Save, Palette, Cog, Zap } from 'lucide-react';
import { Car } from '../types/game';
import CarPreview from './CarPreview';

interface CarCustomizationProps {
  onCarSave: (car: Car) => void;
  onBack: () => void;
}

const CarCustomization: React.FC<CarCustomizationProps> = ({ onCarSave, onBack }) => {
  const [car, setCar] = useState<Car>({
    id: `car_${Date.now()}`,
    tyres: 'sport',
    body: 'balanced',
    lights: '#00ffff',
    chips: 'nitro',
    speed: 75,
    acceleration: 70,
    handling: 80,
    nitro: 85,
  });

  const updateCarStats = (newCar: Partial<Car>) => {
    let speed = 75;
    let acceleration = 70;
    let handling = 80;
    let nitro = 85;

    // Tyre effects
    if (newCar.tyres === 'racing') {
      speed += 15;
      acceleration += 10;
      handling -= 5;
    } else if (newCar.tyres === 'drift') {
      handling += 15;
      speed -= 5;
      acceleration += 5;
    }

    // Body effects
    if (newCar.body === 'lightweight') {
      acceleration += 15;
      speed += 10;
      handling += 10;
    } else if (newCar.body === 'heavy') {
      speed += 5;
      acceleration -= 10;
      handling -= 5;
    }

    // Chip effects
    if (newCar.chips === 'turbo') {
      speed += 20;
      acceleration += 15;
    } else if (newCar.chips === 'handling') {
      handling += 20;
      speed -= 5;
    } else if (newCar.chips === 'nitro') {
      nitro += 15;
    }

    return { speed, acceleration, handling, nitro };
  };

  const handleCarUpdate = (updates: Partial<Car>) => {
    const newCar = { ...car, ...updates };
    const stats = updateCarStats(newCar);
    setCar({ ...newCar, ...stats });
  };

  const handleSave = () => {
    onCarSave(car);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-semibold">Back to Menu</span>
        </button>
        <h1 className="text-4xl font-black text-center neon-text">CAR GARAGE</h1>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
        >
          <Save className="w-5 h-5" />
          <span>Save & Continue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Car Preview */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Palette className="w-6 h-6 mr-3 text-cyan-400" />
            Live Preview
          </h2>
          <CarPreview car={car} />
          
          {/* Stats Display */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Speed</div>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${car.speed}%` }}
                  ></div>
                </div>
                <span className="text-orange-400 font-bold">{car.speed}</span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Acceleration</div>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${car.acceleration}%` }}
                  ></div>
                </div>
                <span className="text-cyan-400 font-bold">{car.acceleration}</span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Handling</div>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${car.handling}%` }}
                  ></div>
                </div>
                <span className="text-green-400 font-bold">{car.handling}</span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Nitro</div>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${car.nitro}%` }}
                  ></div>
                </div>
                <span className="text-purple-400 font-bold">{car.nitro}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-6">
          {/* Tyres */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Cog className="w-5 h-5 mr-2 text-cyan-400" />
              Tyres
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['sport', 'racing', 'drift'] as const).map((tyre) => (
                <button
                  key={tyre}
                  onClick={() => handleCarUpdate({ tyres: tyre })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    car.tyres === tyre
                      ? 'border-cyan-400 bg-cyan-400/20'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-semibold capitalize">{tyre}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {tyre === 'sport' && 'Balanced performance'}
                    {tyre === 'racing' && 'Max speed & acceleration'}
                    {tyre === 'drift' && 'Superior handling'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Body Type */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4">Body Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['lightweight', 'balanced', 'heavy'] as const).map((body) => (
                <button
                  key={body}
                  onClick={() => handleCarUpdate({ body })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    car.body === body
                      ? 'border-purple-400 bg-purple-400/20'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-semibold capitalize">{body}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {body === 'lightweight' && 'High acceleration'}
                    {body === 'balanced' && 'All-around performance'}
                    {body === 'heavy' && 'Stability & durability'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Lights */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
            <h3 className="text-xl font-bold mb-4">Neon Lights</h3>
            <div className="grid grid-cols-6 gap-3">
              {[
                '#00ffff', '#ff00ff', '#ffff00', '#ff0000', '#00ff00', '#0000ff',
                '#ff8800', '#8800ff', '#00ff88', '#ff0088', '#88ff00', '#8888ff'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => handleCarUpdate({ lights: color })}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    car.lights === color ? 'border-white scale-110' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>

          {/* Performance Chips */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-green-400" />
              Performance Chips
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['nitro', 'turbo', 'handling'] as const).map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleCarUpdate({ chips: chip })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    car.chips === chip
                      ? 'border-green-400 bg-green-400/20'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-semibold capitalize">{chip}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {chip === 'nitro' && 'Boost power'}
                    {chip === 'turbo' && 'Speed & acceleration'}
                    {chip === 'handling' && 'Cornering ability'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCustomization;