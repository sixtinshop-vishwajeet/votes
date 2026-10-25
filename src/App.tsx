import { useState, useEffect, useRef, useCallback } from 'react';
import type { Influencer, WeeklyRound, ActivityLog, VoterState, AppState } from './types.ts';
import {
  getOrCreateVoterId,
  fetchAppState,
  fetchVoterStatus,
  castVote,
  isSoundMuted,
  setSoundMuted,
  playVoteSound,
  triggerConfetti,
} from './services/api.ts';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { VoterQuotaBar } from './components/VoterQuotaBar.tsx';
import { VotingGrid } from './components/VotingGrid.tsx';
import { Leaderboard } from './components/Leaderboard.tsx';
import { LiveActivityFeed } from './components/LiveActivityFeed.tsx';
import { RulesSection } from './components/RulesSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminPanelModal } from './components/AdminPanelModal.tsx';
import { CreatorDetailModal } from './components/CreatorDetailModal.tsx';

export default function App() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [weeklyRound, setWeeklyRound] = useState<WeeklyRound>({
    id: 'round-1',
    title: 'Ghazipur Creator Awards · Weekly Voting (Week 43)',
    weekNumber: 43,
    year: 2026,
    endDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    totalVotes: 0,
    isActive: true,
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [totalVotesCast, setTotalVotesCast] = useState<number>(0);
  const [totalVoters, setTotalVoters] = useState<number>(1);
  const [voter, setVoter] = useState<VoterState | null>(null);

  const [selectedMultiplier, setSelectedMultiplier] = useState<number>(1);
  const [isMuted, setIsMutedState] = useState<boolean>(isSoundMuted());
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [selectedCreator, setSelectedCreator] = useState<Influencer | null>(null);
  const [votingInfluencerId, setVotingInfluencerId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const sseRef = useRef<EventSource | null>(null);
  const voterIdRef = useRef<string>(getOrCreateVoterId());

  // Show Toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Secret URL listener: Detects 'devtheadmin' in pathname, hash, or query param
  useEffect(() => {
    const checkAdminUrl = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path.includes('devtheadmin') ||
        hash.includes('devtheadmin') ||
        search.includes('devtheadmin')
      ) {
        setIsAdminOpen(true);
      }
    };

    checkAdminUrl();
    window.addEventListener('popstate', checkAdminUrl);
    window.addEventListener('hashchange', checkAdminUrl);

    // Secret keyboard typing trigger: Type 'devtheadmin' anywhere on page
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 25) {
        keyBuffer = keyBuffer.slice(-25);
      }
      if (keyBuffer.includes('devtheadmin')) {
        setIsAdminOpen(true);
        keyBuffer = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkAdminUrl);
      window.removeEventListener('hashchange', checkAdminUrl);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.pathname.includes('devtheadmin')) {
      window.history.replaceState(null, '', '/');
    } else if (window.location.hash.includes('devtheadmin')) {
      window.history.replaceState(null, '', window.location.pathname);
    } else if (window.location.search.includes('devtheadmin')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Fetch initial app state
  const loadState = useCallback(async () => {
    try {
      const data: AppState = await fetchAppState();
      setInfluencers(data.influencers);
      setWeeklyRound(data.weeklyRound);
      setActivities(data.activities);
      setTotalVotesCast(data.totalVotesCast);
      setTotalVoters(data.totalVoters);
    } catch (err) {
      console.error('Failed to load initial state:', err);
    }
  }, []);

  // Fetch voter state
  const loadVoterStatus = useCallback(async () => {
    try {
      const vState = await fetchVoterStatus(voterIdRef.current);
      setVoter(vState);
    } catch (err) {
      console.error('Failed to load voter status:', err);
    }
  }, []);

  // Initialize data and real-time SSE
  useEffect(() => {
    loadState();
    loadVoterStatus();

    const setupSSE = () => {
      try {
        const es = new EventSource('/api/stream');
        sseRef.current = es;

        es.addEventListener('INIT', (event) => {
          const data = JSON.parse(event.data);
          if (data.influencers) setInfluencers(data.influencers);
          if (data.weeklyRound) setWeeklyRound(data.weeklyRound);
          if (data.activities) setActivities(data.activities);
          if (typeof data.totalVotesCast === 'number') setTotalVotesCast(data.totalVotesCast);
          if (typeof data.totalVoters === 'number') setTotalVoters(data.totalVoters);
        });

        es.addEventListener('VOTE_UPDATE', (event) => {
          const data = JSON.parse(event.data);
          if (data.influencers) {
            setInfluencers(data.influencers);
          } else if (data.influencerId && typeof data.newVotes === 'number') {
            setInfluencers((prev) =>
              prev.map((inf) =>
                inf.id === data.influencerId ? { ...inf, votes: data.newVotes } : inf
              )
            );
          }
          if (typeof data.totalVotesCast === 'number') {
            setTotalVotesCast(data.totalVotesCast);
          }
          if (data.activity) {
            setActivities((prev) => [data.activity, ...prev.slice(0, 30)]);
          }
        });

        es.addEventListener('INFLUENCER_ADDED', (event) => {
          const data = JSON.parse(event.data);
          if (data.influencers) setInfluencers(data.influencers);
        });

        es.addEventListener('INFLUENCER_DELETED', (event) => {
          const data = JSON.parse(event.data);
          if (data.influencers) setInfluencers(data.influencers);
        });

        es.addEventListener('INFLUENCER_UPDATED', (event) => {
          const data = JSON.parse(event.data);
          if (data.influencers) setInfluencers(data.influencers);
        });

        es.addEventListener('ROUND_RESET', (event) => {
          const data = JSON.parse(event.data);
          if (data.weeklyRound) setWeeklyRound(data.weeklyRound);
          if (data.influencers) setInfluencers(data.influencers);
          setActivities([]);
          loadVoterStatus();
          showToast('New weekly round started! 99 fresh votes available.', 'info');
        });

        es.onerror = () => {
          es.close();
        };
      } catch (err) {
        console.error('SSE initialization error:', err);
      }
    };

    setupSSE();

    const pollInterval = setInterval(() => {
      loadState();
    }, 10000);

    return () => {
      if (sseRef.current) sseRef.current.close();
      clearInterval(pollInterval);
    };
  }, [loadState, loadVoterStatus, showToast]);

  // Vote handler
  const handleVote = async (influencerId: string, count: number) => {
    if (!voter) return;
    if (voter.remainingVotes <= 0) {
      showToast('Aapka 99 votes quota khatam ho chuka hai! (0 votes left)', 'error');
      return;
    }

    const voteCount = Math.min(count, voter.remainingVotes);
    setVotingInfluencerId(influencerId);

    try {
      const res = await castVote(voterIdRef.current, influencerId, voteCount);
      if (res.success) {
        setVoter(res.voter);
        setTotalVotesCast(res.totalVotesCast);
        setInfluencers((prev) =>
          prev.map((i) => (i.id === influencerId ? res.influencer : i))
        );

        playVoteSound(voteCount);

        if (voteCount >= 10 || res.voter.remainingVotes === 0) {
          triggerConfetti();
        }

        if ('vibrate' in navigator) {
          try {
            navigator.vibrate(50);
          } catch {
            // ignore
          }
        }

        const remainingText =
          res.voter.remainingVotes > 0
            ? `(${res.voter.remainingVotes}/99 left)`
            : '(Quota completed)';
        showToast(
          `Successfully cast +${voteCount} votes! ${remainingText}`,
          'success'
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error casting vote';
      showToast(message, 'error');
    } finally {
      setVotingInfluencerId(null);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMutedState(nextMuted);
    setSoundMuted(nextMuted);
  };

  const handleScrollToVote = () => {
    const el = document.getElementById('vote-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border transition-all animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === 'error'
              ? 'bg-rose-950 text-rose-200 border-rose-800'
              : toast.type === 'info'
              ? 'bg-sky-950 text-sky-200 border-sky-800'
              : 'bg-emerald-950 text-emerald-200 border-emerald-800'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onScrollToVote={handleScrollToVote}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          weeklyRound={weeklyRound}
          totalVotesCast={totalVotesCast}
          creatorsCount={influencers.length}
          totalVoters={totalVoters}
          onScrollToVote={handleScrollToVote}
        />

        {/* Voter 99-Vote Quota Bar (No Reset Button) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
          <VoterQuotaBar
            voter={voter}
            selectedMultiplier={selectedMultiplier}
            onSelectMultiplier={setSelectedMultiplier}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </div>

        {/* Voting Grid Arena */}
        <VotingGrid
          influencers={influencers}
          voter={voter}
          selectedMultiplier={selectedMultiplier}
          onVote={handleVote}
          votingInfluencerId={votingInfluencerId}
          onSelectCreator={setSelectedCreator}
        />

        {/* Leaderboard Section */}
        <Leaderboard
          influencers={influencers}
          voter={voter}
          onVote={handleVote}
          selectedMultiplier={selectedMultiplier}
        />

        {/* Real-time Live Activity Feed */}
        <LiveActivityFeed activities={activities} />

        {/* Rules & Guidelines */}
        <RulesSection />
      </main>

      {/* Clean Footer (No public admin link) */}
      <Footer />

      {/* Secret Admin Panel Modal (Opens when URL has devtheadmin) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        influencers={influencers}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

      {/* Creator Detail Modal */}
      <CreatorDetailModal
        influencer={selectedCreator}
        onClose={() => setSelectedCreator(null)}
        voter={voter}
        onVote={handleVote}
        selectedMultiplier={selectedMultiplier}
      />
    </div>
  );
}
