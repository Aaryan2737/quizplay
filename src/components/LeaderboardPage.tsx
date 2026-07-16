'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Clock, Star, AlertTriangle } from 'lucide-react';
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

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
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
    
    // Trigger confetti on mount
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
    <div className="min-h-screen flex flex-col items-center p-4 ieee-gradient text-white py-12">
      <div className="w-full max-w-2xl bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-6 bg-[#00629B] text-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Trophy size={28} className="text-yellow-400 fill-current" />
            <h1 className="text-2xl font-bold">Leaderboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleReset}
              disabled={resetting}
              className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
              title="Reset Database"
            >
              <AlertTriangle size={20} className={clsx(resetting && "animate-pulse")} />
            </button>
            <button 
              onClick={handleRefresh}
              className="p-2 bg-[#004c7a] rounded-full hover:bg-[#003d61] transition-colors"
              title="Refresh"
            >
              <RefreshCw size={20} className={clsx(refreshing && "animate-spin")} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No completed participants yet.
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((p, index) => {
                return (
                  <div 
                    key={p.id}
                    className={twMerge(
                      "flex flex-col p-4 rounded-xl border transition-shadow shadow-sm hover:shadow-md",
                      index === 0 ? "border-yellow-400 bg-yellow-50/50" : "border-gray-200 bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={twMerge(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                          index === 0 ? "bg-yellow-400 text-white shadow-lg shadow-yellow-200" : "bg-gray-100 text-gray-500"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-900 capitalize truncate max-w-[150px] sm:max-w-[200px]">
                            {p.username}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{p.total_time_spent.toFixed(2)}s</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 font-bold text-lg bg-[#00629B]/10 text-[#00629B] px-3 py-1 rounded-lg">
                        <span>{p.score}</span>
                        <Star size={16} className="fill-current" />
                      </div>
                    </div>
                    {p.q10_response && (
                      <div className="mt-3 text-sm text-gray-700 bg-white/50 p-3 rounded-lg border border-gray-100 italic">
                        "{p.q10_response}"
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
