import React from 'react';
import { ArrowLeft, Play, Star, Mountain, Zap } from 'lucide-react';
import { Track } from '../types/game';

interface TrackSelectionProps {
  onTrackSelect: (trackId: number) => void;
  onBack: () => void;
}

const tracks: Track[] = [
  {
    id: 1,
    name: 'City Circuit',
    difficulty: 'easy',
    description: 'Navigate through the urban landscape with moderate turns and straightaways.',
    environment: 'city',
    lapTime: 45,
  },
  {
    id: 2,
    name: 'Mountain Pass',
    difficulty: 'medium',
    description: 'Challenging curves and elevation changes through scenic mountain roads.',
    environment: 'mountain',
    lapTime: 60,
  },
  {
    id: 3,
    name: 'Neon Speedway',
    difficulty: 'hard',
    description: 'High-speed night circuit with tight corners and nitro zones.',
    environment: 'neon',
    lapTime: 35,
  },
];

const TrackSelection: React.FC<TrackSelectionProps> = ({ onTrackSelect, onBack }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getEnvironmentIcon = (environment: string) => {
    switch (environment) {
      case 'city': return <Star className="w-8 h-8" />;
      case 'mountain': return <Mountain className="w-8 h-8" />;
      case 'neon': return <Zap className="w-8 h-8" />;
      default: return <Star className="w-8 h-8" />;
    }
  };

  const getEnvironmentGradient = (environment: string) => {
    switch (environment) {
      case 'city': return 'from-blue-600 to-indigo-800';
      case 'mountain': return 'from-green-600 to-emerald-800';
      case 'neon': return 'from-purple-600 to-pink-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-semibold">Back to Menu</span>
        </button>
        <h1 className="text-4xl font-black neon-text">SELECT TRACK</h1>
        <div className="w-32"></div>
      </div>

      {/* Track Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="track-preview bg-gray-900 rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => onTrackSelect(track.id)}
          >
            {/* Preview Image */}
            <div className={`h-48 bg-gradient-to-br ${getEnvironmentGradient(track.environment)} relative overflow-hidden`}>
              {/* Track visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {getEnvironmentIcon(track.environment)}
                  {track.environment === 'city' && (
                    <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-full animate-pulse"></div>
                  )}
                  {track.environment === 'mountain' && (
                    <div className="absolute inset-0 bg-green-400 opacity-20 rounded-full animate-pulse"></div>
                  )}
                  {track.environment === 'neon' && (
                    <div className="absolute inset-0 bg-purple-400 opacity-20 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
              
              {/* Racing line animation */}
              <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Difficulty badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border ${getDifficultyColor(track.difficulty)} bg-black/50 backdrop-blur-sm`}>
                <span className="text-sm font-semibold uppercase">{track.difficulty}</span>
              </div>
            </div>

            {/* Track Info */}
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                {track.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {track.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500">Target Time:</span>
                  <span className="text-yellow-400 font-semibold ml-2">{track.lapTime}s</span>
                </div>
                
                <button className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 rounded-lg font-semibold group-hover:from-cyan-400 group-hover:to-purple-400 transition-all">
                  <Play className="w-4 h-4" />
                  <span>Race</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Track Features */}
      <div className="mt-12 max-w-4xl mx-auto bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
        <h2 className="text-2xl font-bold mb-6 text-center">Track Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">Dynamic Weather</h3>
            <p className="text-gray-400 text-sm">Experience changing conditions that affect grip and visibility</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">Nitro Zones</h3>
            <p className="text-gray-400 text-sm">Strategic boost areas for maximum speed advantage</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">Elevation Changes</h3>
            <p className="text-gray-400 text-sm">Hills and valleys that challenge your racing skills</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackSelection;