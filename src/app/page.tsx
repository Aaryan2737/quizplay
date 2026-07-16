'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import QuizPage from '@/components/QuizPage';
import LeaderboardPage from '@/components/LeaderboardPage';

export default function Home() {
  const [view, setView] = useState<'loading' | 'landing' | 'quiz' | 'leaderboard'>('loading');

  useEffect(() => {
    const checkState = async () => {
      try {
        const res = await fetch('/api/get-question');
        
        if (res.status === 401 || res.status === 404) {
          setView('landing');
          return;
        }
        
        const data = await res.json();
        if (data.completed) {
          setView('leaderboard');
        } else if (data.success) {
          setView('quiz');
        } else {
          setView('landing');
        }
      } catch (err) {
        setView('landing');
      }
    };
    
    checkState();
  }, []);

  if (view === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center ieee-gradient text-white">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main>
      {view === 'landing' && <LandingPage onJoin={() => setView('quiz')} />}
      {view === 'quiz' && <QuizPage onComplete={() => setView('leaderboard')} />}
      {view === 'leaderboard' && <LeaderboardPage />}
    </main>
  );
}
