import { useEffect, useState } from 'react';
import foodGif from '../assets/gifs/food.gif';
import hurtGif from '../assets/gifs/hurt.gif';
import laughGif from '../assets/gifs/laugh.gif';
import streamGif from '../assets/gifs/stream.gif';

function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [currentGif, setCurrentGif] = useState(laughGif);

    const gifs = [foodGif, hurtGif, laughGif, streamGif];

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            // Check if hovering over an icon, link, button, or any interactive element
            const target = e.target.closest('a, button, img, .material-symbols-outlined, [role="button"]');
            if (target) {
                // Pick a random GIF
                const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
                setCurrentGif(randomGif);
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className="fixed pointer-events-none z-[9999] transition-opacity duration-200"
            style={{
                left: `${position.x + 45}px`,
                top: `${position.y + 45}px`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            <img
                src={currentGif}
                alt="cursor"
                className="w-18 h-18  border-[var(--color-soft-pink)] shadow-lg"
                style={{
                    imageRendering: 'pixelated',
                }}
            />
        </div>
    );
}

export default CustomCursor;
