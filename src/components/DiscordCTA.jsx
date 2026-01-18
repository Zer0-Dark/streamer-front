import { useEffect, useState } from 'react';

function DiscordCTA() {
    const [discordLink, setDiscordLink] = useState("#");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users`)
            .then(res => res.json())
            .then(data => {
                let profile = null;
                if (Array.isArray(data)) profile = data[0];
                else profile = data;

                if (profile && profile.socialLinks) {
                    const discord = profile.socialLinks.find(link => link.platform.toLowerCase() === 'discord');
                    if (discord) {
                        setDiscordLink(discord.url);
                    }
                }
            })
            .catch(err => console.error("Failed to fetch profile for Discord link:", err));
    }, []);

    return (
        <section className="w-full flex flex-col items-center mt-10">
            <div className="w-full max-w-2xl bg-[var(--color-dark-purple)] border-2 border-[var(--color-soft-pink)] rounded-[2.5rem] p-8 md:p-12 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-9xl">chat_bubble</span>
                </div>
                <h3 className="text-4xl font-bold text-[var(--color-soft-pink)] mb-6 flex items-center justify-center gap-4">
                    <span className="material-symbols-outlined text-5xl">pets</span>
                    JOIN THE LITTER
                </h3>
                <p className="text-xl text-white mb-10 max-w-md mx-auto">
                    Hang out with the community, get stream updates, and share your favorite cat pics!
                </p>
                <a className="inline-flex items-center gap-6 bg-white text-[var(--color-deep-mauve)] hover:bg-[var(--color-soft-pink)] px-12 py-6 rounded-full font-black text-3xl transition-all transform hover:scale-105 shadow-2xl group" href={discordLink} target="_blank" rel="noopener noreferrer">
                    <img alt="Discord" className="w-10 h-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD13dqmP5MUjY3WL-ZOp-PL4Qy-CVRxEMaFwq12xgq-nugopWuX1r6E7IXRehaxbFP_sz47ss9m8hjZOVKVVEs6oydnsfQKqpM-94N7veiEYh5T6Kj9tgVuMDB47zIbqt6K-bSGr0LnPjADMsrGge4eT9_0nJ0TEKOHtRHYY_cYRoEYgiRr8HGF-rXVe1ZEcL-DMHwDXB-9qVPuMaX0AHi0NRBZdaydFiXN6jm52nM7rldePPrY59eZGp1re6UYE4pKLXRcdOouMM" />
                    JOIN DISCORD
                    <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">east</span>
                </a>
            </div>
        </section>
    );
}

export default DiscordCTA;
