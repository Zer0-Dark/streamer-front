import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticatedFetch } from '../../utils/api';

function PollManager() {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    // Default: Start now, End in 24h
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
    const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));

    const [options, setOptions] = useState([{ label: '', count: 0 }, { label: '', count: 0 }]);

    const fetchPolls = () => {
        authenticatedFetch(`${import.meta.env.VITE_API_URL}/votes`)
            .then(res => res.json())
            .then(data => setPolls(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchPolls();
    }, []);

    const handleOptionChange = (idx, value) => {
        const newOptions = [...options];
        newOptions[idx].label = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { label: '', count: 0 }]);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        setIsCreating(true);

        const payload = {
            title,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            elements: options.filter(o => o.label.trim() !== '')
        };

        const token = localStorage.getItem('token');
        if (!token) {
            alert("You are not logged in!");
            navigate('/login');
            return;
        }

        authenticatedFetch(`${import.meta.env.VITE_API_URL}/votes/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.ok) {
                    // Reset form
                    setTitle('');
                    setStartDate(new Date().toISOString().slice(0, 16));
                    setEndDate(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
                    setOptions([{ label: '', count: 0 }, { label: '', count: 0 }]);
                    fetchPolls();
                    alert("Poll created successfully!");
                } else {
                    if (res.status === 401) {
                        // authenticatedFetch handles redirect, but we might want to alert if we want custom message before
                        // but actually authenticatedFetch redirects, so this block might not even be reached or needed as much
                        alert("Session expired. Please login again.");
                    } else {
                        res.json().then(d => alert('Failed to create poll: ' + (d.message || res.statusText)));
                    }
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsCreating(false));

    };

    const handleArchive = (id) => {
        if (!confirm('Are you sure you want to archive this poll?')) return;

        authenticatedFetch(`${import.meta.env.VITE_API_URL}/votes/${id}/archive`, {
            method: 'PUT'
        })
            .then(res => {
                if (res.ok) {
                    fetchPolls();
                } else {
                    res.json().then(d => alert('Failed to archive: ' + (d.message || res.statusText)));
                }
            })
            .catch(err => console.error(err));
    };

    const handleUnarchive = (id) => {
        if (!confirm('Are you sure you want to reactivate this poll?')) return;

        authenticatedFetch(`${import.meta.env.VITE_API_URL}/votes/${id}/unarchive`, {
            method: 'PUT'
        })
            .then(res => {
                if (res.ok) {
                    fetchPolls();
                } else {
                    res.json().then(d => alert('Failed to unarchive: ' + (d.message || res.statusText)));
                }
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-['Outfit'] font-extrabold text-[#f7afb7]">Manage Polls</h2>

            {/* Create Form */}
            <div className="bg-[#3a2f3c] p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Create New Poll</h3>
                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#ad6d94]">Poll Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. What game should I play next?"
                            className="w-full bg-[#2c242a] border border-white/10 rounded-lg p-3 text-white focus:border-[#f7afb7] outline-none"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#ad6d94]">Start Date</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full bg-[#2c242a] border border-white/10 rounded-lg p-3 text-white focus:border-[#f7afb7] outline-none calendar-icon-white"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#ad6d94]">End Date</label>
                            <input
                                type="datetime-local"
                                required
                                className="w-full bg-[#2c242a] border border-white/10 rounded-lg p-3 text-white focus:border-[#f7afb7] outline-none calendar-icon-white"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-[#ad6d94]">Options</label>
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input
                                    type="text"
                                    required
                                    placeholder={`Option ${idx + 1}`}
                                    className="w-full bg-[#2c242a] border border-white/10 rounded-lg p-3 text-white focus:border-[#f7afb7] outline-none"
                                    value={opt.label}
                                    onChange={e => handleOptionChange(idx, e.target.value)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addOption} className="text-sm font-bold text-[#f7afb7] hover:underline">+ Add Option</button>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="w-full bg-[#f7afb7] text-[#2c242a] font-black uppercase py-4 rounded-xl hover:brightness-105 transition-all disabled:opacity-50"
                        >
                            {isCreating ? 'Creating...' : 'Launch Poll'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Polls List */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Poll History</h3>
                {polls.map((poll) => (
                    <div key={poll._id} className="bg-[#3a2f3c] p-6 rounded-2xl border-2 border-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-bold text-white">{poll.title}</h4>
                                <p className="text-xs text-[#ad6d94]">Ends: {new Date(poll.endDate).toLocaleString()}</p>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded bg-[#f7afb7]/20 text-[#f7afb7]`}>
                                {poll.isActive ? 'Active' : 'Ended'}
                            </span>
                            {poll.isActive && (
                                <button
                                    onClick={() => handleArchive(poll._id)}
                                    className="text-xs cursor-pointer font-bold px-2 py-1 rounded bg-red-400/20 text-red-400 hover:bg-red-400/40 transition-colors ml-2"
                                >
                                    Archive
                                </button>
                            )}
                            {!poll.isActive && (
                                <button
                                    onClick={() => handleUnarchive(poll._id)}
                                    className="text-xs cursor-pointer font-bold px-2 py-1 rounded bg-green-400/20 text-green-400 hover:bg-green-400/40 transition-colors ml-2"
                                >
                                    Make Active
                                </button>
                            )}
                        </div>
                        <div className="space-y-2">
                            {poll.elements.map((el, i) => (
                                <div key={i} className="flex justify-between text-sm text-[#d1d1d1]">
                                    <span>{el.label}</span>
                                    <span className="font-bold">{el.count || 0} votes</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default PollManager;
