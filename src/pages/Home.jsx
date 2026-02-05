import ProfileHeader from '../components/ProfileHeader';
import VotingSection from '../components/VotingSection';
import ScheduleSection from '../components/ScheduleSection';
import DiscordCTA from '../components/DiscordCTA';
import Footer from '../components/Footer';

function Home({ profileData }) {
    return (
        <div className="font-['Fredoka'] min-h-screen flex flex-col relative text-[var(--white)]">
            <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center gap-20 flex-grow w-full relative z-10">
                <ProfileHeader profileData={profileData} />


                <section className="flex flex-col gap-12 w-full">
                    <ScheduleSection />
                    <VotingSection />
                </section>

                <DiscordCTA />

                <div className="flex items-center gap-12 text-[var(--color-dusty-rose)] opacity-40 py-10">
                    <span className="material-symbols-outlined text-7xl">pets</span>
                    <span className="material-symbols-outlined text-5xl">pets</span>
                    <span className="material-symbols-outlined text-7xl">pets</span>
                </div>
            </main>

            <Footer />

            {/* Background Blobs */}
            <div className="fixed top-20 left-10 w-48 h-48 bg-[var(--color-dusty-rose)] rounded-full blur-[120px] opacity-10 -z-0"></div>
            <div className="fixed bottom-20 right-10 w-64 h-64 bg-[var(--color-soft-pink)] rounded-full blur-[150px] opacity-10 -z-0"></div>
        </div>
    );
}

export default Home;
