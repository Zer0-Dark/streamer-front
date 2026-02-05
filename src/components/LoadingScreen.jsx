import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function LoadingScreen({ onLoadingComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => onLoadingComplete(), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(timer);
    }, [onLoadingComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color-deep-mauve)] via-[var(--color-dark-purple)] to-[var(--color-deep-brown-mauve)]"
        >
            {/* Animated Cat Paw */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="mb-8"
            >
                <span className="material-symbols-outlined text-[var(--color-soft-pink)] text-9xl drop-shadow-2xl">
                    pets
                </span>
            </motion.div>

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
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.5,
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
