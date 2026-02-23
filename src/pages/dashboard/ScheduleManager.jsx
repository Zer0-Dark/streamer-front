import { useEffect, useState } from 'react';
import { authenticatedFetch } from '../../utils/api';

function ScheduleManager() {
    const [schedule, setSchedule] = useState([]);
    const [newItem, setNewItem] = useState({
        day: '',
        streamTitle: '',
        startTime: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit state
    const [editingEvent, setEditingEvent] = useState(null);
    const [editForm, setEditForm] = useState({
        day: '',
        streamTitle: '',
        startTime: ''
    });

    const fetchSchedule = () => {
        fetch(`${import.meta.env.VITE_API_URL}/calendar`)
            .then(res => res.json())
            .then(data => setSchedule(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const handleAdd = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simple validation? API probably handles some.
        // API expects: day (Date string), streamTitle, startTime
        // We'll format day to ISO string if needed or just pass the date picker value

        authenticatedFetch(`${import.meta.env.VITE_API_URL}/calendar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem)
        })
            .then(res => {
                if (res.ok) {
                    setNewItem({ day: '', streamTitle: '', startTime: '' }); // Reset form
                    fetchSchedule(); // Refresh list
                } else {
                    alert('Failed to add schedule item');
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsSubmitting(false));

    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        authenticatedFetch(`${import.meta.env.VITE_API_URL}/calendar/${id}`, {
            method: 'DELETE',
        })
            .then(res => {
                if (res.ok) {
                    fetchSchedule();
                } else {
                    alert('Failed to delete event');
                }
            })
            .catch(err => console.error(err));
    };

    const handleStartEdit = (event) => {
        setEditingEvent(event._id);
        setEditForm({
            day: event.day.split('T')[0], // Extract date part from ISO string
            streamTitle: event.streamTitle,
            startTime: event.startTime
        });
    };

    const handleCancelEdit = () => {
        setEditingEvent(null);
        setEditForm({ day: '', streamTitle: '', startTime: '' });
    };

    const handleUpdateEvent = (eventId) => {
        setIsSubmitting(true);

        authenticatedFetch(`${import.meta.env.VITE_API_URL}/calendar/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editForm)
        })
            .then(res => {
                if (res.ok) {
                    setEditingEvent(null);
                    setEditForm({ day: '', streamTitle: '', startTime: '' });
                    fetchSchedule();
                } else {
                    alert('Failed to update event');
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-['Outfit'] font-extrabold text-[#f7afb7]">Manage Schedule</h2>

            {/* Add Form */}
            <div className="bg-[#3a2f3c] p-8 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Add New Stream Slot</h3>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#ad6d94]">Date</label>
                        <input
                            type="date"
                            required
                            className="w-full bg-[#2c242a] border border-white/10 rounded-lg p-3 text-white focus:border-[#f7afb7] outline-none"
                            value={newItem.day}
                            onChange={e => setNewItem({ ...newItem, day: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#ad6d94]">Stream Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Apex Legends"
                            className="w-full bg-[#2c242a] border border-white/10 rounded-lg p-3 text-white focus:border-[#f7afb7] outline-none"
                            value={newItem.streamTitle}
                            onChange={e => setNewItem({ ...newItem, streamTitle: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#ad6d94]">Start Time</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. 8:00 PM EST"
                            className="w-full bg-[#2c242a] border border-white/10 rounded-lg p-3 text-white focus:border-[#f7afb7] outline-none"
                            value={newItem.startTime}
                            onChange={e => setNewItem({ ...newItem, startTime: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#f7afb7] text-[#2c242a] font-black uppercase py-4 rounded-xl hover:brightness-105 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Adding...' : '+ Add to Schedule'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-[#3a2f3c] rounded-[1.5rem] border-2 border-white/10 p-8 overflow-hidden">
                <div className="overflow-x-auto rounded-2xl bg-[#2c242a] border-2 border-white/10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/10">
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Title</th>
                                <th className="px-6 py-4 text-xs font-black text-white uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {schedule.map((item) => (
                                <tr key={item._id} className={`hover:bg-white/5 transition-colors ${editingEvent === item._id ? 'bg-[#f7afb7]/10' : ''}`}>
                                    {editingEvent === item._id ? (
                                        // Edit mode
                                        <>
                                            <td className="px-6 py-5">
                                                <input
                                                    type="date"
                                                    className="w-full bg-[#2c242a] border border-[#f7afb7] rounded-lg p-2 text-white focus:border-[#f7afb7] outline-none text-sm"
                                                    value={editForm.day}
                                                    onChange={e => setEditForm({ ...editForm, day: e.target.value })}
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <input
                                                    type="text"
                                                    className="w-full bg-[#2c242a] border border-[#f7afb7] rounded-lg p-2 text-white focus:border-[#f7afb7] outline-none"
                                                    value={editForm.streamTitle}
                                                    onChange={e => setEditForm({ ...editForm, streamTitle: e.target.value })}
                                                />
                                            </td>
                                            <td className="px-6 py-5">
                                                <input
                                                    type="text"
                                                    className="w-full bg-[#2c242a] border border-[#f7afb7] rounded-lg p-2 text-white focus:border-[#f7afb7] outline-none text-sm"
                                                    value={editForm.startTime}
                                                    onChange={e => setEditForm({ ...editForm, startTime: e.target.value })}
                                                />
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleUpdateEvent(item._id)}
                                                        disabled={isSubmitting}
                                                        className="text-green-400 hover:text-green-300 transition-colors material-symbols-outlined disabled:opacity-50"
                                                        title="Save"
                                                    >
                                                        check_circle
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        disabled={isSubmitting}
                                                        className="text-gray-400 hover:text-gray-300 transition-colors material-symbols-outlined disabled:opacity-50"
                                                        title="Cancel"
                                                    >
                                                        cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        // View mode
                                        <>
                                            <td className="px-6 py-5 text-sm font-bold text-white">{new Date(item.day).toLocaleDateString()}</td>
                                            <td className="px-6 py-5 font-bold text-[#f7afb7]">{item.streamTitle}</td>
                                            <td className="px-6 py-5 text-sm font-medium text-white">{item.startTime}</td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleStartEdit(item)}
                                                        className="text-[#f7afb7] hover:text-[#f7afb7]/80 transition-colors material-symbols-outlined"
                                                        title="Edit"
                                                    >
                                                        edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors material-symbols-outlined"
                                                        title="Delete"
                                                    >
                                                        delete
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {schedule.length === 0 && (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-500">No events scheduled.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ScheduleManager;
