import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">About Page</h1>
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="size-20 bg-purple-500 rounded-xl mb-4"
            />
            <p className="mb-4">We are learning how to structure React apps.</p>
            <Link to="/" className="text-blue-500 hover:text-blue-700">Back Home</Link>
        </div>
    );
}

export default About;
