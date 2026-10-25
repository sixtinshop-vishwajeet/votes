import { Shield } from 'lucide-react';

export function RulesSection() {
  const rules = [
    {
      title: '1 Person = 99 Votes Quota',
      desc: 'Every voter gets a dedicated quota of 99 votes per week. You can cast +1, +5, +10, +25, or all your remaining votes together at your own pace.',
    },
    {
      title: 'Full Distribution Flexibility',
      desc: 'No restriction to vote for just one person. Distribute your 99 votes across multiple creators in comedy, vlogging, folk music, or tech!',
    },
    {
      title: 'Weekly Sunday Midnight Cutoff',
      desc: 'Voting closes every Sunday at 11:59 PM. The creator leading with highest votes is crowned the official "Ghazipur Creator of the Week".',
    },
    {
      title: '100% Real-Time & Transparent',
      desc: 'All votes are synced instantly across devices through Server-Sent Events with transparent audit trails for all participants.',
    },
  ];

  return (
    <section id="rules-section" className="py-14 border-b border-neutral-800 bg-neutral-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Explanatory Rules Grid */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Fair Voting Guidelines</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Voting Rules & 99 Votes Quota System
              </h2>
              <p className="text-sm text-neutral-400 mt-2">
                Ghazipur Creator Awards provides a transparent and exciting platform to recognize regional digital creators.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      0{idx + 1}
                    </div>
                    <h4 className="font-bold text-sm text-white">{rule.title}</h4>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Studio Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-900">
              <img
                src="/src/assets/images/ghazipur_community_banner_1792916417456.jpg"
                alt="Ghazipur Creative Studio"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent flex flex-col justify-end p-5">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Ghazipur Digital Movement
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  Empowering digital storytellers and talent from Ghazipur & Purvanchal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
