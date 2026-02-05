import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import loadingGif from '../assets/gifs/loading.gif';

function LoadingScreen({ onLoadingComplete, dataReady }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    // Only complete if data is ready
                    if (dataReady) {
                        setTimeout(() => onLoadingComplete(), 100);
                    }
                    return 100;
                }
                return prev + 5;
            });
        }, 20);

        return () => clearInterval(timer);
    }, [onLoadingComplete, dataReady]);

    // If progress is 100% and data becomes ready, complete loading
    useEffect(() => {
        if (progress === 100 && dataReady) {
            setTimeout(() => onLoadingComplete(), 500);
        }
    }, [progress, dataReady, onLoadingComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-deep-mauve)] via-[var(--color-dark-purple)] to-[var(--color-deep-brown-mauve)]"
        >
            {/* Loading GIF */}
            <div className="mb-8">
                <img
                    src={loadingGif}
                    alt="Loading..."
                    className="w-36 h-36 drop-shadow-2xl"
                />
            </div>

            {/* Loading Text */}
            <motion.h2
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl font-bold text-[var(--color-soft-pink)] mb-8"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                Loading...
            </motion.h2>

            {/* Progress Bar */}
            <div className="w-64 h-3 bg-[var(--color-deep-brown-mauve)] rounded-full overflow-hidden border-2 border-[var(--color-dusty-rose)] shadow-lg">
                <motion.div
                    className="h-full bg-gradient-to-r from-[var(--color-dusty-rose)] to-[var(--color-soft-pink)] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Progress Percentage */}
            <motion.p
                className="mt-4 text-xl text-[var(--color-dusty-rose)] font-semibold"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {progress}%
            </motion.p>

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-[var(--color-soft-pink)] rounded-full opacity-30"
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 100 - 50, 0],
                        opacity: [0, 0.6, 0],
                    }}
                    transition={{
                        duration: 0.8 + Math.random() * 0.7,
                        repeat: Infinity,
                        delay: i * 0.1,
                    }}
                    style={{
                        left: `${20 + i * 15}%`,
                        bottom: '20%',
                    }}
                />
            ))}
        </motion.div>
    );
}

export default LoadingScreen;
