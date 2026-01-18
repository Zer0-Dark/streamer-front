function Footer() {
    return (
        <footer className="w-full bg-[var(--color-deep-brown-mauve)] border-t-2 border-[var(--color-dusty-rose)] py-6 px-10 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-[12px] tracking-tight" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                <div className="flex items-center gap-4 text-[var(--color-soft-pink)]">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_0_0_rgba(34,197,94,0.7)]" style={{ animation: "pulse-green 2s infinite" }}></div>
                    <span>SYSTEM ONLINE (V 3.4)</span>
                </div>
                <a className="text-[var(--color-soft-pink)]/80 hover:text-white transition-colors uppercase" href="#">
                    @2024 PUBLISHED BY ZER00DARK
                </a>
            </div>
            <style>{`
         @keyframes pulse-green {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
        </footer>
    );
}

export default Footer;
