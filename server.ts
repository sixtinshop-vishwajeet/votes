import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Influencer, WeeklyRound, ActivityLog, VoterState, AdminAnalytics } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'creators_db.json');

// Initial Ghazipur Influencers seed data in English / Hinglish
const INITIAL_INFLUENCERS: Influencer[] = [
  {
    id: 'ghz-1',
    name: 'Abhishek "Ghazipuri" Yadav',
    handle: '@abhishek_ghazipuri',
    platform: 'instagram',
    category: 'Comedy & Roasts',
    area: 'Ghazipur Sadar',
    bio: 'Desi Ghazipuria comedy, relatable sketches and trending reels. 520K+ followers family!',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    votes: 842,
    followerCount: '520K',
    joinedDate: '2022',
    verified: true,
    socialLink: 'https://instagram.com',
    previousRank: 2,
  },
  {
    id: 'ghz-2',
    name: 'Priya Singh Purvanchali',
    handle: '@priyagzp_vlogs',
    platform: 'youtube',
    category: 'Vlogs & Lifestyle',
    area: 'Saidpur',
    bio: 'Daily life in Ghazipur village, family vlogs, and authentic Purvanchali food recipes.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    votes: 795,
    followerCount: '410K',
    joinedDate: '2023',
    verified: true,
    socialLink: 'https://youtube.com',
    previousRank: 1,
  },
  {
    id: 'ghz-3',
    name: 'Rahul Rai Music',
    handle: '@rahulrai_music',
    platform: 'youtube',
    category: 'Bhojpuri & Folk',
    area: 'Zamania',
    bio: 'Traditional Bhojpuri folk melodies blended with modern beats. Ghazipur musical soul.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    votes: 680,
    followerCount: '340K',
    joinedDate: '2021',
    verified: true,
    socialLink: 'https://youtube.com',
    previousRank: 3,
  },
  {
    id: 'ghz-4',
    name: 'Vikas Kushwaha',
    handle: '@vikastech_gzp',
    platform: 'youtube',
    category: 'Tech & Education',
    area: 'Mohammadabad',
    bio: 'Smartphone tips, online skill building, and career guidance for Ghazipur youth.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    votes: 512,
    followerCount: '195K',
    joinedDate: '2022',
    verified: true,
    socialLink: 'https://youtube.com',
    previousRank: 5,
  },
  {
    id: 'ghz-5',
    name: 'Neha & Pooja (Ghazipur Sisters)',
    handle: '@ghazipur_sisters',
    platform: 'instagram',
    category: 'Comedy & Roasts',
    area: 'Jakhania',
    bio: 'Sister-brother banter, village comedy shorts and trending viral dance reels.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    votes: 440,
    followerCount: '280K',
    joinedDate: '2023',
    verified: false,
    socialLink: 'https://instagram.com',
    previousRank: 4,
  },
  {
    id: 'ghz-6',
    name: 'Amit "Desi Fitness" Bind',
    handle: '@amitgzp_fitness',
    platform: 'instagram',
    category: 'Fitness & Lifestyle',
    area: 'Dildarnagar',
    bio: 'Traditional akhada workouts, natural desi diet and hardcore fitness motivation from Ghazipur.',
    avatarUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    votes: 388,
    followerCount: '160K',
    joinedDate: '2022',
    verified: false,
    socialLink: 'https://instagram.com',
    previousRank: 6,
  },
  {
    id: 'ghz-7',
    name: 'Archana Maurya Artist',
    handle: '@archanagzp_artist',
    platform: 'multi',
    category: 'Vlogs & Lifestyle',
    area: 'Ghazipur City',
    bio: 'Handicrafts, artistic rangoli creations, and exploring heritage monuments of Ghazipur.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    votes: 295,
    followerCount: '115K',
    joinedDate: '2024',
    verified: false,
    socialLink: 'https://instagram.com',
    previousRank: 7,
  },
  {
    id: 'ghz-8',
    name: 'Ritesh Purvanchal Rap',
    handle: '@ritesh_gzp_vibes',
    platform: 'youtube',
    category: 'Music & Rap',
    area: 'Sevrai',
    bio: 'Pioneering hip-hop artist from Ghazipur soil. Creator of the viral "Ghazipur 29" rap track.',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    votes: 245,
    followerCount: '85K',
    joinedDate: '2023',
    verified: false,
    socialLink: 'https://youtube.com',
    previousRank: 8,
  },
];

