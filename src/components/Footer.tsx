export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Ghazipur Creator Awards · Ghazipur Influencer League
            </div>
            <p className="text-neutral-500">
              Weekly voting hub for digital creators and youth icons in Ghazipur, Uttar Pradesh (PIN 233001).
            </p>
          </div>

          <div className="flex items-center gap-6 text-neutral-400">
            <a href="#vote-section" className="hover:text-white transition-colors">
              Voting Arena
            </a>
            <a href="#leaderboard-section" className="hover:text-white transition-colors">
              Leaderboard
            </a>
            <a href="#rules-section" className="hover:text-white transition-colors">
              99 Votes Rules
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-600 gap-2">
          <div>
            © {new Date().getFullYear()} Ghazipur Creator Awards. All rights reserved.
          </div>
          <div>
            Real-Time Updates via Server-Sent Events · 99 Votes Quota Algorithm
          </div>
        </div>
      </div>
    </footer>
  );
}
