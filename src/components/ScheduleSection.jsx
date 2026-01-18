import { useEffect, useState } from 'react';

function ScheduleSection() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/calendar`)
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error("Failed to fetch schedule:", err));
    }, []);

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return (
        <div className="rounded-3xl overflow-visible flex flex-col shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] bg-[var(--color-deep-brown-mauve)] border-2 border-[rgba(173,109,148,0.2)]">
            <div className="relative bg-[var(--color-dusty-rose)] text-white rounded-t-[1.5rem] py-5 px-8 flex items-center justify-center gap-3">
                <div className="absolute -top-4 left-6 w-9 h-[30px] bg-[var(--color-dusty-rose)]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                <div className="absolute -top-4 right-6 w-9 h-[30px] bg-[var(--color-dusty-rose)]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
                <h2 className="text-2xl font-bold uppercase tracking-widest">Stream Schedule</h2>
            </div>
            <div className="p-10 space-y-6">
                {events.length === 0 ? (
                    <div className="text-center text-gray-400">Loading schedule...</div>
                ) : (
                    events.map((event) => (
                        <div key={event._id || event.id} className="flex items-center justify-between p-6 rounded-2xl bg-[var(--color-deep-mauve)] border-l-8 border-[var(--color-soft-pink)]">
                            <div>
                                <p className="text-sm uppercase font-black text-[var(--color-soft-pink)] tracking-tighter">{getDayName(event.day)}</p>
                                <p className="text-2xl font-bold text-white">{event.streamTitle}</p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <p className="text-xl font-bold text-white">{event.startTime}</p>
                                <span className="material-symbols-outlined text-[var(--color-soft-pink)]">schedule</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ScheduleSection;