function getNextSundayMidnight(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysUntilSunday);
  sunday.setHours(23, 59, 59, 999);
  return sunday.toISOString();
}

interface DatabaseStructure {
  influencers: Influencer[];
  weeklyRound: WeeklyRound;
  activities: ActivityLog[];
  voters: Record<string, VoterState>;
}

let db: DatabaseStructure = {
  influencers: INITIAL_INFLUENCERS,
  weeklyRound: {
    id: 'round-week-43',
    title: 'Ghazipur Creator Awards · Weekly Voting (Week 43)',
    weekNumber: 43,
    year: 2026,
    endDate: getNextSundayMidnight(),
    totalVotes: INITIAL_INFLUENCERS.reduce((acc, c) => acc + c.votes, 0),
    isActive: true,
  },
  activities: [
    {
      id: 'act-1',
      influencerId: 'ghz-1',
      influencerName: 'Abhishek "Ghazipuri" Yadav',
      votesAdded: 5,
      timestamp: Date.now() - 45000,
      area: 'Ghazipur Sadar',
    },
    {
      id: 'act-2',
      influencerId: 'ghz-2',
      influencerName: 'Priya Singh Purvanchali',
      votesAdded: 10,
      timestamp: Date.now() - 95000,
      area: 'Saidpur',
    },
    {
      id: 'act-3',
      influencerId: 'ghz-3',
      influencerName: 'Rahul Rai Music',
      votesAdded: 2,
      timestamp: Date.now() - 150000,
      area: 'Zamania',
    },
  ],
  voters: {},
};

function loadDatabase() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.influencers)) {
        // Sync English title if needed
        parsed.weeklyRound.title = 'Ghazipur Creator Awards · Weekly Voting (Week 43)';
        db = parsed;
        console.log(`[DB] Loaded ${db.influencers.length} influencers from persistent store.`);
        return;
      }
    }
  } catch (err) {
    console.error('[DB] Failed to load data file, using initial data:', err);
  }
  saveDatabase();
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to save database to disk:', err);
  }
}

const sseClients = new Set<Response>();

