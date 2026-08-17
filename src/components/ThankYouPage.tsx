'use client';

import { Trophy, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function ThankYouPage() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E53935', '#00629B', '#4A148C', '#ffffff']
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 ieee-gradient text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden p-8 text-center">
        <CheckCircle size={64} className="text-white mx-auto mb-6 drop-shadow-md" />
        <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-md tracking-tight">Quiz Completed!</h1>
        <p className="text-gray-200 text-lg mb-8">
          Thank you for participating in the Fastest Finger First challenge. 
          Your responses have been recorded successfully.
        </p>
        <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-100 p-4 rounded-xl flex items-center justify-center space-x-3 font-medium backdrop-blur-sm">
          <Trophy size={24} className="text-yellow-400 drop-shadow-md" />
          <p>Please wait for the MC to announce the winner!</p>
        </div>
      </div>
    </div>
  );
}
