import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Car, GameState } from '../types/game';

interface GameContextType {
  savedCars: Car[];
  gameState: GameState;
  saveGame: (car: Car, state: GameState) => void;
  loadGame: () => { car: Car | null; state: GameState | null };
  updateGameState: (state: Partial<GameState>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [savedCars, setSavedCars] = useState<Car[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentLap: 1,
    totalLaps: 3,
    position: 1,
    speed: 0,
    nitroLevel: 100,
    timeRemaining: 60,
    score: 0,
  });

  const saveGame = (car: Car, state: GameState) => {
    localStorage.setItem('racingGame_car', JSON.stringify(car));
    localStorage.setItem('racingGame_state', JSON.stringify(state));
    setSavedCars(prev => {
      const existing = prev.find(c => c.id === car.id);
      if (existing) {
        return prev.map(c => c.id === car.id ? car : c);
      }
      return [...prev, car];
    });
  };

  const loadGame = () => {
    const savedCar = localStorage.getItem('racingGame_car');
    const savedState = localStorage.getItem('racingGame_state');
    
    return {
      car: savedCar ? JSON.parse(savedCar) : null,
      state: savedState ? JSON.parse(savedState) : null,
    };
  };

  const updateGameState = (state: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...state }));
  };

  return (
    <GameContext.Provider value={{
      savedCars,
      gameState,
      saveGame,
      loadGame,
      updateGameState,
    }}>
      {children}
    </GameContext.Provider>
  );
};