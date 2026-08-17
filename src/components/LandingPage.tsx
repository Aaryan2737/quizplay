'use client';

import { useState } from 'react';
import { ArrowRight, Trophy, Zap } from 'lucide-react';

interface LandingPageProps {
  onJoin: () => void;
}

export default function LandingPage({ onJoin }: LandingPageProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        onJoin();
      } else {
        setError(data.error || 'Failed to join. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('A network error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 ieee-gradient text-white">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-white/20 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/20">
            <Zap size={40} className="fill-current drop-shadow-md" />
          </div>
          
          <h1 className="text-3xl font-extrabold mb-2 text-white drop-shadow-md tracking-tight">
            Fastest Finger First
          </h1>
          <p className="text-gray-200 mb-8 font-medium">
            HackWithIndia x IEEE Orientation
          </p>
          
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your unique username"
                className="w-full px-4 py-4 bg-black/20 border border-white/20 rounded-xl focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors text-lg text-white placeholder-gray-300"
                disabled={loading}
              />
              {error && <p className="text-red-300 font-medium text-sm mt-2 text-left">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white py-4 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 backdrop-blur-sm shadow-lg"
            >
              <span>{loading ? 'Joining...' : 'Join Challenge'}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
        
        <div className="bg-black/10 p-6 border-t border-white/10">
          <div className="flex items-center space-x-3 text-sm text-gray-200">
            <Trophy className="text-yellow-400 flex-shrink-0 drop-shadow" size={20} />
            <p>Answer 10 questions as fast as possible to climb the leaderboard. Good luck!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
