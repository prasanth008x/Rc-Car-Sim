import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import CarCustomization from './components/CarCustomization';
import TrackSelection from './components/TrackSelection';
import RacingGame from './components/RacingGame';
import { GameProvider } from './contexts/GameContext';
import { Car } from './types/game';
import './App.css';

type GameScreen = 'menu' | 'customization' | 'tracks' | 'racing';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<number>(1);

  const handleScreenChange = (screen: GameScreen) => {
    setCurrentScreen(screen);
  };

  const handleCarSave = (car: Car) => {
    setSelectedCar(car);
    setCurrentScreen('tracks');
  };

  const handleTrackSelect = (trackId: number) => {
    setSelectedTrack(trackId);
    setCurrentScreen('racing');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white font-orbitron">
        {currentScreen === 'menu' && (
          <MainMenu onScreenChange={handleScreenChange} />
        )}
        {currentScreen === 'customization' && (
          <CarCustomization 
            onCarSave={handleCarSave}
            onBack={() => handleScreenChange('menu')}
          />
        )}
        {currentScreen === 'tracks' && (
          <TrackSelection 
            onTrackSelect={handleTrackSelect}
            onBack={() => handleScreenChange('menu')}
          />
        )}
        {currentScreen === 'racing' && selectedCar && (
          <RacingGame 
            car={selectedCar}
            trackId={selectedTrack}
            onBack={handleBackToMenu}
          />
        )}
        
        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm py-2 px-4 text-center text-xs text-gray-400 z-50">
          <p>Prasanth @2025 All Rights Reserved</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;