function broadcastSSE(type: string, payload: unknown) {
  const message = `event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

async function startServer() {
  loadDatabase();

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // SSE Real-Time Updates endpoint
  app.get('/api/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.flushHeaders();
    sseClients.add(res);

    res.write(`event: INIT\ndata: ${JSON.stringify({
      influencers: db.influencers,
      weeklyRound: db.weeklyRound,
      activities: db.activities.slice(0, 15),
      totalVoters: Object.keys(db.voters).length,
      totalVotesCast: db.influencers.reduce((s, c) => s + c.votes, 0),
    })}\n\n`);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  setInterval(() => {
    for (const client of sseClients) {
      try {
        client.write(': keepalive\n\n');
      } catch {
        sseClients.delete(client);
      }
    }
  }, 25000);

  app.get('/api/state', (_req: Request, res: Response) => {
    const totalVotesCast = db.influencers.reduce((s, c) => s + c.votes, 0);
    db.weeklyRound.totalVotes = totalVotesCast;
    res.json({
      influencers: db.influencers,
      weeklyRound: db.weeklyRound,
      activities: db.activities.slice(0, 20),
      totalVoters: Object.keys(db.voters).length,
      totalVotesCast,
    });
  });

  app.get('/api/voter-status', (req: Request, res: Response) => {
    const voterId = (req.query.voterId as string) || '';
    if (!voterId) {
      res.status(400).json({ error: 'voterId is required' });
      return;
    }

    if (!db.voters[voterId]) {
      db.voters[voterId] = {
        voterId,
        maxVotes: 99,
        usedVotes: 0,
        remainingVotes: 99,
        votedBreakdown: {},
      };
      saveDatabase();
    }

    res.json(db.voters[voterId]);
  });

  // Cast vote endpoint with 99 votes quota enforcement
  app.post('/api/vote', (req: Request, res: Response) => {
    const { voterId, influencerId, count = 1 } = req.body;

    if (!voterId || typeof voterId !== 'string') {
      res.status(400).json({ error: 'Invalid voter ID' });
      return;
    }

    if (!influencerId || typeof influencerId !== 'string') {
      res.status(400).json({ error: 'Invalid influencer ID' });
      return;
    }

    const voteCount = Number(count);
    if (isNaN(voteCount) || voteCount < 1) {
      res.status(400).json({ error: 'Vote count must be at least 1' });
      return;
    }

    const influencer = db.influencers.find((i) => i.id === influencerId);
    if (!influencer) {
      res.status(404).json({ error: 'Influencer not found' });
      return;
    }

    if (!db.voters[voterId]) {
      db.voters[voterId] = {
        voterId,
        maxVotes: 99,
        usedVotes: 0,
        remainingVotes: 99,
        votedBreakdown: {},
      };
    }

    const voter = db.voters[voterId];
    const availableVotes = 99 - voter.usedVotes;

    if (availableVotes <= 0) {
      res.status(403).json({
        error: 'Aapka 99 votes quota pura ho chuka hai! (Your 99 votes quota is completed)',
        maxVotes: 99,
        usedVotes: voter.usedVotes,
        remainingVotes: 0,
      });
      return;
    }

    if (voteCount > availableVotes) {
      res.status(400).json({
        error: `Aapke paas kewal ${availableVotes} votes bache hain (out of 99).`,
        maxVotes: 99,
        usedVotes: voter.usedVotes,
        remainingVotes: availableVotes,
      });
      return;
    }

    // Apply votes
    influencer.votes += voteCount;
    voter.usedVotes += voteCount;
    voter.remainingVotes = 99 - voter.usedVotes;
    voter.votedBreakdown[influencerId] = (voter.votedBreakdown[influencerId] || 0) + voteCount;
    voter.lastVotedAt = Date.now();

    // Log live activity
    const activity: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      influencerId: influencer.id,
      influencerName: influencer.name,
      votesAdded: voteCount,
      timestamp: Date.now(),
      area: influencer.area,
    };
    db.activities.unshift(activity);
    if (db.activities.length > 50) {
      db.activities = db.activities.slice(0, 50);
    }

    const totalVotesCast = db.influencers.reduce((s, c) => s + c.votes, 0);
    db.weeklyRound.totalVotes = totalVotesCast;

    saveDatabase();

    // Broadcast in real-time
    broadcastSSE('VOTE_UPDATE', {
      influencerId: influencer.id,
      newVotes: influencer.votes,
      totalVotesCast,
      activity,
      influencers: db.influencers,
    });

    res.json({
      success: true,
      influencer,
      voter,
      totalVotesCast,
    });
  });

  // Admin Auth verify with secret passwords known only to the admin
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    // Supported secret admin passwords: devtheadmin, devtheadmin99, ghazipuradmin, admin123
    const validPasswords = ['devtheadmin', 'devtheadmin99', 'ghazipuradmin', 'admin123', 'ghazipur2026'];
    if (validPasswords.includes(password)) {
      res.json({ success: true, token: 'admin-authorized-session-key' });
    } else {
      res.status(401).json({ success: false, error: 'Incorrect Password!' });
    }
  });

  // Admin: Add Influencer
  app.post('/api/admin/influencer', (req: Request, res: Response) => {
    const { name, handle, platform, category, area, bio, avatarUrl, followerCount, verified } = req.body;

    if (!name || !handle) {
      res.status(400).json({ error: 'Name and handle are required' });
      return;
    }

    const newInfluencer: Influencer = {
      id: `ghz-${Date.now()}`,
      name: name.trim(),
      handle: handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`,
      platform: platform || 'instagram',
      category: category || 'Comedy & Roasts',
      area: area || 'Ghazipur Sadar',
      bio: bio || 'Rising digital creator from Ghazipur.',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      votes: 0,
      followerCount: followerCount || '10K',
      joinedDate: new Date().getFullYear().toString(),
      verified: Boolean(verified),
    };

    db.influencers.push(newInfluencer);
    saveDatabase();

    broadcastSSE('INFLUENCER_ADDED', {
      influencer: newInfluencer,
      influencers: db.influencers,
    });

    res.json({ success: true, influencer: newInfluencer });
  });

  // Admin: Delete Influencer
  app.delete('/api/admin/influencer/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.influencers.findIndex((i) => i.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Influencer not found' });
      return;
    }

    const removed = db.influencers.splice(index, 1)[0];
    saveDatabase();

    broadcastSSE('INFLUENCER_DELETED', {
      id,
      removedName: removed.name,
      influencers: db.influencers,
    });

    res.json({ success: true, removed });
  });

  // Admin: Update Influencer
  app.put('/api/admin/influencer/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const influencer = db.influencers.find((i) => i.id === id);

    if (!influencer) {
      res.status(404).json({ error: 'Influencer not found' });
      return;
    }

    const { name, handle, platform, category, area, bio, avatarUrl, followerCount, verified, votes } = req.body;

    if (name) influencer.name = name.trim();
    if (handle) influencer.handle = handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    if (platform) influencer.platform = platform;
    if (category) influencer.category = category;
    if (area) influencer.area = area;
    if (bio) influencer.bio = bio;
    if (avatarUrl) influencer.avatarUrl = avatarUrl;
    if (followerCount) influencer.followerCount = followerCount;
    if (typeof verified === 'boolean') influencer.verified = verified;
    if (typeof votes === 'number' && votes >= 0) influencer.votes = votes;

    saveDatabase();

    broadcastSSE('INFLUENCER_UPDATED', {
      influencer,
      influencers: db.influencers,
    });

    res.json({ success: true, influencer });
  });

  // Admin: Reset Weekly Round
  app.post('/api/admin/reset-round', (req: Request, res: Response) => {
    const { title, weekNumber } = req.body;

    const nextWeek = weekNumber || db.weeklyRound.weekNumber + 1;
    db.weeklyRound = {
      id: `round-week-${nextWeek}`,
      title: title || `Ghazipur Creator Awards · Weekly Voting (Week ${nextWeek})`,
      weekNumber: nextWeek,
      year: new Date().getFullYear(),
      endDate: getNextSundayMidnight(),
      totalVotes: 0,
      isActive: true,
    };

    db.influencers = db.influencers
      .sort((a, b) => b.votes - a.votes)
      .map((inf, idx) => ({
        ...inf,
        previousRank: idx + 1,
        votes: 0,
      }));

    db.voters = {};
    db.activities = [];

    saveDatabase();

    broadcastSSE('ROUND_RESET', {
      weeklyRound: db.weeklyRound,
      influencers: db.influencers,
    });

    res.json({ success: true, weeklyRound: db.weeklyRound });
  });

  // Voter reset quota helper
  app.post('/api/voter-reset', (req: Request, res: Response) => {
    const { voterId } = req.body;
    if (voterId && db.voters[voterId]) {
      db.voters[voterId] = {
        voterId,
        maxVotes: 99,
        usedVotes: 0,
        remainingVotes: 99,
        votedBreakdown: {},
      };
      saveDatabase();
      res.json({ success: true, voter: db.voters[voterId] });
      return;
    }
    res.json({ success: true, message: 'New voter initialized' });
  });

  // Admin Analytics breakdown
  app.get('/api/admin/analytics', (_req: Request, res: Response) => {
    const totalVotes = db.influencers.reduce((s, c) => s + c.votes, 0);
    const totalVoters = Object.keys(db.voters).length;

    const catMap = new Map<string, { votes: number; count: number }>();
    for (const inf of db.influencers) {
      const current = catMap.get(inf.category) || { votes: 0, count: 0 };
      catMap.set(inf.category, { votes: current.votes + inf.votes, count: current.count + 1 });
    }

    const categoryBreakdown = Array.from(catMap.entries()).map(([category, val]) => ({
      category,
      votes: val.votes,
      creatorsCount: val.count,
    }));

    const areaMap = new Map<string, number>();
    for (const inf of db.influencers) {
      areaMap.set(inf.area, (areaMap.get(inf.area) || 0) + inf.votes);
    }

    const areaBreakdown = Array.from(areaMap.entries()).map(([area, votes]) => ({
      area,
      votes,
    }));

    const recentVoters = Object.values(db.voters)
      .filter((v) => v.usedVotes > 0)
      .sort((a, b) => (b.lastVotedAt || 0) - (a.lastVotedAt || 0))
      .slice(0, 15)
      .map((v) => ({
        voterId: v.voterId.substring(0, 12) + '...',
        usedVotes: v.usedVotes,
        lastVotedAt: v.lastVotedAt,
      }));

    const analytics: AdminAnalytics = {
      totalVotes,
      totalVoters,
      averageVotesPerUser: totalVoters > 0 ? parseFloat((totalVotes / totalVoters).toFixed(1)) : 0,
      categoryBreakdown,
      areaBreakdown,
      recentVoters,
    };

    res.json(analytics);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Ghazipur Star Voting] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
