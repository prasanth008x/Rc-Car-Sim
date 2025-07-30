export interface Car {
  id: string;
  tyres: 'sport' | 'racing' | 'drift';
  body: 'lightweight' | 'heavy' | 'balanced';
  lights: string;
  chips: 'nitro' | 'turbo' | 'handling';
  speed: number;
  acceleration: number;
  handling: number;
  nitro: number;
}

export interface Track {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  environment: 'city' | 'mountain' | 'neon';
  lapTime: number;
}

export interface GameState {
  currentLap: number;
  totalLaps: number;
  position: number;
  speed: number;
  nitroLevel: number;
  timeRemaining: number;
  score: number;
}

export interface OpponentCar {
  id: string;
  x: number;
  y: number;
  speed: number;
  angle: number;
  color: string;
  ai: {
    aggressiveness: number;
    skill: number;
    currentAction: 'accelerating' | 'braking' | 'turning' | 'overtaking';
  };
}

export interface GameControls {
  accelerate: boolean;
  brake: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  nitro: boolean;
}