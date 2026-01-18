import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 text-white mb-4">
            <div className="container mx-auto flex gap-4">
                <Link to="/" className="hover:text-gray-300 font-bold">Home</Link>
                <Link to="/about" className="hover:text-gray-300 font-bold">About</Link>
            </div>
        </nav>
    );
}

export default Navbar;
