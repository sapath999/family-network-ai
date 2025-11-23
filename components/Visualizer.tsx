import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { AudioVisualizerProps } from '../types';

const Visualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, volume, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barsRef = useRef<number[]>(new Array(20).fill(10));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 50;

      // Update bars based on volume
      const targetHeight = isPlaying ? Math.max(10, volume * 150) : 10;
      
      // GSAP-like smoothing for bars manually for performance in loop
      barsRef.current = barsRef.current.map(prev => prev + (targetHeight - prev) * 0.2);

      const barWidth = (Math.PI * 2 * radius) / barsRef.current.length;

      barsRef.current.forEach((h, i) => {
        const angle = (i / barsRef.current.length) * Math.PI * 2;
        
        // Random fluctuation for "alive" feel
        const fluctuatedHeight = h + (Math.random() * 10 - 5);

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + fluctuatedHeight);
        const y2 = centerY + Math.sin(angle) * (radius + fluctuatedHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color.replace('bg-', '').replace('-600', '').replace('-500', '').replace('-400', '') === 'white' ? '#fff' : getComputedStyle(canvas).getPropertyValue('--tw-text-opacity') ? color : '#cbd5e1'; 
        // Simple color mapping fallback since we passed tailwind class
        ctx.strokeStyle = '#ffffff'; 
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      // Inner circle pulse
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
      ctx.fillStyle = isPlaying ? `${color.replace('bg-', 'text-')} opacity-50` : '#334155';
      ctx.fill();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, volume, color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={400} 
      className="w-full max-w-[300px] h-auto aspect-square"
    />
  );
};

export default Visualizer;
