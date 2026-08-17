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
      <div className="min-h-screen flex items-center justify-center ieee-gradient text-white">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main>
      {view === 'landing' && <LandingPage onJoin={() => setView('quiz')} />}
      {view === 'quiz' && <QuizPage onComplete={() => setView('leaderboard')} />}
      {view === 'leaderboard' && <ThankYouPage />}
      {view === 'inactive' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 ieee-gradient text-white text-center">
          <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-xl max-w-md border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <h1 className="text-3xl font-bold mb-4 drop-shadow-md tracking-tight">Quiz is Closed</h1>
            <p className="text-lg text-gray-200">The quiz is currently not active. Please wait for the event coordinators to start the session, or check back later.</p>
          </div>
        </div>
      )}
    </main>
  );
}
