'use client';

import React, { useEffect, useRef } from 'react';

interface CyberNode {
  x: number;
  y: number;
  z: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  pulse: number;
}

export default function CyberBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const amberGoldPalette = [
      '#f59e0b', // Amber Gold
      '#fbbf24', // Bright Gold Accent
      '#d97706', // Deep Gold Accent
      '#10b981', // Emerald Pass Accent
      '#6366f1'  // Cyber Indigo Accent
    ];

    const nodes: CyberNode[] = [];
    const numNodes = 48;

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        radius: Math.random() * 2.5 + 1.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: amberGoldPalette[Math.floor(Math.random() * amberGoldPalette.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Charcoal Black Obsidian Background Radial Gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height) * 0.95
      );
      bgGrad.addColorStop(0, '#0c0d12');
      bgGrad.addColorStop(0.5, '#050505');
      bgGrad.addColorStop(1, '#020202');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Cybersecurity Grid Lines
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const offsetX = (mouseX - width / 2) * 0.02;
      const offsetY = (mouseY - height / 2) * 0.02;

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;
        n1.pulse += 0.03;

        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        const renderX = n1.x + offsetX * n1.z;
        const renderY = n1.y + offsetY * n1.z;

        // Laser Connections
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const renderX2 = n2.x + offsetX * n2.z;
          const renderY2 = n2.y + offsetY * n2.z;

          const dx = renderX - renderX2;
          const dy = renderY - renderY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.2;
            ctx.beginPath();
            ctx.moveTo(renderX, renderY);
            ctx.lineTo(renderX2, renderY2);
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Glowing Node Core
        const pulseRadius = n1.radius + Math.sin(n1.pulse) * 0.8;
        ctx.beginPath();
        ctx.arc(renderX, renderY, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = n1.color;
        ctx.shadowColor = n1.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85"
    />
  );
}
