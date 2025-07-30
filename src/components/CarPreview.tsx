import React from 'react';
import { Car } from '../types/game';

interface CarPreviewProps {
  car: Car;
}

const CarPreview: React.FC<CarPreviewProps> = ({ car }) => {
  return (
    <div className="car-preview relative w-full h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden">
      {/* Car body */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="car-3d relative">
          {/* Main car body */}
          <div className={`w-32 h-16 rounded-lg relative ${
            car.body === 'lightweight' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
            car.body === 'heavy' ? 'bg-gradient-to-r from-red-600 to-red-800' :
            'bg-gradient-to-r from-purple-500 to-purple-700'
          }`}>
            {/* Neon underglow */}
            <div 
              className="absolute -inset-2 rounded-lg opacity-60 blur-sm"
              style={{ backgroundColor: car.lights }}
            ></div>
            
            {/* Windshield */}
            <div className="absolute top-1 left-4 right-4 h-6 bg-gradient-to-b from-cyan-200 to-cyan-400 rounded-t-lg opacity-80"></div>
            
            {/* Side windows */}
            <div className="absolute top-2 left-1 w-3 h-4 bg-cyan-300 rounded opacity-60"></div>
            <div className="absolute top-2 right-1 w-3 h-4 bg-cyan-300 rounded opacity-60"></div>
            
            {/* Wheels */}
            <div className={`absolute -left-2 top-2 w-6 h-6 rounded-full ${
              car.tyres === 'sport' ? 'bg-gray-700 border-2 border-gray-400' :
              car.tyres === 'racing' ? 'bg-red-600 border-2 border-red-400' :
              'bg-yellow-600 border-2 border-yellow-400'
            }`}></div>
            <div className={`absolute -right-2 top-2 w-6 h-6 rounded-full ${
              car.tyres === 'sport' ? 'bg-gray-700 border-2 border-gray-400' :
              car.tyres === 'racing' ? 'bg-red-600 border-2 border-red-400' :
              'bg-yellow-600 border-2 border-yellow-400'
            }`}></div>
            <div className={`absolute -left-2 bottom-2 w-6 h-6 rounded-full ${
              car.tyres === 'sport' ? 'bg-gray-700 border-2 border-gray-400' :
              car.tyres === 'racing' ? 'bg-red-600 border-2 border-red-400' :
              'bg-yellow-600 border-2 border-yellow-400'
            }`}></div>
            <div className={`absolute -right-2 bottom-2 w-6 h-6 rounded-full ${
              car.tyres === 'sport' ? 'bg-gray-700 border-2 border-gray-400' :
              car.tyres === 'racing' ? 'bg-red-600 border-2 border-red-400' :
              'bg-yellow-600 border-2 border-yellow-400'
            }`}></div>
            
            {/* Performance chip indicator */}
            <div className={`absolute top-0 right-0 w-3 h-3 rounded-full ${
              car.chips === 'nitro' ? 'bg-purple-400' :
              car.chips === 'turbo' ? 'bg-orange-400' :
              'bg-green-400'
            } animate-pulse`}></div>
            
            {/* Headlights */}
            <div className="absolute -top-1 left-2 w-2 h-2 bg-white rounded-full opacity-80"></div>
            <div className="absolute -top-1 right-2 w-2 h-2 bg-white rounded-full opacity-80"></div>
            
            {/* Taillights */}
            <div className="absolute -bottom-1 left-3 w-1 h-1 bg-red-500 rounded-full"></div>
            <div className="absolute -bottom-1 right-3 w-1 h-1 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Track surface */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600">
        <div className="h-1 bg-yellow-400 mx-auto mt-3 w-20"></div>
        <div className="h-1 bg-yellow-400 mx-auto mt-2 w-20"></div>
      </div>
    </div>
  );
};

export default CarPreview;