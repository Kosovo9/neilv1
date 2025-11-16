'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingShape {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  shape: 'circle' | 'square' | 'triangle' | 'hexagon';
  color: string;
}

const FloatingAnimations: React.FC = () => {
  // Elementos flotantes para el lado IZQUIERDO
  const leftShapes: FloatingShape[] = [
    { id: 1, size: 80, x: 50, y: 15, duration: 20, delay: 0, shape: 'circle', color: 'rgba(139, 92, 246, 0.1)' },
    { id: 2, size: 60, x: 100, y: 35, duration: 18, delay: 2, shape: 'square', color: 'rgba(59, 130, 246, 0.08)' },
    { id: 3, size: 40, x: 30, y: 55, duration: 22, delay: 1, shape: 'hexagon', color: 'rgba(236, 72, 153, 0.1)' },
    { id: 4, size: 90, x: 80, y: 75, duration: 25, delay: 3, shape: 'triangle', color: 'rgba(168, 85, 247, 0.12)' },
    { id: 5, size: 50, x: 20, y: 85, duration: 19, delay: 1.5, shape: 'circle', color: 'rgba(14, 165, 233, 0.09)' },
  ];

  // Elementos flotantes para el lado DERECHO
  const rightShapes: FloatingShape[] = [
    { id: 6, size: 70, x: -50, y: 20, duration: 21, delay: 0.5, shape: 'hexagon', color: 'rgba(99, 102, 241, 0.1)' },
    { id: 7, size: 85, x: -100, y: 40, duration: 23, delay: 2.5, shape: 'circle', color: 'rgba(168, 85, 247, 0.11)' },
    { id: 8, size: 55, x: -30, y: 60, duration: 20, delay: 1, shape: 'square', color: 'rgba(236, 72, 153, 0.08)' },
    { id: 9, size: 45, x: -80, y: 80, duration: 24, delay: 3, shape: 'triangle', color: 'rgba(59, 130, 246, 0.09)' },
    { id: 10, size: 95, x: -20, y: 90, duration: 22, delay: 1.5, shape: 'circle', color: 'rgba(139, 92, 246, 0.12)' },
  ];

  const getShapePath = (shape: FloatingShape['shape']) => {
    switch (shape) {
      case 'circle':
        return (
          <circle cx="50" cy="50" r="45" />
        );
      case 'square':
        return (
          <rect x="10" y="10" width="80" height="80" rx="12" />
        );
      case 'triangle':
        return (
          <polygon points="50,10 90,80 10,80" />
        );
      case 'hexagon':
        return (
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" />
        );
      default:
        return null;
    }
  };

  const renderShape = (shape: FloatingShape, isLeft: boolean) => (
    <motion.div
      key={shape.id}
      className="absolute"
      style={{
        width: `${shape.size}px`,
        height: `${shape.size}px`,
        [isLeft ? 'left' : 'right']: `${Math.abs(shape.x)}px`,
        top: `${shape.y}%`,
      }}
      initial={{
        opacity: 0,
        scale: 0,
        rotate: 0,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.8, 1.1, 1, 0.9],
        rotate: [0, 180, 360],
        y: [0, -30, 0, 30, 0],
        x: isLeft ? [0, 15, 0, -15, 0] : [0, -15, 0, 15, 0],
      }}
      transition={{
        duration: shape.duration,
        delay: shape.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id={`gradient-${shape.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: shape.color, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: shape.color, stopOpacity: 0.3 }} />
          </linearGradient>
          <filter id={`glow-${shape.id}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g
          fill={`url(#gradient-${shape.id})`}
          filter={`url(#glow-${shape.id})`}
          opacity="0.7"
        >
          {getShapePath(shape.shape)}
        </g>
      </svg>
    </motion.div>
  ));

  return (
    <>
      {/* Animaciones lado IZQUIERDO */}
      <div className="fixed left-0 top-0 w-64 h-full pointer-events-none z-0 overflow-hidden">
        {leftShapes.map((shape) => renderShape(shape, true))}
        
        {/* Partículas adicionales izquierda */}
        <motion.div
          className="absolute top-10 left-10 w-3 h-3 bg-purple-400 rounded-full opacity-60"
          animate={{
            y: [0, -100, 0],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/3 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-50"
          animate={{
            y: [0, 80, 0],
            x: [0, 20, 0],
            opacity: [0.5, 0.1, 0.5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-2/3 left-5 w-4 h-4 bg-pink-400 rounded-full opacity-40"
          animate={{
            y: [0, -60, 0],
            opacity: [0.4, 0.1, 0.4],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            delay: 2,
          }}
        />
      </div>

      {/* Animaciones lado DERECHO */}
      <div className="fixed right-0 top-0 w-64 h-full pointer-events-none z-0 overflow-hidden">
        {rightShapes.map((shape) => renderShape(shape, false))}
        
        {/* Partículas adicionales derecha */}
        <motion.div
          className="absolute top-20 right-10 w-3 h-3 bg-indigo-400 rounded-full opacity-60"
          animate={{
            y: [0, 100, 0],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 right-20 w-2 h-2 bg-purple-400 rounded-full opacity-50"
          animate={{
            y: [0, -80, 0],
            x: [0, -20, 0],
            opacity: [0.5, 0.1, 0.5],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-3/4 right-5 w-4 h-4 bg-blue-400 rounded-full opacity-40"
          animate={{
            y: [0, 60, 0],
            opacity: [0.4, 0.1, 0.4],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            delay: 1.5,
          }}
        />
      </div>

      {/* Gradient overlays para efecto de profundidad */}
      <div className="fixed left-0 top-0 w-96 h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-transparent" />
      </div>
      <div className="fixed right-0 top-0 w-96 h-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-l from-blue-500/5 via-transparent to-transparent" />
      </div>
    </>
  );
};

export default FloatingAnimations;
