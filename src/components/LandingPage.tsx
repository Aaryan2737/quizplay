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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 marvel-bg text-[var(--color-text-primary)]">
      {/* Subtle radial glow behind the main card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[600px] bg-[radial-gradient(ellipse_at_center,rgba(226,54,54,0.35)_0%,rgba(31,111,214,0.25)_50%,transparent_70%)] z-0 pointer-events-none mix-blend-screen opacity-90"></div>
      
      <div className="max-w-md w-full glass-panel glass-panel-cut rounded-none overflow-hidden relative z-10">
        <div className="p-6 text-center">
          <div className="w-20 h-20 glass-panel-accent text-[var(--color-accent-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap size={40} className="fill-current" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold mb-1 text-[var(--color-text-primary)] tracking-tight drop-shadow-md">
            Fastest Finger First
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6 font-medium font-inter">
            Marvel Trivia Challenge
          </p>
          
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your hero alias"
                className="w-full px-4 py-3 glass-panel-recessed rounded-none focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-primary)] transition-colors text-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] font-inter"
                disabled={loading}
              />
              {error && <p className="text-[var(--color-feedback-error)] font-medium text-sm mt-2 text-left">{error}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 glass-panel-accent hover:glass-panel-hover active:glass-panel-recessed text-[var(--color-text-primary)] py-3 rounded-none font-display font-semibold text-2xl tracking-tight transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Entering...' : 'Join Challenge'}</span>
              {!loading && <ArrowRight size={28} className="mt-1" />}
            </button>
          </form>
        </div>
        
        <div className="glass-panel-recessed rounded-none p-4 border-t border-[var(--color-glass-border)]">
          <div className="flex items-center space-x-3 text-sm text-[var(--color-text-secondary)] font-inter">
            <Trophy className="text-[var(--color-accent-highlight)] flex-shrink-0" size={20} />
            <p>Answer 10 Marvel questions as fast as possible to climb the leaderboard. Good luck!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
