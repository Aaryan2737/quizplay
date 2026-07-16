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
      <div className="max-w-md w-full bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-blue-50 text-[#00629B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Zap size={40} className="fill-current" />
          </div>
          
          <h1 className="text-3xl font-extrabold mb-2 text-[#00629B]">
            Fastest Finger First
          </h1>
          <p className="text-gray-500 mb-8 font-medium">
            IEEE Inaugural Ceremony Challenge
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
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#00629B] focus:ring-1 focus:ring-[#00629B] transition-colors text-lg"
                disabled={loading}
              />
              {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-[#00629B] hover:bg-[#004c7a] text-white py-4 rounded-xl font-bold text-lg transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              <span>{loading ? 'Joining...' : 'Join Challenge'}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Trophy className="text-yellow-500 flex-shrink-0" size={20} />
            <p>Answer 10 questions as fast as possible to climb the leaderboard. Good luck!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
