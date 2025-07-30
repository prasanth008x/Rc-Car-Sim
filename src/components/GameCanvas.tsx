import React, { useRef, useEffect } from 'react';
import { Car, OpponentCar } from '../types/game';

interface GameCanvasProps {
  playerPosition: { x: number; y: number };
  playerAngle: number;
  opponents: OpponentCar[];
  car: Car;
  trackId: number;
  isPaused: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  playerPosition,
  playerAngle,
  opponents,
  car,
  trackId,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw track background
      drawTrack(ctx, trackId);

      // Draw opponents
      opponents.forEach(opponent => {
        drawCar(ctx, opponent.x, opponent.y, opponent.angle, opponent.color, false);
      });

      // Draw player car
      drawCar(ctx, playerPosition.x, playerPosition.y, playerAngle, car.lights, true);

      // Draw nitro effects when active
      if (car.chips === 'nitro' && playerPosition.x > 0) {
        drawNitroEffect(ctx, playerPosition.x, playerPosition.y, playerAngle);
      }
      
      // Draw speed lines for motion effect
      if (playerPosition.x > 0) {
        drawSpeedLines(ctx, playerPosition.x, playerPosition.y, playerAngle);
      }
    };

    render();
  }, [playerPosition, playerAngle, opponents, car, trackId, isPaused]);

  const drawTrack = (ctx: CanvasRenderingContext2D, trackId: number) => {
    const { width, height } = ctx.canvas;

    // Track-specific backgrounds
    switch (trackId) {
      case 1: // City Circuit
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        // City buildings
        ctx.fillStyle = '#16213e';
        for (let i = 0; i < 10; i++) {
          const x = (i * width) / 10;
          const buildingHeight = 50 + Math.random() * 100;
          ctx.fillRect(x, 0, width / 10 - 10, buildingHeight);
          ctx.fillRect(x, height - buildingHeight, width / 10 - 10, buildingHeight);
        }
        break;

      case 2: // Mountain Pass
        ctx.fillStyle = '#0f2027';
        ctx.fillRect(0, 0, width, height);
        
        // Mountain silhouettes
        ctx.fillStyle = '#203a43';
        ctx.beginPath();
        ctx.moveTo(0, height * 0.6);
        for (let i = 0; i <= width; i += 50) {
          ctx.lineTo(i, height * 0.6 - Math.sin(i * 0.01) * 80);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();
        break;

      case 3: // Neon Speedway
        ctx.fillStyle = '#0d0015';
        ctx.fillRect(0, 0, width, height);
        
        // Neon grid
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < width; i += 50) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
        for (let i = 0; i < height; i += 50) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(width, i);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        break;
    }

    // Draw track barriers
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Draw racing lines
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    
    // Draw track lanes
    const laneWidth = width * 0.6;
    const laneHeight = height * 0.6;
    const laneX = (width - laneWidth) / 2;
    const laneY = (height - laneHeight) / 2;
    
    ctx.strokeRect(laneX, laneY, laneWidth, laneHeight);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(width / 2, laneY);
    ctx.lineTo(width / 2, laneY + laneHeight);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Start/Finish line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(laneX, height * 0.8);
    ctx.lineTo(laneX + laneWidth, height * 0.8);
    ctx.stroke();
    
    // Checkered pattern for start/finish
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(laneX + (i * laneWidth / 10), height * 0.8 - 2, laneWidth / 10, 4);
      }
    }
  };

  const drawCar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    color: string,
    isPlayer: boolean
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);

    // Car shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-13, -6, 26, 12);
    
    // Car body
    if (isPlayer) {
      ctx.fillStyle = '#2a2a2a';
    } else {
      ctx.fillStyle = color;
    }
    ctx.fillRect(-15, -8, 30, 16);

    // Car outline
    ctx.strokeStyle = isPlayer ? '#ffffff' : '#cccccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(-15, -8, 30, 16);

    // Windshield
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(-10, -6, 8, 12);

    // Wheels
    ctx.fillStyle = '#333333';
    ctx.fillRect(-12, -12, 4, 6);
    ctx.fillRect(-12, 6, 4, 6);
    ctx.fillRect(8, -12, 4, 6);
    ctx.fillRect(8, 6, 4, 6);

    // Headlights
    ctx.fillStyle = '#ffffcc';
    ctx.fillRect(13, -6, 3, 3);
    ctx.fillRect(13, 3, 3, 3);

    // Player car glow effect
    if (isPlayer) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(-18, -11, 36, 22);
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  };

  const drawNitroEffect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);

    // Nitro exhaust flames
    ctx.fillStyle = '#ff4400';
    ctx.fillRect(-30, -6, -15, 12);
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(-25, -4, -10, 8);
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(-20, -2, -8, 4);
    
    // Nitro particles
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(255, ${100 + i * 30}, 0, ${0.8 - i * 0.15})`;
      ctx.fillRect(-35 - i * 5, -2 + (Math.random() - 0.5) * 8, 3, 3);
    }

    ctx.restore();
  };
  
  const drawSpeedLines = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    
    // Speed lines behind the car
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 8; i++) {
      const lineLength = 10 + i * 3;
      const offsetY = (i - 4) * 3;
      ctx.beginPath();
      ctx.moveTo(-20 - lineLength, offsetY);
      ctx.lineTo(-20, offsetY);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-contain"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameCanvas;