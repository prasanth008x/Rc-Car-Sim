import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Pause, Play } from 'lucide-react';
import { Car, GameState, OpponentCar, GameControls } from '../types/game';
import GameCanvas from './GameCanvas';
import GameHUD from './GameHUD';
import GameController from './GameController';
import { useGame } from '../contexts/GameContext';

interface RacingGameProps {
  car: Car;
  trackId: number;
  onBack: () => void;
}

const RacingGame: React.FC<RacingGameProps> = ({ car, trackId, onBack }) => {
  const { saveGame, updateGameState } = useGame();
  const [gameState, setGameState] = useState<GameState>({
    currentLap: 1,
    totalLaps: 3,
    position: 1,
    speed: 0,
    nitroLevel: 100,
    timeRemaining: 180, // 3 minutes total
    score: 0,
  });
  
  const [isPaused, setIsPaused] = useState(false);
  const [isRaceStarted, setIsRaceStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [raceFinished, setRaceFinished] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 400, y: 500 });
  const [playerAngle, setPlayerAngle] = useState(0);
  const [playerSpeed, setPlayerSpeed] = useState(0);
  
  const [opponents, setOpponents] = useState<OpponentCar[]>([
    {
      id: 'ai_1',
      x: 350,
      y: 480,
      speed: 0,
      angle: 0,
      color: '#ff4444',
      ai: { aggressiveness: 0.7, skill: 0.8, currentAction: 'accelerating' },
    },
    {
      id: 'ai_2',
      x: 450,
      y: 460,
      speed: 0,
      angle: 0,
      color: '#44ff44',
      ai: { aggressiveness: 0.5, skill: 0.9, currentAction: 'accelerating' },
    },
    {
      id: 'ai_3',
      x: 380,
      y: 440,
      speed: 0,
      angle: 0,
      color: '#4444ff',
      ai: { aggressiveness: 0.9, skill: 0.6, currentAction: 'accelerating' },
    },
  ]);

  const [controls, setControls] = useState<GameControls>({
    accelerate: false,
    brake: false,
    turnLeft: false,
    turnRight: false,
    nitro: false,
  });

  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRaceStarted) {
      setIsRaceStarted(true);
      startGameLoop();
    }
  }, [countdown, isRaceStarted]);

  // Game timer effect
  useEffect(() => {
    if (isRaceStarted && !isPaused && gameState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeRemaining === 0) {
      finishRace();
    }
  }, [isRaceStarted, isPaused, gameState.timeRemaining]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRaceStarted || isPaused) return;
      
      const key = e.key.toLowerCase();
      keysPressed.current.add(key);
      
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setControls(prev => ({ ...prev, accelerate: true }));
          break;
        case 's':
        case 'arrowdown':
          setControls(prev => ({ ...prev, brake: true }));
          break;
        case 'a':
        case 'arrowleft':
          setControls(prev => ({ ...prev, turnLeft: true }));
          break;
        case 'd':
        case 'arrowright':
          setControls(prev => ({ ...prev, turnRight: true }));
          break;
        case ' ':
          e.preventDefault();
          if (gameState.nitroLevel > 0) {
            setControls(prev => ({ ...prev, nitro: true }));
          }
          break;
        case 'p':
          togglePause();
          break;
        case 'escape':
          togglePause();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);
      
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setControls(prev => ({ ...prev, accelerate: false }));
          break;
        case 's':
        case 'arrowdown':
          setControls(prev => ({ ...prev, brake: false }));
          break;
        case 'a':
        case 'arrowleft':
          setControls(prev => ({ ...prev, turnLeft: false }));
          break;
        case 'd':
        case 'arrowright':
          setControls(prev => ({ ...prev, turnRight: false }));
          break;
        case ' ':
          setControls(prev => ({ ...prev, nitro: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.nitroLevel, isRaceStarted, isPaused]);

  const startGameLoop = useCallback(() => {
    const gameLoop = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      if (!isPaused && isRaceStarted && !raceFinished) {
        updateGame(deltaTime);
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPaused, isRaceStarted, raceFinished]);

  const updateGame = (deltaTime: number) => {
    // Update player car
    updatePlayerCar(deltaTime);
    
    // Update AI opponents
    updateOpponents(deltaTime);
    
    // Check collisions
    checkCollisions();
    
    // Update game state
    updatePosition();
  };

  const updatePlayerCar = (deltaTime: number) => {
    let speed = playerSpeed;
    let angle = playerAngle;
    let { x, y } = playerPosition;
    let nitroLevel = gameState.nitroLevel;
    
    const maxSpeed = car.speed * 2; // Use car's speed stat
    const acceleration = car.acceleration * 100; // Use car's acceleration stat
    const handling = car.handling * 2; // Use car's handling stat

    // Acceleration
    if (controls.accelerate || keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
      speed = Math.min(speed + acceleration * deltaTime, maxSpeed);
    } else {
      speed = Math.max(speed - acceleration * 0.5 * deltaTime, 0);
    }

    // Braking
    if (controls.brake || keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
      speed = Math.max(speed - acceleration * 2 * deltaTime, 0);
    }

    // Turning
    if (speed > 5) {
      const turnSpeed = handling * (speed / maxSpeed) * deltaTime;
      if (controls.turnLeft || keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        angle -= turnSpeed;
      }
      if (controls.turnRight || keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        angle += turnSpeed;
      }
    }

    // Nitro boost
    if ((controls.nitro || keysPressed.current.has(' ')) && nitroLevel > 0) {
      speed = Math.min(speed * 1.8, maxSpeed * 1.5);
      nitroLevel = Math.max(nitroLevel - 50 * deltaTime, 0);
    } else if (nitroLevel < 100) {
      nitroLevel = Math.min(nitroLevel + 20 * deltaTime, 100);
    }

    // Movement
    const radians = (angle * Math.PI) / 180;
    const moveDistance = speed * deltaTime;
    x += Math.cos(radians) * moveDistance;
    y += Math.sin(radians) * moveDistance;

    // Keep car on track bounds
    const canvas = document.querySelector('canvas');
    const canvasWidth = canvas?.width || 800;
    const canvasHeight = canvas?.height || 600;
    
    x = Math.max(60, Math.min(canvasWidth - 60, x));
    y = Math.max(60, Math.min(canvasHeight - 60, y));

    setPlayerPosition({ x, y });
    setPlayerAngle(angle);
    setPlayerSpeed(speed);
    setGameState(prev => ({
      ...prev,
      speed: Math.round(speed),
      nitroLevel: Math.round(nitroLevel),
    }));
  };

  const updateOpponents = (deltaTime: number) => {
    setOpponents(prevOpponents => 
      prevOpponents.map(opponent => {
        // Enhanced AI logic
        let newSpeed = opponent.speed;
        let newAngle = opponent.angle;
        let { x, y } = opponent;
        
        const maxAISpeed = 120 + (opponent.ai.skill * 60);

        // AI decision making
        const distanceToPlayer = Math.sqrt(
          Math.pow(playerPosition.x - x, 2) + Math.pow(playerPosition.y - y, 2)
        );

        if (distanceToPlayer < 100 && opponent.ai.aggressiveness > 0.5) {
          // Try to overtake
          const angleChange = (Math.random() - 0.5) * opponent.ai.skill * 120 * deltaTime;
          newAngle += angleChange;
          newSpeed = Math.min(newSpeed + 100 * deltaTime, maxAISpeed);
        } else {
          // Normal racing
          newSpeed = Math.min(newSpeed + 80 * deltaTime, maxAISpeed * 0.9);
          // Follow track more naturally
          const trackCenterX = 400;
          const trackCenterY = 300;
          const angleToCenter = Math.atan2(trackCenterY - y, trackCenterX - x) * 180 / Math.PI;
          const angleDiff = angleToCenter - newAngle;
          newAngle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), 45) * deltaTime * 0.5;
        }

        // Movement
        const radians = (newAngle * Math.PI) / 180;
        x += Math.cos(radians) * newSpeed * deltaTime;
        y += Math.sin(radians) * newSpeed * deltaTime;

        // Keep AI cars on track
        const canvas = document.querySelector('canvas');
        const canvasWidth = canvas?.width || 800;
        const canvasHeight = canvas?.height || 600;
        
        x = Math.max(60, Math.min(canvasWidth - 60, x));
        y = Math.max(60, Math.min(canvasHeight - 60, y));
        
        // Bounce off walls
        if (x <= 60 || x >= canvasWidth - 60) {
          newAngle = 180 - newAngle;
          newSpeed *= 0.7;
        }
        if (y <= 60 || y >= canvasHeight - 60) {
          newAngle = -newAngle;
          newSpeed *= 0.7;
        }

        return {
          ...opponent,
          x,
          y,
          speed: newSpeed,
          angle: newAngle,
        };
      })
    );
  };

  const checkCollisions = () => {
    opponents.forEach(opponent => {
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - opponent.x, 2) + 
        Math.pow(playerPosition.y - opponent.y, 2)
      );
      
      if (distance < 35) {
        // Collision detected
        setPlayerSpeed(prev => Math.max(prev * 0.3, 0));
        setGameState(prev => ({
          ...prev,
          speed: Math.max(prev.speed * 0.3, 0),
        }));
        
        // Add collision effect
        const canvas = document.querySelector('canvas');
        if (canvas) {
          canvas.classList.add('collision-effect');
          setTimeout(() => canvas.classList.remove('collision-effect'), 300);
        }
      }
    });
  };

  const updatePosition = () => {
    // Enhanced position calculation based on lap progress
    const allCars = [
      { id: 'player', y: playerPosition.y, x: playerPosition.x },
      ...opponents.map(opp => ({ id: opp.id, y: opp.y, x: opp.x }))
    ];
    
    // Sort by track progress (simplified as Y position for now)
    allCars.sort((a, b) => a.y - b.y);
    const playerIndex = allCars.findIndex(car => car.id === 'player');
    
    setGameState(prev => ({
      ...prev,
      position: playerIndex + 1,
    }));
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const finishRace = () => {
    setRaceFinished(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const finalScore = gameState.position === 1 ? 1000 : 
                      gameState.position === 2 ? 500 : 
                      gameState.position === 3 ? 250 : 100;
    
    setGameState(prev => ({ ...prev, score: finalScore }));
    saveGame(car, { ...gameState, score: finalScore });
  };

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (raceFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-center bg-black/60 backdrop-blur-sm rounded-2xl p-12 border border-cyan-500/30">
          <h1 className="text-6xl font-black neon-text mb-4">RACE FINISHED!</h1>
          <p className="text-3xl mb-4">
            Position: <span className="text-yellow-400">#{gameState.position}</span>
          </p>
          <p className="text-xl mb-8">
            Score: <span className="text-green-400">{gameState.score}</span>
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all"
          >
            Back to Menu
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all ml-4"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-cyan-400 hover:text-white transition-colors bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit Race</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={togglePause}
          className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:text-cyan-400 transition-colors"
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
      </div>

      {/* Countdown */}
      {countdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
          <div className="text-center">
            <div className="text-9xl font-black neon-text animate-bounce mb-4">
              {countdown}
            </div>
            <div className="text-2xl text-cyan-400">
              {countdown === 3 ? 'GET READY!' : countdown === 2 ? 'SET!' : 'GO!'}
            </div>
          </div>
        </div>
      )}

      {/* Pause overlay */}
      {isPaused && isRaceStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70">
          <div className="text-center bg-black/80 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30">
            <div className="text-6xl font-black neon-text mb-6">PAUSED</div>
            <div className="space-y-4">
              <button
                onClick={togglePause}
                className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-semibold transition-all block w-full"
              >
                Resume Race
              </button>
              <button
                onClick={onBack}
                className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl font-semibold transition-all block w-full"
              >
                Exit to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Canvas */}
      <GameCanvas
        playerPosition={playerPosition}
        playerAngle={playerAngle}
        opponents={opponents}
        car={car}
        trackId={trackId}
        isPaused={isPaused}
      />

      {/* Game HUD */}
      <GameHUD gameState={gameState} />

      {/* Game Controller */}
      <GameController
        controls={controls}
        onControlChange={setControls}
        disabled={!isRaceStarted || isPaused}
      />
    </div>
  );
};

export default RacingGame;