'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import QuizPage from '@/components/QuizPage';
import ThankYouPage from '@/components/ThankYouPage';

export default function Home() {
  const [view, setView] = useState<'loading' | 'landing' | 'quiz' | 'leaderboard' | 'inactive'>('loading');

  useEffect(() => {
    const checkState = async () => {
      try {
        const res = await fetch('/api/get-question');
        
        if (res.status === 401 || res.status === 404) {
          setView('landing');
          return;
        }
        
        const data = await res.json();
        if (data.inactive || res.status === 403) {
          setView('inactive');
        } else if (data.completed) {
          setView('leaderboard');
        } else if (data.success || data.question) {
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
      <div className="min-h-screen flex items-center justify-center marvel-bg text-[var(--color-text-primary)]">
        <div className="w-16 h-16 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(226,54,54,0.5)]"></div>
      </div>
    );
  }

  return (
    <main>
      {view === 'landing' && <LandingPage onJoin={() => setView('quiz')} />}
      {view === 'quiz' && <QuizPage onComplete={() => setView('leaderboard')} />}
      {view === 'leaderboard' && <ThankYouPage />}
      {view === 'inactive' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 marvel-bg text-[var(--color-text-primary)] text-center">
          <div className="bg-[var(--color-bg-surface)] elevation-1 p-8 rounded-3xl max-w-md border border-white/5 relative z-10">
            <h1 className="text-5xl font-bangers mb-4 tracking-wide text-[var(--color-accent-primary)] drop-shadow-[0_0_10px_rgba(226,54,54,0.6)]">Quiz is Closed</h1>
            <p className="text-lg text-[var(--color-text-secondary)] font-inter">The quiz is currently not active. Please wait for the event coordinators to start the session, or check back later.</p>
          </div>
        </div>
      )}
    </main>
  );
}
