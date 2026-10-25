import confetti from 'canvas-confetti';
import type { Influencer, VoterState, AppState, AdminAnalytics } from '../types.ts';

const VOTER_ID_KEY = 'ghazipur_voter_id_v2';
const SOUND_MUTED_KEY = 'ghazipur_vote_sound_muted';

export function getOrCreateVoterId(): string {
  let id = localStorage.getItem(VOTER_ID_KEY);
  if (!id) {
    id = `voter_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(VOTER_ID_KEY, id);
  }
  return id;
}

export function isSoundMuted(): boolean {
  return localStorage.getItem(SOUND_MUTED_KEY) === 'true';
}

export function setSoundMuted(muted: boolean): void {
  localStorage.setItem(SOUND_MUTED_KEY, muted ? 'true' : 'false');
}

// Synthesized audio feedback using Web Audio API (no external mp3 dependency!)
let audioCtx: AudioContext | null = null;

export function playVoteSound(multiplier: number = 1): void {
  if (isSoundMuted()) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    // Dynamic pitch based on multiplier
    const baseFreq = multiplier > 10 ? 680 : multiplier > 1 ? 540 : 440;
    osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.16);
  } catch {
    // Ignore audio errors on un-interacted browsers
  }
}

export function triggerConfetti(): void {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'],
    });
  } catch {
    // Canvas confetti fallback
  }
}

// API functions
export async function fetchAppState(): Promise<AppState> {
  const res = await fetch('/api/state');
  if (!res.ok) throw new Error('Failed to load application state');
  return res.json();
}

export async function fetchVoterStatus(voterId: string): Promise<VoterState> {
  const res = await fetch(`/api/voter-status?voterId=${encodeURIComponent(voterId)}`);
  if (!res.ok) throw new Error('Failed to fetch voter status');
  return res.json();
}

export async function castVote(
  voterId: string,
  influencerId: string,
  count: number = 1
): Promise<{ success: boolean; influencer: Influencer; voter: VoterState; totalVotesCast: number }> {
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voterId, influencerId, count }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit vote');
  }
  return data;
}

export async function resetVoterQuota(voterId: string): Promise<{ success: boolean; voter: VoterState }> {
  const res = await fetch('/api/voter-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voterId }),
  });
  return res.json();
}

// Admin APIs
export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return res.json();
}

export async function adminAddInfluencer(data: Partial<Influencer>): Promise<{ success: boolean; influencer: Influencer }> {
  const res = await fetch('/api/admin/influencer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to add influencer');
  return json;
}

export async function adminDeleteInfluencer(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/admin/influencer/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete influencer');
  return json;
}

export async function adminUpdateInfluencer(id: string, data: Partial<Influencer>): Promise<{ success: boolean; influencer: Influencer }> {
  const res = await fetch(`/api/admin/influencer/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update influencer');
  return json;
}

export async function adminResetRound(title?: string, weekNumber?: number): Promise<{ success: boolean }> {
  const res = await fetch('/api/admin/reset-round', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, weekNumber }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset weekly round');
  return json;
}

export async function adminFetchAnalytics(): Promise<AdminAnalytics> {
  const res = await fetch('/api/admin/analytics');
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}
