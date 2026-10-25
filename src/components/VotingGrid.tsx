import { useState, useMemo } from 'react';
import { Search, CheckCircle, ExternalLink, Flame, Trophy, Instagram, Youtube } from 'lucide-react';
import type { Influencer, CreatorCategory, VoterState } from '../types.ts';

interface VotingGridProps {
  influencers: Influencer[];
  voter: VoterState | null;
  selectedMultiplier: number;
  onVote: (influencerId: string, count: number) => void;
  votingInfluencerId: string | null;
  onSelectCreator: (influencer: Influencer) => void;
}

const CATEGORIES: CreatorCategory[] = [
  'All',
  'Comedy & Roasts',
  'Vlogs & Lifestyle',
  'Bhojpuri & Folk',
  'Music & Rap',
  'Tech & Education',
  'Fitness & Lifestyle',
];

export function VotingGrid({
  influencers,
  voter,
  selectedMultiplier,
  onVote,
  votingInfluencerId,
  onSelectCreator,
}: VotingGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<CreatorCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'votes' | 'followers' | 'name'>('votes');
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  const remainingVotes = voter ? voter.remainingVotes : 99;

  const filteredInfluencers = useMemo(() => {
    return influencers
      .filter((inf) => {
        const matchesCategory =
          selectedCategory === 'All' || inf.category === selectedCategory;
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          inf.name.toLowerCase().includes(query) ||
          inf.handle.toLowerCase().includes(query) ||
          inf.area.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'votes') return b.votes - a.votes;
        if (sortBy === 'followers') {
          const parseFollowers = (val: string) => {
            const num = parseFloat(val);
            if (val.toUpperCase().includes('M')) return num * 1000000;
            if (val.toUpperCase().includes('K')) return num * 1000;
            return num || 0;
          };
          return parseFollowers(b.followerCount) - parseFollowers(a.followerCount);
        }
        return a.name.localeCompare(b.name);
      });
  }, [influencers, selectedCategory, searchQuery, sortBy]);

  const maxVotes = useMemo(() => {
    return Math.max(1, ...influencers.map((i) => i.votes));
  }, [influencers]);

  const handleVoteClick = (influencerId: string, count: number) => {
    if (remainingVotes <= 0) return;
    const finalCount = Math.min(count, remainingVotes);
    setJustVotedId(influencerId);
    setTimeout(() => setJustVotedId(null), 800);
    onVote(influencerId, finalCount);
  };

  return (
    <section id="vote-section" className="py-12 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              Active Voting Arena
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Vote for Ghazipur Influencers
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Click to cast votes from your 99 quota. Votes update instantly on the leaderboard with real-time sync.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, handle, or area..."
              className="w-full bg-neutral-900 border border-neutral-800 text-sm rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Controls: Interactive Category Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {cat === 'All' ? 'All Categories' : cat}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'votes' | 'followers' | 'name')}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
            >
              <option value="votes">Most Votes</option>
              <option value="followers">Follower Count</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Influencers Cards Grid */}
        {filteredInfluencers.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <Search className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
            <p className="text-neutral-300 font-medium">No influencers found</p>
            <p className="text-xs text-neutral-500 mt-1">Try changing your search term or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredInfluencers.map((influencer) => {
              const globalRank =
                [...influencers]
                  .sort((a, b) => b.votes - a.votes)
                  .findIndex((i) => i.id === influencer.id) + 1;

              const isVoting = votingInfluencerId === influencer.id;
              const isJustVoted = justVotedId === influencer.id;
              const voteShare = Math.round((influencer.votes / maxVotes) * 100);
              const voterContributed = voter?.votedBreakdown[influencer.id] || 0;

              return (
                <div
                  key={influencer.id}
                  className={`relative bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group ${
                    isJustVoted
                      ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-500/10'
                      : 'border-neutral-800 hover:border-neutral-700 shadow-md'
                  }`}
                >
                  {/* Floating Vote Pulse Indicator */}
                  {isJustVoted && (
                    <div className="absolute top-3 right-3 z-20 bg-amber-400 text-neutral-950 text-xs font-black px-2 py-0.5 rounded-md animate-bounce">
                      +{Math.min(selectedMultiplier, remainingVotes + selectedMultiplier)}
                    </div>
                  )}

                  <div>
                    {/* Header Image / Avatar with Rank */}
                    <div className="relative h-44 w-full bg-neutral-950 overflow-hidden">
                      <img
                        src={influencer.avatarUrl}
                        alt={influencer.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                      {/* Rank badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-700/60">
                        {globalRank === 1 ? (
                          <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        ) : globalRank === 2 ? (
                          <Trophy className="w-3.5 h-3.5 text-slate-300" />
                        ) : globalRank === 3 ? (
                          <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <span className="text-[11px] font-bold text-neutral-400">#</span>
                        )}
                        <span className="text-xs font-bold text-white font-mono tabular-nums">
                          Rank {globalRank}
                        </span>
                      </div>

                      {/* Platform icon */}
                      <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-lg border border-neutral-700/60 text-neutral-300">
                        {influencer.platform === 'youtube' ? (
                          <Youtube className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Instagram className="w-3.5 h-3.5 text-pink-500" />
                        )}
                      </div>

                      {/* Name and Handle Overlay */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                            {influencer.name}
                          </h3>
                          {influencer.verified && (
                            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400/20" />
                          )}
                        </div>
                        <div className="text-xs text-neutral-300 font-mono truncate">
                          {influencer.handle}
                        </div>
                      </div>
                    </div>

                    {/* Metadata: Zero-Pill Unboxed Text */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
                        <span className="text-amber-400 font-medium">{influencer.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{influencer.area}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-neutral-300 font-semibold">{influencer.followerCount}</span>
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {influencer.bio}
                      </p>

                      {/* Vote Count and Progress Bar */}
                      <div className="pt-2 border-t border-neutral-800/80">
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-xs text-neutral-400">Total Votes</span>
                          <span className="text-lg font-black font-mono text-amber-400 tabular-nums">
                            {influencer.votes.toLocaleString()}
                          </span>
                        </div>

                        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${voteShare}%` }}
                          />
                        </div>

                        {voterContributed > 0 && (
                          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center justify-between">
                            <span>Your contribution:</span>
                            <span className="font-mono font-bold tabular-nums">+{voterContributed} votes</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 space-y-2">
                    <button
                      onClick={() => handleVoteClick(influencer.id, selectedMultiplier)}
                      disabled={remainingVotes <= 0 || isVoting}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                        remainingVotes <= 0
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 active:scale-[0.98] cursor-pointer'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {remainingVotes <= 0
                          ? 'Quota Finished (0 Left)'
                          : `Vote +${Math.min(selectedMultiplier, remainingVotes)}`}
                      </span>
                    </button>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <button
                        onClick={() => handleVoteClick(influencer.id, 1)}
                        disabled={remainingVotes < 1 || isVoting}
                        className="py-1 px-2 text-[11px] font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors disabled:opacity-40"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleVoteClick(influencer.id, 5)}
                        disabled={remainingVotes < 5 || isVoting}
                        className="py-1 px-2 text-[11px] font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors disabled:opacity-40"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => onSelectCreator(influencer)}
                        className="py-1 px-2 text-[11px] font-medium bg-neutral-800/60 hover:bg-neutral-700/80 text-neutral-300 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Profile</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
