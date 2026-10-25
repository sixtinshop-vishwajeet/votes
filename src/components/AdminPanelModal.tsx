import { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  Trash2,
  Edit2,
  RefreshCw,
  BarChart3,
  Users,
  ShieldCheck,
  Lock,
  LogOut,
  AlertTriangle,
  Check,
  CheckCircle,
} from 'lucide-react';
import type { Influencer, AdminAnalytics, CreatorCategory, PlatformType } from '../types.ts';
import {
  adminLogin,
  adminAddInfluencer,
  adminDeleteInfluencer,
  adminUpdateInfluencer,
  adminResetRound,
  adminFetchAnalytics,
} from '../services/api.ts';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencers: Influencer[];
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
}

const GHAZIPUR_AREAS = [
  'Ghazipur Sadar',
  'Zamania',
  'Saidpur',
  'Mohammadabad',
  'Jakhania',
  'Dildarnagar',
  'Sevrai',
  'Kasimabad',
  'Ghazipur City',
];

const CATEGORIES: Exclude<CreatorCategory, 'All'>[] = [
  'Comedy & Roasts',
  'Vlogs & Lifestyle',
  'Bhojpuri & Folk',
  'Music & Rap',
  'Tech & Education',
  'Fitness & Lifestyle',
];

export function AdminPanelModal({
  isOpen,
  onClose,
  influencers,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}: AdminPanelModalProps) {
  const [tab, setTab] = useState<'manage' | 'add' | 'round' | 'analytics'>('manage');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form state for adding influencer
  const [newInfluencer, setNewInfluencer] = useState({
    name: '',
    handle: '',
    platform: 'instagram' as PlatformType,
    category: 'Comedy & Roasts' as Exclude<CreatorCategory, 'All'>,
    area: 'Ghazipur Sadar',
    bio: '',
    avatarUrl: '',
    followerCount: '25K',
    verified: false,
  });

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Influencer>>({});

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newRoundTitle, setNewRoundTitle] = useState('');

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdminLoggedIn && tab === 'analytics') {
      loadAnalytics();
    }
  }, [isAdminLoggedIn, tab]);

  const loadAnalytics = async () => {
    try {
      const data = await adminFetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');
    try {
      const res = await adminLogin(password);
      if (res.success) {
        setIsAdminLoggedIn(true);
        setPassword('');
      } else {
        setAuthError(res.error || 'Incorrect Password');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateInfluencer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInfluencer.name || !newInfluencer.handle) return;
    setIsSubmitting(true);
    try {
      await adminAddInfluencer({
        ...newInfluencer,
        avatarUrl:
          newInfluencer.avatarUrl ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      });
      setActionSuccess(`Influencer "${newInfluencer.name}" added successfully!`);
      setNewInfluencer({
        name: '',
        handle: '',
        platform: 'instagram',
        category: 'Comedy & Roasts',
        area: 'Ghazipur Sadar',
        bio: '',
        avatarUrl: '',
        followerCount: '25K',
        verified: false,
      });
      setTab('manage');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding influencer';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInfluencer = async (id: string) => {
    setIsSubmitting(true);
    try {
      await adminDeleteInfluencer(id);
      setActionSuccess('Influencer removed successfully!');
      setDeletingId(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error removing influencer';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (inf: Influencer) => {
    setEditingId(inf.id);
    setEditForm({
      name: inf.name,
      handle: inf.handle,
      category: inf.category,
      area: inf.area,
      bio: inf.bio,
      followerCount: inf.followerCount,
      votes: inf.votes,
      verified: inf.verified,
    });
  };

  const handleSaveEdit = async (id: string) => {
    setIsSubmitting(true);
    try {
      await adminUpdateInfluencer(id, editForm);
      setEditingId(null);
      setActionSuccess('Influencer details updated!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetRound = async () => {
    setIsSubmitting(true);
    try {
      await adminResetRound(newRoundTitle || undefined);
      setShowResetConfirm(false);
      setNewRoundTitle('');
      setActionSuccess('New weekly round started! All 99 votes quotas have been reset.');
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-white overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base text-white">Ghazipur Admin Control Panel</h3>
              <p className="text-xs text-neutral-400">
                Add, remove, or edit influencers and manage weekly rounds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="bg-emerald-950/80 border-b border-emerald-800 px-4 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Content Body */}
        {!isAdminLoggedIn ? (
          /* Secret Login Gate - No Password Displayed Anywhere! */
          <div className="p-8 max-w-md mx-auto w-full my-auto text-center">
            <div className="w-12 h-12 bg-neutral-800 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-700">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Admin Access Required</h4>
            <p className="text-xs text-neutral-400 mb-6">
              Enter your secret admin passcode to continue.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret passcode..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              {authError && <div className="text-xs text-rose-400 font-medium">{authError}</div>}

              <button
                type="submit"
                disabled={isSubmitting || !password}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Verifying...' : 'Unlock Admin Panel'}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-4 bg-neutral-950/40 overflow-x-auto">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTab('manage')}
                  className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                    tab === 'manage'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  Influencers List ({influencers.length})
                </button>
                <button
                  onClick={() => setTab('add')}
                  className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    tab === 'add'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Influencer</span>
                </button>
                <button
                  onClick={() => setTab('round')}
                  className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    tab === 'round'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Weekly Round Reset</span>
                </button>
                <button
                  onClick={() => setTab('analytics')}
                  className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    tab === 'analytics'
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Audit & Voters</span>
                </button>
              </div>

              <button
                onClick={() => setIsAdminLoggedIn(false)}
                className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1 py-2 px-2 shrink-0 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {/* TAB 1: MANAGE INFLUENCERS (EDIT / REMOVE) */}
              {tab === 'manage' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">
                      Registered Influencers in Ghazipur ({influencers.length})
                    </h4>
                    <button
                      onClick={() => setTab('add')}
                      className="px-3 py-1.5 text-xs font-bold bg-amber-500 text-neutral-950 rounded-lg hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Influencer</span>
                    </button>
                  </div>

                  <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/40">
                    {influencers.map((inf) => {
                      const isEditing = editingId === inf.id;

                      if (isEditing) {
                        return (
                          <div key={inf.id} className="p-4 bg-neutral-900/90 space-y-3">
                            <div className="font-bold text-xs text-amber-400">
                              Editing: {inf.name}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="text-neutral-400 block mb-1">Full Name</label>
                                <input
                                  type="text"
                                  value={editForm.name || ''}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, name: e.target.value })
                                  }
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white"
                                />
                              </div>
                              <div>
                                <label className="text-neutral-400 block mb-1">Handle</label>
                                <input
                                  type="text"
                                  value={editForm.handle || ''}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, handle: e.target.value })
                                  }
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white"
                                />
                              </div>
                              <div>
                                <label className="text-neutral-400 block mb-1">Category</label>
                                <select
                                  value={editForm.category}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      category: e.target.value as Exclude<CreatorCategory, 'All'>,
                                    })
                                  }
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white"
                                >
                                  {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                      {c}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-neutral-400 block mb-1">Area in Ghazipur</label>
                                <select
                                  value={editForm.area}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, area: e.target.value })
                                  }
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white"
                                >
                                  {GHAZIPUR_AREAS.map((a) => (
                                    <option key={a} value={a}>
                                      {a}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="text-neutral-400 block mb-1">Bio</label>
                                <textarea
                                  value={editForm.bio || ''}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, bio: e.target.value })
                                  }
                                  rows={2}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white text-xs"
                                />
                              </div>
                              <div>
                                <label className="text-neutral-400 block mb-1">Vote Correction</label>
                                <input
                                  type="number"
                                  value={editForm.votes ?? inf.votes}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, votes: parseInt(e.target.value) || 0 })
                                  }
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-white font-mono"
                                />
                              </div>
                              <div className="flex items-center gap-2 pt-5">
                                <input
                                  type="checkbox"
                                  id={`ver-${inf.id}`}
                                  checked={Boolean(editForm.verified)}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, verified: e.target.checked })
                                  }
                                  className="rounded border-neutral-700 bg-neutral-950 text-amber-500"
                                />
                                <label htmlFor={`ver-${inf.id}`} className="text-neutral-300">
                                  Verified Badge (Tick mark)
                                </label>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-800 rounded-lg cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(inf.id)}
                                disabled={isSubmitting}
                                className="px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg cursor-pointer"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={inf.id}
                          className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-neutral-900/60 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
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
                              <div className="font-bold text-white text-sm truncate flex items-center gap-1.5">
                                <span>{inf.name}</span>
                                {inf.verified && (
                                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                )}
                              </div>
                              <div className="text-xs text-neutral-400 flex items-center gap-2 flex-wrap">
                                <span className="font-mono">{inf.handle}</span>
                                <span aria-hidden="true">·</span>
                                <span>{inf.category}</span>
                                <span aria-hidden="true">·</span>
                                <span>{inf.area}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right hidden sm:block">
                              <div className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                                {inf.votes.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-neutral-500">Votes</div>
                            </div>

                            <button
                              onClick={() => handleStartEdit(inf)}
                              className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                              title="Edit Influencer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {deletingId === inf.id ? (
                              <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-lg border border-rose-800">
                                <span className="text-[11px] text-rose-300 px-1 font-semibold">Delete?</span>
                                <button
                                  onClick={() => handleDeleteInfluencer(inf.id)}
                                  className="px-2 py-0.5 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded font-bold cursor-pointer"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="px-1 text-xs text-neutral-400 hover:text-white cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingId(inf.id)}
                                className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                                title="Remove Influencer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: ADD INFLUENCER */}
              {tab === 'add' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-white">Add New Ghazipur Creator</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Once added, the influencer will immediately appear in the live voting arena and leaderboard.
                    </p>
                  </div>

                  <form onSubmit={handleCreateInfluencer} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-neutral-300 font-semibold block mb-1.5">
                          Creator Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newInfluencer.name}
                          onChange={(e) =>
                            setNewInfluencer({ ...newInfluencer, name: e.target.value })
                          }
                          placeholder="e.g. Abhishek Yadav"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-300 font-semibold block mb-1.5">
                          Social Media Handle *
                        </label>
                        <input
                          type="text"
                          required
                          value={newInfluencer.handle}
                          onChange={(e) =>
                            setNewInfluencer({ ...newInfluencer, handle: e.target.value })
                          }
                          placeholder="@username"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-300 font-semibold block mb-1.5">
                          Content Category
                        </label>
                        <select
                          value={newInfluencer.category}
                          onChange={(e) =>
                            setNewInfluencer({
                              ...newInfluencer,
                              category: e.target.value as Exclude<CreatorCategory, 'All'>,
                            })
                          }
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-neutral-300 font-semibold block mb-1.5">
                          Ghazipur Area / Tehsil
                        </label>
                        <select
                          value={newInfluencer.area}
                          onChange={(e) =>
                            setNewInfluencer({ ...newInfluencer, area: e.target.value })
                          }
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                        >
                          {GHAZIPUR_AREAS.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-neutral-300 font-semibold block mb-1.5">
                          Primary Platform
                        </label>
                        <select
                          value={newInfluencer.platform}
                          onChange={(e) =>
                            setNewInfluencer({
                              ...newInfluencer,
                              platform: e.target.value as PlatformType,
                            })
                          }
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                        >
                          <option value="instagram">Instagram</option>
                          <option value="youtube">YouTube</option>
                          <option value="multi">Multi-Platform (YouTube + Insta)</option>
                          <option value="facebook">Facebook Page</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-neutral-300 font-semibold block mb-1.5">
                          Follower Count (approx)
                        </label>
                        <input
                          type="text"
                          value={newInfluencer.followerCount}
                          onChange={(e) =>
                            setNewInfluencer({ ...newInfluencer, followerCount: e.target.value })
                          }
                          placeholder="e.g. 150K or 1.2M"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-neutral-300 font-semibold block mb-1.5">
                        Profile Photo URL (Optional, defaults if empty)
                      </label>
                      <input
                        type="url"
                        value={newInfluencer.avatarUrl}
                        onChange={(e) =>
                          setNewInfluencer({ ...newInfluencer, avatarUrl: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-300 font-semibold block mb-1.5">
                        Bio / Short Description
                      </label>
                      <textarea
                        rows={3}
                        value={newInfluencer.bio}
                        onChange={(e) =>
                          setNewInfluencer({ ...newInfluencer, bio: e.target.value })
                        }
                        placeholder="Short intro about the creator..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="new-verified"
                        checked={newInfluencer.verified}
                        onChange={(e) =>
                          setNewInfluencer({ ...newInfluencer, verified: e.target.checked })
                        }
                        className="rounded border-neutral-700 bg-neutral-950 text-amber-500"
                      />
                      <label htmlFor="new-verified" className="text-neutral-300 font-medium">
                        Verified Creator Badge
                      </label>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Influencer to Voting</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: RESET WEEKLY ROUND */}
              {tab === 'round' && (
                <div className="max-w-xl mx-auto space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-white">Weekly Voting Cycle Management</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Start a new round when the current week ends. This archives past results and resets every voter's 99-vote quota fresh for the new week!
                    </p>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-900/60 rounded-xl p-4 text-xs text-amber-300 space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Important Notice:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300">
                      <li>All influencer vote counts will reset to 0.</li>
                      <li>Current rankings will be saved as "Previous Rank".</li>
                      <li>All voters get a brand-new 99 votes quota.</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-neutral-300 text-xs font-semibold block mb-1">
                        New Round Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={newRoundTitle}
                        onChange={(e) => setNewRoundTitle(e.target.value)}
                        placeholder="e.g. Ghazipur Creator Awards · Week 44"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {showResetConfirm ? (
                      <div className="bg-rose-950/80 border border-rose-800 rounded-xl p-4 text-center space-y-3">
                        <div className="text-xs font-bold text-rose-300">
                          Are you sure you want to start a new weekly round?
                        </div>
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => setShowResetConfirm(false)}
                            className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleResetRound}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer"
                          >
                            {isSubmitting ? 'Resetting...' : 'Yes, Start New Round'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full py-3 bg-neutral-800 hover:bg-rose-600 hover:text-white text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Start New Weekly Round (Reset Votes & 99 Quota)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIT & ANALYTICS */}
              {tab === 'analytics' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">Voting Audit & Analytics</h4>
                      <p className="text-xs text-neutral-400">Area-wise and category-wise vote distribution across Ghazipur</p>
                    </div>
                    <button
                      onClick={loadAnalytics}
                      className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {analytics ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                          <div className="text-xs text-neutral-400">Total Votes</div>
                          <div className="text-2xl font-black font-mono text-amber-400 tabular-nums">
                            {analytics.totalVotes.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                          <div className="text-xs text-neutral-400">Active Voters</div>
                          <div className="text-2xl font-black font-mono text-white tabular-nums flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-neutral-400" />
                            <span>{analytics.totalVoters.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                          <div className="text-xs text-neutral-400">Average Votes / Voter</div>
                          <div className="text-2xl font-black font-mono text-white tabular-nums">
                            {analytics.averageVotesPerUser} <span className="text-xs text-neutral-400 font-normal">/ 99</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                          Ghazipur Area Distribution
                        </h5>
                        <div className="space-y-2">
                          {analytics.areaBreakdown.map((item) => (
                            <div key={item.area} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-neutral-300">{item.area}</span>
                                <span className="font-mono text-amber-400 font-bold tabular-nums">
                                  {item.votes.toLocaleString()} votes
                                </span>
                              </div>
                              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-amber-500 h-full rounded-full"
                                  style={{
                                    width: `${analytics.totalVotes > 0 ? (item.votes / analytics.totalVotes) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                          Recent Voter Quota Trail
                        </h5>
                        <div className="divide-y divide-neutral-800 text-xs font-mono">
                          {analytics.recentVoters.map((rv, i) => (
                            <div key={i} className="py-2 flex items-center justify-between text-neutral-300">
                              <span>Voter: {rv.voterId}</span>
                              <span className="text-amber-400 font-bold">
                                {rv.usedVotes} / 99 votes used
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-400 text-xs">
                      Loading analytics data...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
