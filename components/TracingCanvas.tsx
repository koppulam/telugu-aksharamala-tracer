import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Point } from '../types';

interface TracingCanvasProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface TracingCanvasHandle {
  clear: () => void;
  animateTrace: (path: Point[][]) => void;
}

const TracingCanvas = forwardRef<TracingCanvasHandle, TracingCanvasProps>(({
  width = 320,
  height = 320,
  strokeColor = '#3b82f6', // A vibrant blue
  strokeWidth = 12,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationIntervalRef = useRef<number | null>(null);

  const getCoordinates = useCallback((event: MouseEvent | TouchEvent): Point | null => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (event instanceof MouseEvent) {
      x = event.clientX;
      y = event.clientY;
    } else if (event.touches && event.touches.length > 0) {
      x = event.touches[0].clientX;
      y = event.touches[0].clientY;
    } else {
      return null;
    }

    return {
      x: x - rect.left,
      y: y - rect.top,
    };
  }, []);

  const draw = useCallback((currentPoint: Point) => {
    const canvas = canvasRef.current;
    if (!canvas || !lastPoint) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
  }, [lastPoint, strokeColor, strokeWidth]);

  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    if (isAnimating) return;
    const point = getCoordinates(event);
    if (!point) return;
    
    setIsDrawing(true);
    setLastPoint(point);
  }, [getCoordinates, isAnimating]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  const handleMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDrawing || isAnimating) return;
    const point = getCoordinates(event);
    if (point) {
      draw(point);
    }
  }, [isDrawing, getCoordinates, draw, isAnimating]);
  
  // Helper to only clear the drawing from the canvas
  const clearDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Exposed function to fully clear and reset state, for the "Clear" button
  const clearCanvas = useCallback(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    setIsAnimating(false);
    clearDrawing();
  }, [clearDrawing]);

  const animateTrace = useCallback((path: Point[][]) => {
    if (isAnimating) return;
    
    // Stop any previous animation interval
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    
    clearDrawing(); // Clear previous user drawings without changing state
    setIsAnimating(true);

    const canvas = canvasRef.current;
    if (!canvas) {
        setIsAnimating(false);
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setIsAnimating(false);
        return;
    }

    const flatPoints = path.flatMap(stroke => [...stroke, null]);
    let i = 0;

    animationIntervalRef.current = window.setInterval(() => {
      if (i >= flatPoints.length) {
        clearInterval(animationIntervalRef.current!);
        animationIntervalRef.current = null;
        setTimeout(() => {
            // After a delay, fully clear and reset the state.
            clearCanvas();
        }, 1200);
        return;
      }

      const p1 = flatPoints[i - 1];
      const p2 = flatPoints[i];

      if (p1 && p2) {
          ctx.beginPath();
          ctx.strokeStyle = '#a78bfa'; // Light purple for hint
          ctx.lineWidth = 15;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
      }
      i++;
    }, 15);
  }, [isAnimating, clearDrawing, clearCanvas]);

  useImperativeHandle(ref, () => ({
    clear: clearCanvas,
    animateTrace,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
      
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [startDrawing, handleMove, stopDrawing]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 cursor-crosshair rounded-2xl"
    />
  );
});

export default TracingCanvas;