import { Radio, Flame, MapPin } from 'lucide-react';
import type { ActivityLog } from '../types.ts';

interface LiveActivityFeedProps {
  activities: ActivityLog[];
}

export function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <section id="activity-section" className="py-12 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Live Voting Activity</span>
                <span className="text-xs font-mono font-normal text-emerald-400">
                  · Real-time Stream
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Live stream of incoming votes from various tehsils across Ghazipur
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-neutral-400">
            {activities.length} Recent Votes
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center text-xs text-neutral-400">
            No live votes logged yet in this round. Be the first voter!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activities.slice(0, 6).map((act) => (
              <div
                key={act.id}
                className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-neutral-200 font-semibold truncate">
                      {act.influencerName}
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-neutral-500" />
                      <span>{act.area}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-neutral-500">{formatTime(act.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                    +{act.votesAdded}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
