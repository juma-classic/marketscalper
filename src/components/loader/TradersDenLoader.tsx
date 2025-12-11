import React, { useEffect, useRef, useState } from 'react';
import './TradersDenLoader.scss';

interface TradersDenLoaderProps {
    onLoadComplete?: () => void;
    duration?: number;
}

export const TradersDenLoader: React.FC<TradersDenLoaderProps> = ({ 
    onLoadComplete, 
    duration = 5000 
}) => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const statuses = [
        "Establishing Quantum Connection...",
        "Decrypting Market Signals...",
        "Analyzing Volatility Patterns...",
        "Loading Neural Network Models...",
        "Securing Data Streams...",
        "Injecting Algorithmic Strategies...",
        "Access Granted. Begin Trading."
    ];

    // Digital Rain Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const fontSize = 16;
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+=<>[]{};:"|,./?`~';
        let columns: number;
        let drops: number[];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }
        };

        const drawDigitalRain = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#06D6A0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        resizeCanvas();
        const interval = setInterval(drawDigitalRain, 50);
        window.addEventListener('resize', resizeCanvas);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    // Progress and Status Updates
    useEffect(() => {
        const statusInterval = duration / statuses.length;
        const progressInterval = 50; // Update every 50ms for smooth animation
        const progressIncrement = 100 / (duration / progressInterval);

        const progressTimer = setInterval(() => {
            setProgress(prev => {
                const next = prev + progressIncrement;
                return next >= 100 ? 100 : next;
            });
        }, progressInterval);

        const statusTimer = setInterval(() => {
            setStatusIndex(prev => {
                if (prev < statuses.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, statusInterval);

        const completeTimer = setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
                if (onLoadComplete) {
                    onLoadComplete();
                }
            }, 500);
        }, duration);

        return () => {
            clearInterval(progressTimer);
            clearInterval(statusTimer);
            clearTimeout(completeTimer);
        };
    }, [duration, onLoadComplete, statuses.length]);

    return (
        <div className={`traders-den-loader ${isComplete ? 'fade-out' : ''}`}>
            <canvas ref={canvasRef} className="digital-rain-canvas" />
            
            <div className="loading-container">
                {/* App Logo/Name */}
                <div className="logo-section">
                    <h1 className="logo-title">
                        <span className="logo-traders">TRADERS</span>
                        <span className="logo-den">DEN</span>
                    </h1>
                    <p className="logo-subtitle">Decoding Market Algorithms...</p>
                </div>

                {/* Custom Data Pulse Loader */}
                <div className="data-pulse-container">
                    <div className="data-bar bar-1"></div>
                    <div className="data-bar bar-2"></div>
                    <div className="data-bar bar-3"></div>
                </div>

                {/* Progress Bar and Status */}
                <div className="progress-section">
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar-fill" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="loading-status">{statuses[statusIndex]}</p>
                </div>
            </div>
        </div>
    );
};

export default TradersDenLoader;
