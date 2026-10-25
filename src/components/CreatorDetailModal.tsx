import { X, CheckCircle, Flame, MapPin } from 'lucide-react';
import type { Influencer, VoterState } from '../types.ts';

interface CreatorDetailModalProps {
  influencer: Influencer | null;
  onClose: () => void;
  voter: VoterState | null;
  onVote: (influencerId: string, count: number) => void;
  selectedMultiplier: number;
}

export function CreatorDetailModal({
  influencer,
  onClose,
  voter,
  onVote,
  selectedMultiplier,
}: CreatorDetailModalProps) {
  if (!influencer) return null;

  const remainingVotes = voter ? voter.remainingVotes : 99;
  const userContributed = voter?.votedBreakdown[influencer.id] || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl text-white overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Cover / Profile Banner */}
        <div className="relative h-48 bg-neutral-950">
          <img
            src={influencer.avatarUrl}
            alt={influencer.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-bold text-white">{influencer.name}</h3>
                {influencer.verified && (
                  <CheckCircle className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                )}
              </div>
              <div className="text-xs text-amber-300 font-mono">{influencer.handle}</div>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-700/60 px-3 py-1 rounded-lg text-right">
              <div className="text-xs text-neutral-400">Total Votes</div>
              <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                {influencer.votes.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-neutral-400 flex-wrap pb-2 border-b border-neutral-800">
            <span className="text-amber-400 font-semibold">{influencer.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-500" />
              {influencer.area}
            </span>
            <span aria-hidden="true">·</span>
            <span>Followers: <strong className="text-white font-mono">{influencer.followerCount}</strong></span>
          </div>

          <div>
            <h4 className="text-neutral-400 font-medium mb-1">About & Bio:</h4>
            <p className="text-neutral-200 text-sm leading-relaxed">{influencer.bio}</p>
          </div>

          {/* User's contribution */}
          <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Your Votes for this Creator</div>
              <div className="text-[11px] text-neutral-400">
                (Out of your 99 votes quota)
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black font-mono text-emerald-400 tabular-nums">
                +{userContributed}
              </span>
              <span className="text-neutral-400 text-xs"> votes</span>
            </div>
          </div>

          {/* Voting Action Section */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onVote(influencer.id, Math.min(selectedMultiplier, remainingVotes));
              }}
              disabled={remainingVotes <= 0}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-40"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>
                {remainingVotes <= 0
                  ? 'Your 99 votes quota is completed'
                  : `Vote +${Math.min(selectedMultiplier, remainingVotes)} (Remaining: ${remainingVotes}/99)`}
              </span>
            </button>

            {remainingVotes > 0 && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onVote(influencer.id, Math.min(1, remainingVotes))}
                  className="py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg"
                >
                  +1 Vote
                </button>
                <button
                  onClick={() => onVote(influencer.id, Math.min(5, remainingVotes))}
                  disabled={remainingVotes < 5}
                  className="py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg disabled:opacity-40"
                >
                  +5 Votes
                </button>
                <button
                  onClick={() => onVote(influencer.id, Math.min(10, remainingVotes))}
                  disabled={remainingVotes < 10}
                  className="py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg disabled:opacity-40"
                >
                  +10 Votes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
