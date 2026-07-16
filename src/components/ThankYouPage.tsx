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
      colors: ['#00629B', '#FFC107', '#ffffff']
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 ieee-gradient text-white">
      <div className="w-full max-w-md bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden p-8 text-center">
        <CheckCircle size={64} className="text-[#00629B] mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[#00629B] mb-4">Quiz Completed!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you for participating in the Fastest Finger First challenge. 
          Your responses have been recorded successfully.
        </p>
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl flex items-center justify-center space-x-3 font-medium">
          <Trophy size={24} className="text-yellow-500" />
          <p>Please wait for the MC to announce the winner!</p>
        </div>
      </div>
    </div>
  );
}
