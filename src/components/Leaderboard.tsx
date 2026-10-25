import { useState } from 'react';
import { Trophy, Medal, ArrowUp, ArrowDown, Minus, Share2, Download, CheckCircle, Flame } from 'lucide-react';
import type { Influencer, VoterState } from '../types.ts';

interface LeaderboardProps {
  influencers: Influencer[];
  voter: VoterState | null;
  onVote: (influencerId: string, count: number) => void;
  selectedMultiplier: number;
}

export function Leaderboard({
  influencers,
  voter,
  onVote,
  selectedMultiplier,
}: LeaderboardProps) {
  const [copiedShare, setCopiedShare] = useState(false);

  const sorted = [...influencers].sort((a, b) => b.votes - a.votes);
  const totalVotesAll = sorted.reduce((sum, inf) => sum + inf.votes, 0) || 1;

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  const remainingVotes = voter ? voter.remainingVotes : 99;

  const handleExportCSV = () => {
    const headers = ['Rank', 'Name', 'Handle', 'Category', 'Area', 'Votes', 'Share_Percent'];
    const rows = sorted.map((inf, idx) => [
      idx + 1,
      `"${inf.name}"`,
      `"${inf.handle}"`,
      `"${inf.category}"`,
      `"${inf.area}"`,
      inf.votes,
      `${((inf.votes / totalVotesAll) * 100).toFixed(1)}%`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Ghazipur_Creator_Awards_Leaderboard_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `🏆 Ghazipur Creator Awards 2026: Currently Rank #1 is "${top1?.name || 'Ghazipur Star'}"! Vote for your favourite influencer now (1 person gets 99 votes quota): ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <section id="leaderboard-section" className="py-12 border-b border-neutral-800 bg-neutral-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Real-Time Rankings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Weekly Live Leaderboard
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              Live standings of top creators in Ghazipur. Every vote instantly updates rankings in real-time.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl transition-colors"
            >
              {copiedShare ? 'Link Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded-xl transition-colors flex items-center gap-1.5"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Top 3 Podium Showcase */}
        {sorted.length >= 3 && (
          <div className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                Top 3 Contenders
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
              {/* Rank 2 (Silver) */}
              <div className="order-2 md:order-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center shadow-lg relative group hover:border-slate-400 transition-all">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-neutral-950 font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                  #2
                </div>
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <img
                    src={top2.avatarUrl}
                    alt={top2.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover border-2 border-slate-300 shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <Medal className="w-6 h-6 text-slate-300 absolute -bottom-1 -right-1 drop-shadow" />
                </div>
                <h4 className="font-bold text-white text-base truncate">{top2.name}</h4>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">{top2.handle}</p>
                <div className="text-xs text-neutral-400 mt-1">{top2.area}</div>
                <div className="mt-3 pt-3 border-t border-neutral-800">
                  <div className="text-2xl font-black font-mono text-white tabular-nums">
                    {top2.votes.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-neutral-400">Votes ({((top2.votes / totalVotesAll) * 100).toFixed(1)}%)</div>
                </div>
                <button
                  onClick={() => onVote(top2.id, Math.min(selectedMultiplier, remainingVotes))}
                  disabled={remainingVotes <= 0}
                  className="mt-4 w-full py-2 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors disabled:opacity-40"
                >
                  Vote (+{Math.min(selectedMultiplier, remainingVotes || 1)})
                </button>
              </div>

              {/* Rank 1 (Gold - Marquee Champion) */}
              <div className="order-1 md:order-2 bg-gradient-to-b from-neutral-900 to-amber-950/30 border-2 border-amber-500/80 rounded-2xl p-6 text-center shadow-2xl relative group transform md:-translate-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 font-black text-base flex items-center justify-center mx-auto mb-2 shadow-lg shadow-amber-500/30">
                  <Trophy className="w-6 h-6 text-neutral-950" />
                </div>

                <div className="relative w-24 h-24 mx-auto mb-3">
                  <img
                    src={top1.avatarUrl}
                    alt={top1.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover border-4 border-amber-400 shadow-xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Leader #1
                  </div>
                </div>

                <h4 className="font-extrabold text-white text-lg truncate flex items-center justify-center gap-1">
                  <span>{top1.name}</span>
                  <CheckCircle className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
                </h4>
                <p className="text-xs text-amber-300 font-mono mt-0.5">{top1.handle}</p>
                <div className="text-xs text-neutral-300 mt-1">{top1.category} · {top1.area}</div>

                <div className="mt-4 pt-4 border-t border-amber-500/30">
                  <div className="text-3xl font-black font-mono text-amber-400 tabular-nums">
                    {top1.votes.toLocaleString()}
                  </div>
                  <div className="text-xs text-neutral-300">Total Votes ({((top1.votes / totalVotesAll) * 100).toFixed(1)}% share)</div>
                </div>

                <button
                  onClick={() => onVote(top1.id, Math.min(selectedMultiplier, remainingVotes))}
                  disabled={remainingVotes <= 0}
                  className="mt-4 w-full py-2.5 text-xs font-black bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-40"
                >
                  Vote Rank #1 (+{Math.min(selectedMultiplier, remainingVotes || 1)})
                </button>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="order-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center shadow-lg relative group hover:border-amber-700 transition-all">
                <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                  #3
                </div>
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <img
                    src={top3.avatarUrl}
                    alt={top3.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover border-2 border-amber-700 shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <Medal className="w-6 h-6 text-amber-700 absolute -bottom-1 -right-1 drop-shadow" />
                </div>
                <h4 className="font-bold text-white text-base truncate">{top3.name}</h4>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">{top3.handle}</p>
                <div className="text-xs text-neutral-400 mt-1">{top3.area}</div>
                <div className="mt-3 pt-3 border-t border-neutral-800">
                  <div className="text-2xl font-black font-mono text-white tabular-nums">
                    {top3.votes.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-neutral-400">Votes ({((top3.votes / totalVotesAll) * 100).toFixed(1)}%)</div>
                </div>
                <button
                  onClick={() => onVote(top3.id, Math.min(selectedMultiplier, remainingVotes))}
                  disabled={remainingVotes <= 0}
                  className="mt-4 w-full py-2 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors disabled:opacity-40"
                >
                  Vote (+{Math.min(selectedMultiplier, remainingVotes || 1)})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complete Standings Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Complete Standings Table
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              Total {sorted.length} Creators
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">Influencer</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                  <th className="py-3 px-4 hidden md:table-cell">Area in Ghazipur</th>
                  <th className="py-3 px-4 hidden lg:table-cell w-36">Vote Share</th>
                  <th className="py-3 px-4 text-right">Votes</th>
                  <th className="py-3 px-4 text-center w-28">Quick Vote</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80 text-sm">
                {sorted.map((inf, index) => {
                  const rank = index + 1;
                  const prevRank = inf.previousRank || rank;
                  const rankDiff = prevRank - rank;
                  const sharePct = ((inf.votes / totalVotesAll) * 100).toFixed(1);

                  return (
                    <tr
                      key={inf.id}
                      className="hover:bg-neutral-800/40 transition-colors group"
                    >
                      {/* Rank & Movement */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={
                              rank === 1
                                ? 'text-amber-400'
                                : rank === 2
                                ? 'text-slate-300'
                                : rank === 3
                                ? 'text-amber-600'
                                : 'text-neutral-400'
                            }
                          >
                            #{rank}
                          </span>
                          {rankDiff > 0 ? (
                            <span className="text-[10px] text-emerald-400 flex items-center" title="Climbed up">
                              <ArrowUp className="w-3 h-3" />
                            </span>
                          ) : rankDiff < 0 ? (
                            <span className="text-[10px] text-rose-400 flex items-center" title="Moved down">
                              <ArrowDown className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-600">
                              <Minus className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Creator Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={inf.avatarUrl}
                            alt={inf.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-neutral-700 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate group-hover:text-amber-400 transition-colors flex items-center gap-1">
                              <span>{inf.name}</span>
                              {inf.verified && (
                                <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-neutral-400 font-mono truncate">
                              {inf.handle} · {inf.followerCount}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-xs text-neutral-300 hidden sm:table-cell">
                        {inf.category}
                      </td>

                      {/* Ghazipur Area */}
                      <td className="py-3.5 px-4 text-xs text-neutral-400 hidden md:table-cell">
                        {inf.area}
                      </td>

                      {/* Vote Share % Bar */}
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
                            <span>{sharePct}%</span>
                          </div>
                          <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${sharePct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Total Votes */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-base font-bold font-mono text-amber-400 tabular-nums">
                          {inf.votes.toLocaleString()}
                        </span>
                      </td>

                      {/* Row Action: Quick Vote */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onVote(inf.id, Math.min(selectedMultiplier, remainingVotes))}
                          disabled={remainingVotes <= 0}
                          className="px-2.5 py-1 text-xs font-semibold bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 rounded-lg transition-colors disabled:opacity-30 flex items-center justify-center gap-1 mx-auto"
                        >
                          <Flame className="w-3 h-3" />
                          <span>+{Math.min(selectedMultiplier, remainingVotes || 1)}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
