import { useState, useEffect } from 'react';
import { Trophy, Flame, Users, Sparkles, Clock } from 'lucide-react';
import type { WeeklyRound } from '../types.ts';

interface HeroSectionProps {
  weeklyRound: WeeklyRound;
  totalVotesCast: number;
  creatorsCount: number;
  totalVoters: number;
  onScrollToVote: () => void;
}

export function HeroSection({
  weeklyRound,
  totalVotesCast,
  creatorsCount,
  totalVoters,
  onScrollToVote,
}: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(weeklyRound.endDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weeklyRound.endDate]);

  return (
    <section className="relative bg-neutral-950 text-white overflow-hidden border-b border-neutral-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold tracking-wider uppercase text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ghazipur Digital Stars · Week {weeklyRound.weekNumber}</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-display"
              style={{ textWrap: 'balance' }}
            >
              Ghazipur Influencers Weekly Voting League
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              Support your favorite content creators from Sadar, Zamania, Saidpur, Mohammadabad to Dildarnagar! 1 person gets <strong className="text-amber-400 font-semibold">99 Votes quota</strong> — distribute your votes or support your #1 star!
            </p>

            {/* Countdown timer strip */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 sm:p-5 max-w-xl">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Voting closes in (Sunday Midnight):
                </span>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Live Voting Open
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-neutral-800/80 rounded-lg py-2 px-1 border border-neutral-700/60">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium">Days</div>
                </div>
                <div className="bg-neutral-800/80 rounded-lg py-2 px-1 border border-neutral-700/60">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium">Hours</div>
                </div>
                <div className="bg-neutral-800/80 rounded-lg py-2 px-1 border border-neutral-700/60">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium">Mins</div>
                </div>
                <div className="bg-neutral-800/80 rounded-lg py-2 px-1 border border-neutral-700/60">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-medium">Secs</div>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScrollToVote}
                className="px-6 py-3.5 text-sm font-bold bg-amber-500 text-neutral-950 rounded-xl hover:bg-amber-400 active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-neutral-950" />
                <span>Vote Now (99 Votes Quota)</span>
              </button>
              <a
                href="#leaderboard-section"
                className="px-5 py-3.5 text-sm font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors whitespace-nowrap"
              >
                View Live Leaderboard
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual spotlight */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900 group">
              <img
                src="/src/assets/images/ghazipur_creators_hero_1792916417027.jpg"
                alt="Ghazipur Digital Creators Hub & Voting Showcase"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.img-fallback') as HTMLElement | null;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="img-fallback hidden w-full h-80 sm:h-96 bg-gradient-to-br from-neutral-900 via-neutral-800 to-amber-950 flex-col items-center justify-center p-6 text-center">
                <Trophy className="w-16 h-16 text-amber-400 mb-3" />
                <h3 className="text-xl font-bold text-white">Ghazipur Influencer Awards</h3>
                <p className="text-xs text-neutral-400 mt-1">Weekly digital creator recognition</p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent flex flex-col justify-end p-5">
                <div className="text-xs font-semibold text-amber-400">Ghazipur Creator League 2026</div>
                <div className="text-sm font-medium text-white">
                  Vote for your favourite star to become "Creator of the Week"!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Strip */}
        <div className="mt-12 pt-8 border-t border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-neutral-300">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              {totalVotesCast.toLocaleString()}
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Total Votes Cast</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 tabular-nums">
              99 Votes
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Max Quota Per Person</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              {creatorsCount}
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Nominated Influencers</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums flex items-center gap-1.5">
              <Users className="w-5 h-5 text-neutral-400 inline" />
              <span>{Math.max(1, totalVoters).toLocaleString()}</span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">Active Voters in Ghazipur</div>
          </div>
        </div>
      </div>
    </section>
  );
}
