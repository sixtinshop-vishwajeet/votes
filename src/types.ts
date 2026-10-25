export type CreatorCategory =
  | 'All'
  | 'Comedy & Roasts'
  | 'Vlogs & Lifestyle'
  | 'Bhojpuri & Folk'
  | 'Music & Rap'
  | 'Tech & Education'
  | 'Fitness & Lifestyle';

export type PlatformType = 'instagram' | 'youtube' | 'facebook' | 'multi';

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: PlatformType;
  category: Exclude<CreatorCategory, 'All'>;
  area: string; // e.g. Ghazipur Sadar, Zamania, Saidpur, Mohammadabad
  bio: string;
  avatarUrl: string;
  votes: number;
  followerCount: string;
  joinedDate: string;
  verified?: boolean;
  socialLink?: string;
  previousRank?: number;
}

export interface VoterState {
  voterId: string;
  maxVotes: number; // 99
  usedVotes: number;
  remainingVotes: number;
  votedBreakdown: Record<string, number>; // influencerId -> count
  lastVotedAt?: number;
}

export interface WeeklyRound {
  id: string;
  title: string;
  weekNumber: number;
  year: number;
  endDate: string; // ISO date string or timestamp
  totalVotes: number;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  influencerId: string;
  influencerName: string;
  votesAdded: number;
  timestamp: number;
  area: string;
}

export interface AppState {
  influencers: Influencer[];
  weeklyRound: WeeklyRound;
  activities: ActivityLog[];
  totalVoters: number;
  totalVotesCast: number;
}

export interface AdminAnalytics {
  totalVotes: number;
  totalVoters: number;
  averageVotesPerUser: number;
  categoryBreakdown: { category: string; votes: number; creatorsCount: number }[];
  areaBreakdown: { area: string; votes: number }[];
  recentVoters: { voterId: string; usedVotes: number; lastVotedAt?: number }[];
}
