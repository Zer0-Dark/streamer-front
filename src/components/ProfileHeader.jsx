import { useEffect, useState } from 'react';

function ProfileHeader() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users`)
            .then(res => res.json())
            .then(data => {
                // Handle both array (take first) or single object
                if (Array.isArray(data)) setProfile(data[0]);
                else setProfile(data);
            })
            .catch(err => console.error("Failed to fetch profile:", err));
    }, []);

    if (!profile) return <div className="text-center py-20 text-white">Loading Profile...</div>;

    return (
        <header className="flex flex-col items-center text-center space-y-8 relative w-full">
            {/* Login Icon */}
            <a href="/login" className="absolute top-0 left-0 p-2 text-[var(--color-soft-pink)] hover:text-white transition-colors opacity-50 hover:opacity-100" title="Login">
                <span className="material-symbols-outlined text-3xl">login</span>
            </a>

            <div className="relative">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-[var(--color-dusty-rose)]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                <div className="absolute -top-6 right-8 w-12 h-12 bg-[var(--color-dusty-rose)]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-8 border-[var(--color-dusty-rose)] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]">
                    <img alt="Profile Avatar" className="w-full h-full object-cover" src={profile.photoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBGa4-6ISc04wklHrQTImhbrLJStHisCPtH1Q5p44-DrEgnd5yRdsHp4vFtD0lm_ZZq34h2CAKjOm1YMTX3z4WnGBx2LVcz8dOV7jTrsTwG2UBUMDmxrLzTmS4oSy2X3HrGJBxHl6MiSLmBDCesxVdOul9fJ5juKm2L3xvTEIDYG1ekun7nbd1EUunsMt_P4yRXNeK8MOb1ZLP1nw-LV0czArQDkKSDGiwcc3IElDE2y54xpjp2zMbT-2eaIfB0at28zEDgm37MItw"} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[var(--color-soft-pink)] p-3 rounded-full shadow-xl">
                    <span className="material-symbols-outlined text-[var(--color-deep-mauve)] text-3xl">pets</span>
                </div>
            </div>
            <div className="space-y-4">
                <h1 className="text-7xl font-extrabold tracking-tight text-[var(--color-soft-pink)] drop-shadow-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{profile.name || "Black Cat"}</h1>
                <p className="text-2xl text-white font-semibold flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-[var(--color-dusty-rose)]">potted_plant</span>
                    {profile.info || "The coziest corner of the web"}
                    <span className="material-symbols-outlined text-[var(--color-dusty-rose)]">potted_plant</span>
                </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 mt-6">
                {profile.socialLinks?.map((link, index) => (
                    <a key={index} aria-label={link.platform} className="hover:scale-110 transition-transform p-4 rounded-2xl bg-[var(--color-dark-purple)] border-2 border-[var(--color-soft-pink)] shadow-lg" href={link.url} target="_blank" rel="noopener noreferrer">
                        {['twitch', 'youtube', 'instagram', 'discord'].includes(link.platform.toLowerCase()) ? (
                            <img alt={link.platform} className="w-8 h-8 filter brightness-0 invert" src={`https://cdn.simpleicons.org/${link.platform.toLowerCase()}`} />
                        ) : (
                            <span className="material-symbols-outlined text-white">link</span>
                        )}
                    </a>
                ))}
            </div>
        </header>
    );
}

export default ProfileHeader;
