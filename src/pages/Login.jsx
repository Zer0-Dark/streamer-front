import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Optional: verify token with an API call
            fetch(`${import.meta.env.VITE_API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    if (res.ok) {
                        navigate('/dashboard');
                    } else {
                        localStorage.removeItem('token'); // Invalid token
                    }
                })
                .catch(() => localStorage.removeItem('token'));
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Using fetch to call the login endpoint
        fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    // Redirect to home or dashboard
                    navigate('/dashboard');
                } else {
                    alert('Login failed: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(err => {
                console.error(err);
                alert('Login error');
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="font-['Spline_Sans'] min-h-screen flex flex-col transition-colors duration-300 bg-[#32272e] text-[#f7afb7]">

            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-20 left-[15%] text-[#f7afb7] opacity-10 rotate-12">
                    <span className="material-symbols-outlined !text-6xl">pets</span>
                </div>
                <div className="absolute bottom-20 right-[15%] text-[#f7afb7] opacity-10 -rotate-12">
                    <span className="material-symbols-outlined !text-6xl">pets</span>
                </div>
                <div className="absolute top-1/2 left-10 text-[#f7afb7] opacity-5">
                    <span className="material-symbols-outlined !text-[120px]">pets</span>
                </div>

                <div className="relative w-full max-w-[440px]">
                    {/* Cat Ears */}
                    <div className="absolute top-[-15px] left-[30px] w-10 h-10 bg-[#3a2f3c] rounded-lg rotate-45 z-0"></div>
                    <div className="absolute top-[-15px] right-[30px] w-10 h-10 bg-[#3a2f3c] rounded-lg rotate-45 z-0"></div>

                    <div className="relative z-10 backdrop-blur-[10px] bg-[rgba(58,47,60,0.98)] rounded-xl shadow-2xl p-8 border border-white/10">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 bg-[#f7afb7]/20 rounded-full flex items-center justify-center mb-4 text-[#f7afb7]">
                                <span className="material-symbols-outlined !text-4xl">pets</span>
                            </div>
                            <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Welcome back, Captain</h1>
                            <p className="text-[#f7afb7]/70 text-sm">Log in to manage your streams</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="flex flex-col gap-2">
                                <label className="text-white text-sm font-semibold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px] text-[#f7afb7]">pets</span>
                                    Username/Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#2c242a] border border-[#ad6d94] rounded-lg h-14 px-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#f7afb7] focus:border-transparent transition outline-none"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-white text-sm font-semibold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px] text-[#f7afb7]">pets</span>
                                        Password
                                    </label>
                                </div>
                                <div className="relative flex items-stretch">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex-1 bg-[#2c242a] border border-[#ad6d94] rounded-l-lg h-14 px-4 text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#f7afb7] focus:border-transparent transition border-r-0 outline-none w-full"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="flex items-center justify-center bg-[#2c242a] border border-[#ad6d94] border-l-0 rounded-r-lg px-4 text-white cursor-pointer hover:text-[#f7afb7] transition h-14 focus:outline-none focus:ring-2 focus:ring-[#f7afb7] focus:ring-inset"
                                    >
                                        <span className="material-symbols-outlined !font-bold">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#f7afb7] text-[#32272e] h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition hover:opacity-95 active:scale-[0.98] shadow-lg shadow-[#f7afb7]/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                    {isLoading ? 'Logging In...' : 'Login'}
                                    {!isLoading && <span className="material-symbols-outlined !text-2xl !font-bold">login</span>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Login;
