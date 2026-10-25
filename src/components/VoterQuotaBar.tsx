import { Volume2, VolumeX, Zap } from 'lucide-react';
import type { VoterState } from '../types.ts';

interface VoterQuotaBarProps {
  voter: VoterState | null;
  selectedMultiplier: number;
  onSelectMultiplier: (m: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function VoterQuotaBar({
  voter,
  selectedMultiplier,
  onSelectMultiplier,
  isMuted,
  onToggleMute,
}: VoterQuotaBarProps) {
  const maxVotes = 99;
  const usedVotes = voter ? voter.usedVotes : 0;
  const remainingVotes = voter ? Math.max(0, maxVotes - usedVotes) : 99;
  const percentageUsed = Math.min(100, Math.round((usedVotes / maxVotes) * 100));

  const multipliers = [1, 5, 10, 25];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xl mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Quota status & Gauge */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Weekly Voting Quota</span>
              <span className="text-xs text-neutral-400">· Strictly 99 Votes / Week</span>
            </div>

            <div className="text-right">
              <span className="text-xl font-extrabold font-mono text-amber-400 tabular-nums">
                {remainingVotes}
              </span>
              <span className="text-xs text-neutral-400 font-mono"> / {maxVotes} Left</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                remainingVotes === 0
                  ? 'bg-rose-500'
                  : remainingVotes < 20
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${100 - percentageUsed}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span>
              {remainingVotes === 0 ? (
                <span className="text-rose-400 font-medium">
                  Aapka is week ka 99 votes quota khatam ho chuka hai! (Next week new quota milega)
                </span>
              ) : (
                <span>
                  Used: <strong className="text-neutral-200">{usedVotes}</strong> votes · Remaining: <strong className="text-amber-400">{remainingVotes}</strong>
                </span>
              )}
            </span>
            <span className="hidden sm:inline">
              Aap apne 99 votes kisi ek creator ya alag-alag creators me distribute kar sakte hain
            </span>
          </div>
        </div>

        {/* Right: Multiplier Quick Selector & Sound Toggle */}
        <div className="flex flex-wrap items-center gap-3 lg:border-l lg:border-neutral-800 lg:pl-6">
          <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <span className="text-xs font-semibold text-neutral-400 px-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Speed:</span>
            </span>
            {multipliers.map((m) => {
              const isSelected = selectedMultiplier === m;
              return (
                <button
                  key={m}
                  onClick={() => onSelectMultiplier(m)}
                  disabled={remainingVotes < m && remainingVotes > 0}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  } ${remainingVotes < m ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  +{m}
                </button>
              );
            })}

            {/* Quick vote all remaining button */}
            {remainingVotes > 0 && remainingVotes !== 1 && (
              <button
                onClick={() => onSelectMultiplier(remainingVotes)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedMultiplier === remainingVotes
                    ? 'bg-amber-500 text-neutral-950'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-neutral-800'
                }`}
                title="Cast all remaining votes at once"
              >
                All ({remainingVotes})
              </button>
            )}
          </div>

          {/* Sound toggle button */}
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors border border-neutral-700/60"
            title={isMuted ? 'Turn on sound' : 'Mute sound'}
            aria-label="Toggle voting sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}
