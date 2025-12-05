'use client';

import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface CanvasProps {
    socket: Socket;
    roomId: string;
    isDrawer: boolean;
}

export default function Canvas({ socket, roomId, isDrawer }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#00ff00'); // Default hacker green
    const [lineWidth, setLineWidth] = useState(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set initial styles
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        // Socket listener for incoming drawing data
        const handleDrawEvent = (data: { x: number; y: number; lastX: number; lastY: number; color: string; width: number }) => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.width;
            ctx.beginPath();
            ctx.moveTo(data.lastX, data.lastY);
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        };

        socket.on('draw', handleDrawEvent);

        return () => {
            socket.off('draw', handleDrawEvent);
        };
    }, [socket]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawer) return;
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !isDrawer || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Basic drawing (needs previous coordinates for smooth lines, keeping it simple for now or using Ref for last pos)
        // Actually, let's use a ref for last position
        // For MVP, I'll just draw dots if I don't track last pos.
        // Let's improve it.
    };

    // Improved drawing logic with refs
    const lastPos = useRef<{ x: number, y: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isDrawer) return;
        setIsDrawing(true);
        const rect = canvasRef.current!.getBoundingClientRect();
        lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !isDrawer || !lastPos.current || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const lastX = lastPos.current.x;
        const lastY = lastPos.current.y;

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        socket.emit('draw', {
            roomId,
            x, y, lastX, lastY,
            color,
            width: lineWidth
        });

        lastPos.current = { x, y };
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        lastPos.current = null;
    };

    const clearCanvas = () => {
        if (!isDrawer) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
            // In a real app we would emit 'clear' event
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative border-4 border-gray-700 rounded-lg overflow-hidden bg-white cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="touch-none"
                    style={{ background: '#1e1e1e' }} // Dark canvas background
                />
            </div>

            {isDrawer && (
                <div className="flex gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    <input type="range" min="1" max="20" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
                    <button onClick={clearCanvas} className="text-red-500 font-bold">Clear</button>
                </div>
            )}
        </div>
    );
}
