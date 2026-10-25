import { ShieldCheck, Flame } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onScrollToVote: () => void;
}

export function Header({ onOpenAdmin, isAdminLoggedIn, onScrollToVote }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-white font-display uppercase whitespace-nowrap shrink-0 hover:text-amber-400 transition-colors"
        >
          Ghazipur Creator Awards
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a
            href="#vote-section"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Vote Creators
          </a>
          <a
            href="#leaderboard-section"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Leaderboard
          </a>
          <a
            href="#activity-section"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Live Activity
          </a>
          <a
            href="#rules-section"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Rules (99 Votes)
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAdminLoggedIn ? (
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-neutral-950 hover:bg-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          ) : (
            <button
              onClick={onScrollToVote}
              className="px-4 py-2 text-xs font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Vote Now</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
