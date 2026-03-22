interface HeaderProps {
  page: "list" | "dashboard";
  tickers?: string[];
  onBack?: () => void;
}

const navTabs = ["Terminal", "Markets", "Analytics"] as const;

export default function Header({ page, tickers, onBack }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0e0e0e]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold text-primary text-glow-green tracking-tight font-headline">
            SIGNALSTACK
          </h1>
          <nav className="hidden sm:flex items-center gap-1">
            {navTabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border-none ${
                  tab === "Terminal"
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-500 hover:text-zinc-300 bg-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Dashboard ticker pills + back button */}
        {page === "dashboard" && (
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to List
              </button>
            )}
            {tickers && tickers.length > 0 && (
              <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/5">
                {tickers.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold text-primary bg-primary/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right: Icons */}
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors cursor-pointer bg-transparent border-none">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
