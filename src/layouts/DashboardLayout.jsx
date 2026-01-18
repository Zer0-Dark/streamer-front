import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

function DashboardLayout() {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex overflow-hidden font-['Quicksand'] bg-[#32272e] text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-[#3a2f3c] border-r border-white/10 flex flex-col h-screen shrink-0 z-10 transition-all">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#f7afb7] rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#2c242a]">pets</span>
                    </div>
                    <span className="font-['Outfit'] font-extrabold text-xl tracking-tight text-white">Leen</span>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#f7afb7] text-[#2c242a] font-bold shadow-sm' : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Overview</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard/schedule"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#f7afb7] text-[#2c242a] font-bold shadow-sm' : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined">calendar_month</span>
                        <span>Schedule</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard/polls"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#f7afb7] text-[#2c242a] font-bold shadow-sm' : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined">poll</span>
                        <span>Polls</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard/settings"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-[#f7afb7] text-[#2c242a] font-bold shadow-sm' : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'}`}
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="px-4 mb-2">
                    <button onClick={handleLogout} className="w-full text-[#d1d1d1] hover:text-[#f7afb7] hover:bg-white/5 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-bold">Logout</span>
                    </button>
                </div>

                <div className="p-6">
                    <div className="bg-[#2c242a] p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                        <img alt="Admin" className="w-8 h-8 rounded-full border border-[#f7afb7]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGa4-6ISc04wklHrQTImhbrLJStHisCPtH1Q5p44-DrEgnd5yRdsHp4vFtD0lm_ZZq34h2CAKjOm1YMTX3z4WnGBx2LVcz8dOV7jTrsTwG2UBUMDmxrLzTmS4oSy2X3HrGJBxHl6MiSLmBDCesxVdOul9fJ5juKm2L3xvTEIDYG1ekun7nbd1EUunsMt_P4yRXNeK8MOb1ZLP1nw-LV0czArQDkKSDGiwcc3IElDE2y54xpjp2zMbT-2eaIfB0at28zEDgm37MItw" />
                        <div className="truncate">
                            <p className="text-xs font-bold truncate text-white uppercase tracking-wide">Black Cat</p>
                            <p className="text-[10px] text-[#ad6d94] font-semibold">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#32272e] flex flex-col">
                <header className="h-20 flex items-center justify-between px-10 border-b border-white/10 shrink-0">
                    <h2 className="text-2xl font-['Outfit'] font-extrabold text-white">Dashboard</h2>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="bg-[#f7afb7] text-[#2c242a] px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-extrabold hover:brightness-105 transition-all shadow-lg shadow-[#f7afb7]/20">
                            <span className="material-symbols-outlined text-lg">home</span>
                            HOME
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10">
                    <Outlet />
                </div>

                <div className="mt-auto w-full">
                    <Footer />
                </div>
            </main>

            {/* Floating Icons */}
            <div className="fixed top-20 right-20 opacity-[0.03] pointer-events-none select-none z-0">
                <span className="material-symbols-outlined text-[300px] text-white">pets</span>
            </div>
            <div className="fixed -bottom-20 -left-20 opacity-[0.03] pointer-events-none select-none rotate-45 z-0">
                <span className="material-symbols-outlined text-[400px] text-white">pets</span>
            </div>
        </div>
    );
}

export default DashboardLayout;
