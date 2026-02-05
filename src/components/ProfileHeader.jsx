import { useEffect, useState } from 'react';
import leftEarImage from '../assets/leftEar.png';
import rightEarImage from '../assets/rightEar.png';

function ProfileHeader({ profileData: initialProfileData }) {
    const [profile, setProfile] = useState(initialProfileData);

    useEffect(() => {
        // Only fetch if we don't have initial data
        if (!initialProfileData) {
            fetch(`${import.meta.env.VITE_API_URL}/users`)
                .then(res => res.json())
                .then(data => {
                    // Handle both array (take first) or single object
                    if (Array.isArray(data)) setProfile(data[0]);
                    else setProfile(data);
                })
                .catch(err => console.error("Failed to fetch profile:", err));
        }
    }, [initialProfileData]);

    if (!profile) return <div className="text-center py-20 text-white">Loading Profile...</div>;

    return (
        <header className="flex flex-col items-center text-center space-y-8  w-full">
            {/* Login Icon - Top Right */}
            <a href="/login" className="fixed top-6 right-6 p-3 text-[var(--color-soft-pink)] hover:text-white transition-all opacity-70 hover:opacity-100 hover:scale-110 z-50 bg-[var(--color-dark-purple)] rounded-full border-2 border-[var(--color-soft-pink)] shadow-lg" title="Login">
                <span className="material-symbols-outlined text-3xl">pets</span>
            </a>


            <div className="relative">
                {/* Cat Ears */}
                <img
                    src={leftEarImage}
                    alt="Left cat ear"
                    className="absolute -top-4 -left-2 w-20 h-auto z-10 pointer-events-none rotate-3"
                />
                <img
                    src={rightEarImage}
                    alt="Right cat ear"
                    className="absolute -top-4 -right-1 rotate-4 w-20 h-auto z-10 pointer-events-none "
                />
                <div className="relative w-68 h-68 rounded-full overflow-hidden border-8 border-[var(--color-dusty-rose)] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]">
                    <img alt="Profile Avatar" className="w-full h-full object-cover" src={profile.photoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBGa4-6ISc04wklHrQTImhbrLJStHisCPtH1Q5p44-DrEgnd5yRdsHp4vFtD0lm_ZZq34h2CAKjOm1YMTX3z4WnGBx2LVcz8dOV7jTrsTwG2UBUMDmxrLzTmS4oSy2X3HrGJBxHl6MiSLmBDCesxVdOul9fJ5juKm2L3xvTEIDYG1ekun7nbd1EUunsMt_P4yRXNeK8MOb1ZLP1nw-LV0czArQDkKSDGiwcc3IElDE2y54xpjp2zMbT-2eaIfB0at28zEDgm37MItw"} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[var(--color-soft-pink)] p-3 rounded-full shadow-xl">
                    <span className="material-symbols-outlined text-[var(--color-deep-mauve)] text-3xl">pets</span>
                </div>
            </div>
            <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--color-soft-pink)] drop-shadow-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{profile.name || "Black Cat"}</h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-[var(--color-dusty-rose)]">potted_plant</span>
                    {profile.info || "The coziest corner of the web"}
                    <span className="material-symbols-outlined text-[var(--color-dusty-rose)]">potted_plant</span>
                </p>
            </div>
            <div className="flex gap-8 mt-6">
                {profile.socialLinks?.map((link, index) => {
                    const platformLower = link.platform.toLowerCase();
                    const iconMap = {
                        'twitch': 'https://cdn.simpleicons.org/twitch/white',
                        'youtube': 'https://cdn.simpleicons.org/youtube/white',
                        'instagram': 'https://cdn.simpleicons.org/instagram/white',
                        'discord': 'https://cdn.simpleicons.org/discord/white'
                    };

                    // Array of available GIFs
                    const gifs = [
                        '/src/assets/gifs/food.gif',
                        '/src/assets/gifs/hurt.gif',
                        '/src/assets/gifs/laugh.gif',
                        '/src/assets/gifs/stream.gif'
                    ];

                    // Pick a GIF for this link (cycles through the array)
                    const gifForLink = gifs[index % gifs.length];

                    return (
                        <div key={index} className="relative group">
                            <a aria-label={link.platform} className="hover:scale-110 transition-transform p-4 rounded-2xl bg-[var(--color-dark-purple)] border-2 border-[var(--color-soft-pink)] shadow-lg block" href={link.url} target="_blank" rel="noopener noreferrer">
                                {iconMap[platformLower] ? (
                                    <img alt={link.platform} className="w-8 h-8" src={iconMap[platformLower]} />
                                ) : (
                                    <span className="material-symbols-outlined text-white">link</span>
                                )}
                            </a>
                        </div>
                    );
                })}
            </div>
        </header>
    );
}

export default ProfileHeader;
