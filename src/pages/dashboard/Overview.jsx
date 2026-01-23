import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedFetch } from '../../utils/api';

function Overview() {
    const [polls, setPolls] = useState([]);
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        // Fetch Polls
        authenticatedFetch(`${import.meta.env.VITE_API_URL}/votes`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Only show active polls in the "Active Polls" widget
                    const activePolls = data.filter(p => p.isActive);
                    setPolls(activePolls);
                }
            })
            .catch(err => console.error(err));

        // Fetch Schedule
        authenticatedFetch(`${import.meta.env.VITE_API_URL}/calendar`)
            .then(res => res.json())
            .then(data => setSchedule(data.slice(0, 3))) // Show top 3
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Active Polls Card */}
                <div className="bg-[#3a2f3c] rounded-[1.5rem] border-2 border-white/10 p-8 relative flex flex-col h-full max-h-[600px]">
                    <div className="absolute -top-3 left-6 w-6 h-5 bg-[#3a2f3c] border-t-2 border-white/10" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                    <div className="absolute -top-3 right-6 w-6 h-5 bg-[#3a2f3c] border-t-2 border-white/10" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>

                    <div className="flex items-center justify-between mb-8 shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#f7afb7] scale-125">ballot</span>
                            <h3 className="text-white text-2xl font-['Outfit'] font-extrabold">Active Polls</h3>
                        </div>
                        <Link to="/dashboard/polls" className="text-white text-xs font-bold py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                            MANAGE POLLS
                        </Link>
                    </div>

                    <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {polls.length > 0 ? (
                            polls.map(poll => {
                                const totalVotes = poll.elements.reduce((acc, el) => acc + (el.count || 0), 0);
                                return (
                                    <div key={poll._id} className="bg-[#2c242a] p-6 rounded-2xl border-2 border-white/10">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h4 className="font-bold text-xl text-white mb-1">{poll.title}</h4>
                                                <p className="text-xs font-semibold text-[#ad6d94]">{totalVotes} votes</p>
                                            </div>
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${poll.isActive ? 'bg-[#f7afb7] text-[#2c242a]' : 'bg-gray-600 text-white'}`}>
                                                {poll.isActive ? 'Live' : 'Ended'}
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            {poll.elements.map((el, idx) => {
                                                const percentage = totalVotes === 0 ? 0 : Math.round(((el.count || 0) / totalVotes) * 100);
                                                return (
                                                    <div key={idx} className="relative h-12 w-full bg-white/5 rounded-xl overflow-hidden flex items-center px-4 border border-white/5">
                                                        <div className="absolute inset-y-0 left-0 bg-[#f7afb7]/30" style={{ width: `${percentage}%` }}></div>
                                                        <div className="relative flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-base font-bold text-white">{el.label}</span>
                                                            </div>
                                                            <span className="text-base font-black text-white">{percentage}%</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 text-gray-400">No active polls.</div>
                        )}
                    </div>
                </div>

                {/* Stream Schedule Card */}
                <div className="bg-[#3a2f3c] rounded-[1.5rem] border-2 border-white/10 p-8 relative">
                    <div className="absolute -top-3 left-6 w-6 h-5 bg-[#3a2f3c] border-t-2 border-white/10" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                    <div className="absolute -top-3 right-6 w-6 h-5 bg-[#3a2f3c] border-t-2 border-white/10" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#f7afb7] scale-125">calendar_clock</span>
                            <h3 className="text-white text-2xl font-['Outfit'] font-extrabold">Stream Schedule</h3>
                        </div>
                        <Link to="/dashboard/schedule" className="bg-[#f7afb7] text-[#2c242a] font-extrabold text-[10px] px-4 py-2 rounded-lg hover:brightness-105 transition-all">EDIT ALL</Link>
                    </div>
                    <div className="overflow-hidden rounded-2xl bg-[#2c242a] border-2 border-white/10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/10">
                                    <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Day</th>
                                    <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Title</th>
                                    <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {schedule.map((item) => (
                                    <tr key={item._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-5 text-sm font-bold text-white">{new Date(item.day).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-[#f7afb7] bg-[#f7afb7]/10 px-3 py-1 rounded-full">{item.streamTitle}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-white">{item.startTime}</td>
                                    </tr>
                                ))}
                                {schedule.length === 0 && (
                                    <tr><td colSpan="3" className="text-center py-4 text-gray-500">No schedule items</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Overview;
