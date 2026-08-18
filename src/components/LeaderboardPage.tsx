'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Clock, Star, AlertTriangle, Play, Square, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Participant {
  id: string;
  username: string;
  score: number;
  total_time_spent: number;
  q10_response?: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [settings, setSettings] = useState({ is_quiz_active: false, show_leaderboard: false });
  const [hidden, setHidden] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setSettings(data.settings);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      const data = await res.json();
      if (data.hidden) {
        setHidden(true);
      } else if (data.success || data.leaderboard) {
        setHidden(false);
        setLeaderboard(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchSettings();
    
    // Trigger confetti on mount if not hidden
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00629B', '#FFC107', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00629B', '#FFC107', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
    fetchSettings();
  };

  const toggleSetting = async (key: 'is_quiz_active' | 'show_leaderboard') => {
    const password = prompt('Type the admin password to change settings:');
    if (password !== 'ieee-admin-2026') {
      if (password !== null) alert('Incorrect password.');
      return;
    }
    try {
      const newSettings = { ...settings, [key]: !settings[key] };
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, ...newSettings })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        fetchLeaderboard(); // refresh leaderboard based on new visibility
      } else {
        alert('Failed to update: ' + data.error);
      }
    } catch (err) {
      alert('Error updating settings.');
    }
  };

  const handleReset = async () => {
    const password = prompt('WARNING: This will delete ALL participants and scores.\\n\\nType the admin password to continue:');
    if (password !== 'ieee-admin-2026') {
      if (password !== null) alert('Incorrect password.');
      return;
    }

    const confirmDelete = confirm('Are you absolutely sure you want to wipe the database? This cannot be undone.');
    if (!confirmDelete) return;

    setResetting(true);
    try {
      const res = await fetch('/api/reset-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        alert('Database successfully reset!');
        fetchLeaderboard();
      } else {
        alert('Failed to reset: ' + data.error);
      }
    } catch (err) {
      alert('Error connecting to server.');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ieee-gradient text-white">
        <RefreshCw className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 marvel-bg text-[var(--color-text-primary)] py-12">
      {/* Subtle radial glow behind the leaderboard */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[800px] bg-[radial-gradient(ellipse_at_center,rgba(226,54,54,0.15)_0%,rgba(31,111,214,0.15)_50%,transparent_70%)] z-0 pointer-events-none mix-blend-screen opacity-70"></div>
      
      <div className="w-full max-w-2xl glass-panel rounded-none flex flex-col max-h-[85vh] relative z-10">
        <div className="p-4 sm:p-6 glass-panel-recessed border-b border-[var(--color-glass-border)] text-[var(--color-text-primary)] flex flex-col sm:flex-row justify-between items-center flex-shrink-0 rounded-none gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
            <Trophy size={28} className="text-[var(--color-accent-highlight)]" />
            <h1 className="text-3xl font-display font-bold tracking-tight text-[var(--color-text-primary)] uppercase">Leaderboard</h1>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button 
              onClick={() => toggleSetting('is_quiz_active')}
              className={clsx("p-2 rounded-full transition-colors flex items-center gap-1 px-4 font-bold text-sm", settings.is_quiz_active ? "bg-[var(--color-feedback-success)] hover:bg-green-600" : "bg-gray-600 hover:bg-gray-700")}
              title="Toggle Quiz Active"
            >
              {settings.is_quiz_active ? <Square size={16} /> : <Play size={16} />}
              {settings.is_quiz_active ? 'Quiz Active' : 'Quiz Closed'}
            </button>
            <button 
              onClick={() => toggleSetting('show_leaderboard')}
              className={clsx("p-2 rounded-full transition-colors flex items-center gap-1 px-4 font-bold text-sm", settings.show_leaderboard ? "bg-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary-hover)]" : "bg-gray-600 hover:bg-gray-700")}
              title="Toggle Leaderboard"
            >
              {settings.show_leaderboard ? <Eye size={16} /> : <EyeOff size={16} />}
              {settings.show_leaderboard ? 'LB Visible' : 'LB Hidden'}
            </button>
            <button 
              onClick={handleReset}
              disabled={resetting}
              className="p-2 bg-[var(--color-feedback-error)] rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
              title="Reset Database"
            >
              <AlertTriangle size={20} className={clsx(resetting && "animate-pulse")} />
            </button>
            <button 
              onClick={handleRefresh}
              className="p-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={20} className={clsx(refreshing && "animate-spin")} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-transparent">
          {hidden ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] py-12">
              <EyeOff size={64} className="mb-4 opacity-50 text-[var(--color-accent-primary)]" />
              <h2 className="text-3xl font-display font-semibold text-[var(--color-text-primary)] mb-2 tracking-tight">Leaderboard is Hidden</h2>
              <p className="font-inter">The results will be revealed shortly!</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-disabled)] font-inter">
              No completed participants yet.
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((p, index) => {
                const isGold = index === 0;
                const isSilver = index === 1;
                const isBronze = index === 2;
                
                const rowStyle = isGold ? "glass-panel-hover border border-[var(--color-accent-highlight)]/50 text-[var(--color-text-primary)] shadow-[0_0_15px_rgba(242,183,5,0.2)]" 
                               : isSilver ? "glass-panel-hover border border-gray-400/30 text-[var(--color-text-primary)]" 
                               : isBronze ? "glass-panel-hover border border-orange-500/30 text-[var(--color-text-primary)]" 
                               : "glass-panel-recessed text-[var(--color-text-secondary)]";
                               
                const badgeStyle = isGold ? "glass-panel border-[var(--color-accent-highlight)]/30 text-[var(--color-accent-highlight)]" 
                                 : isSilver ? "glass-panel border-gray-300/30 text-gray-300" 
                                 : isBronze ? "glass-panel border-orange-500/30 text-orange-500" 
                                 : "glass-panel-recessed text-[var(--color-text-primary)]";
                                 
                return (
                  <div 
                    key={p.id}
                    className={twMerge(
                      "flex flex-col p-4 rounded-none transition-all",
                      rowStyle
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={twMerge(
                          "w-10 h-10 rounded-sm flex items-center justify-center font-bold text-lg font-display tracking-tight",
                          badgeStyle
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-display font-semibold text-xl truncate max-w-[150px] sm:max-w-[200px] text-[var(--color-text-primary)] tracking-tight leading-none pt-1">
                            {p.username}
                          </div>
                          <div className="text-sm opacity-80 flex items-center space-x-1 font-inter text-[var(--color-text-secondary)] mt-1">
                            <Clock size={14} />
                            <span>{p.total_time_spent.toFixed(2)}s</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={twMerge(
                        "flex items-center space-x-1 font-display font-bold text-xl px-3 py-1 rounded-none",
                        isGold ? "glass-panel text-[var(--color-accent-highlight)] border-[var(--color-accent-highlight)]/30" : "glass-panel text-[var(--color-text-primary)]"
                      )}>
                        <span>{p.score}</span>
                        <Star size={18} className="fill-current mb-0.5" />
                      </div>
                    </div>
                    {p.q10_response && (
                      <div className="mt-3 text-sm text-[var(--color-text-secondary)] glass-panel-recessed p-3 rounded-none border-none italic font-inter">
                        &quot;{p.q10_response}&quot;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
