import { useEffect, useState } from 'react';

function PollCard({ initialPoll }) {
    const [poll, setPoll] = useState(initialPoll);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [hasVoted, setHasVoted] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    // Update local state if prop changes (optional, but good for sync)
    useEffect(() => {
        setPoll(initialPoll);

        // Check if poll has ended
        if (initialPoll && initialPoll.endDate && new Date(initialPoll.endDate) < new Date()) {
            setIsEnded(true);
        } else {
            setIsEnded(false); // Reset if poll changes and is no longer ended
        }

        // Check if user has voted on this poll
        const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
        if (initialPoll && votedPolls.includes(getObjectId(initialPoll._id))) {
            setHasVoted(true);
        } else {
            setHasVoted(false); // Reset if poll changes and user hasn't voted on new poll
        }
    }, [initialPoll]);

    const getObjectId = (obj) => {
        if (!obj) return null;
        if (typeof obj === 'string') return obj;
        if (obj.$oid) return obj.$oid;
        return obj.toString();
    };

    const handleCastVote = () => {
        const pollId = getObjectId(poll?._id);
        if (!selectedOptionId || !pollId) return;

        setIsSubmitting(true);
        fetch(`${import.meta.env.VITE_API_URL}/votes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voteId: pollId, elementId: selectedOptionId })
        })
            .then(res => {
                if (res.ok) {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);

                    // Track vote in localStorage
                    const votedPolls = JSON.parse(localStorage.getItem('votedPolls') || '[]');
                    if (!votedPolls.includes(pollId)) {
                        votedPolls.push(pollId);
                        localStorage.setItem('votedPolls', JSON.stringify(votedPolls));
                    }
                    setHasVoted(true);

                    setPoll(prev => {
                        if (!prev) return prev;
                        const newElements = prev.elements.map(el => {
                            const elId = getObjectId(el._id) || el.label;
                            if (elId === selectedOptionId) {
                                return { ...el, count: (el.count || 0) + 1 };
                            }
                            return el;
                        });
                        return { ...prev, elements: newElements };
                    });

                    setSelectedOptionId(null);
                } else {
                    res.json().then(data => alert("Failed to cast vote: " + (data.message || "Unknown error")));
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsSubmitting(false));
    };

    const totalVotes = poll.elements.reduce((acc, el) => acc + (el.count || 0), 0);

    return (
        <div className={`rounded-3xl overflow-visible flex flex-col shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] bg-[var(--color-dark-purple)] border-2 ${isEnded ? 'border-gray-500/30' : 'border-[rgba(173,109,148,0.3)]'} relative ${isEnded ? 'opacity-80 grayscale-[0.5]' : ''}`}>
            <div className={`relative ${isEnded ? 'bg-gray-600' : 'bg-[var(--color-dusty-rose)]'} text-white rounded-t-[1.5rem] py-5 px-8 flex items-center justify-center gap-3`}>
                <div className={`absolute -top-4 left-6 w-9 h-[30px] ${isEnded ? 'bg-gray-600' : 'bg-[var(--color-dusty-rose)]'}`} style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                <div className={`absolute -top-4 right-6 w-9 h-[30px] ${isEnded ? 'bg-gray-600' : 'bg-[var(--color-dusty-rose)]'}`} style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                <span className="material-symbols-outlined text-2xl">{isEnded ? 'timer_off' : 'ballot'}</span>
                <h2 className="text-2xl font-bold uppercase tracking-widest">{poll.title} {isEnded && '(ENDED)'}</h2>
            </div>
            <div className="p-10 space-y-8">
                <div className="space-y-6">
                    {poll.elements.map((option) => {
                        const percentage = totalVotes === 0 ? 0 : Math.round(((option.count || 0) / totalVotes) * 100);
                        const optionId = getObjectId(option._id) || option.label;
                        const isSelected = selectedOptionId === optionId;

                        return (
                            <button
                                key={optionId}
                                onClick={() => !hasVoted && !isEnded && setSelectedOptionId(optionId)}
                                disabled={hasVoted || isEnded}
                                className={`w-full group relative overflow-hidden bg-[var(--color-deep-brown-mauve)] border-2 p-6 rounded-2xl flex items-center justify-between transition-all ${hasVoted || isEnded ? 'cursor-default' : 'cursor-pointer'} ${isSelected ? 'border-[var(--color-soft-pink)] ring-2 ring-[var(--color-soft-pink)] shadow-[0_0_15px_rgba(247,175,183,0.3)]' : 'border-[var(--color-soft-pink)]/30 hover:border-[var(--color-soft-pink)]'}`}
                            >
                                <div className="flex items-center gap-4 relative z-10 text-left">
                                    <span className={`material-symbols-outlined ${isSelected ? 'text-[var(--color-soft-pink)] scale-110' : 'text-[var(--color-soft-pink)]/60'} transition-transform`}>
                                        {isSelected ? 'check_circle' : 'pets'}
                                    </span>
                                    <div>
                                        <span className="font-bold text-2xl text-white block">{option.label}</span>
                                        <span className="text-sm font-bold text-[var(--color-soft-pink)]/80">{option.count || 0} Votes</span>
                                    </div>
                                </div>
                                <span className="text-[var(--color-soft-pink)] font-black text-2xl relative z-10">{percentage}%</span>
                                <div className="absolute top-0 left-0 h-full bg-[var(--color-dusty-rose)]/40 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={handleCastVote}
                    disabled={!selectedOptionId || isSubmitting || hasVoted || isEnded}
                    className={`w-full py-5 font-black text-2xl rounded-2xl transition-all transform shadow-xl flex items-center justify-center gap-2 ${!selectedOptionId || isSubmitting || hasVoted || isEnded
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                        : 'bg-[var(--color-soft-pink)] text-[var(--color-deep-mauve)] hover:bg-white hover:scale-[1.02] active:scale-95 cursor-pointer'
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                            SENDING...
                        </>
                    ) : hasVoted ? (
                        "VOTE SUBMITTED"
                    ) : isEnded ? (
                        "POLL ENDED"
                    ) : (
                        "CAST YOUR VOTE"
                    )}
                </button>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-deep-brown-mauve)] border-2 border-[var(--color-soft-pink)] text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce z-50">
                    <span className="material-symbols-outlined text-[var(--color-soft-pink)] text-3xl">sentiment_very_satisfied</span>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg text-[var(--color-soft-pink)]">Vote Submitted!</span>
                        <span className="text-sm">Thanks for participating!</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function VotingSection() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/votes/active`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPolls(data);
                }
            })
            .catch(err => console.error("Failed to fetch votes:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="rounded-3xl overflow-visible flex flex-col shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] bg-[var(--color-dark-purple)] border-2 border-[rgba(173,109,148,0.3)] min-h-[300px] items-center justify-center text-white">
            <p>Loading Polls...</p>
        </div>
    );

    if (polls.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {polls.map(poll => (
                <PollCard key={poll._id || Math.random()} initialPoll={poll} />
            ))}
        </div>
    );
}

export default VotingSection;
