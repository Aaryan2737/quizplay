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
      colors: ['#ED1D24', '#000000', '#ffffff', '#FFD700']
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 marvel-bg text-[var(--color-text-primary)]">
      {/* Subtle radial glow behind the main card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[600px] bg-[radial-gradient(ellipse_at_center,rgba(226,54,54,0.15)_0%,rgba(31,111,214,0.15)_50%,transparent_70%)] z-0 pointer-events-none mix-blend-screen opacity-70"></div>
      
      <div className="w-full max-w-md glass-panel rounded-none overflow-hidden p-6 text-center relative z-10">
        <CheckCircle size={64} className="text-[var(--color-accent-primary)] mx-auto mb-6 drop-shadow-[0_0_10px_rgba(226,54,54,0.6)]" />
        <h1 className="text-4xl font-display font-bold text-[var(--color-text-primary)] mb-4 tracking-tight uppercase">Quiz Completed!</h1>
        <p className="text-[var(--color-text-secondary)] font-inter text-lg mb-6">
          Thank you for participating in the Fastest Finger First challenge. 
          Your responses have been recorded successfully.
        </p>
        <div className="glass-panel-recessed border border-[var(--color-accent-highlight)]/30 text-[var(--color-accent-highlight)] p-4 rounded-none flex items-center justify-center space-x-3 font-inter font-medium">
          <Trophy size={24} className="text-[var(--color-accent-highlight)] drop-shadow-md" />
          <p>Please wait for the MC to announce the winner!</p>
        </div>
      </div>
    </div>
  );
}
