'use client';

import { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Clock, Send, AlertCircle } from 'lucide-react';
import { QuestionType } from '@/lib/questions';

export default function QuizPage({ onComplete }: { onComplete: () => void }) {
  const [question, setQuestion] = useState<any>(null);
  const [qIndex, setQIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(30);
  
  // Interaction state
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctIndex?: number } | null>(null);
  
  // Text response
  const [textResponse, setTextResponse] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/get-question');
      const data = await res.json();
      if (data.inactive || res.status === 403) {
        window.location.reload();
      } else if (data.completed) {
        onComplete();
      } else if (data.success || data.question) {
        setQuestion(data.question);
        setQIndex(data.current_question_index);
        startTimer(data.question.type);
      } else {
        setError(data.error || 'Failed to load question from server.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    return () => clearTimer();
  }, []);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = (qType: string) => {
    clearTimer();
    const timeLimit = qType === 'text' ? 60 : 30;
    setTimeLeft(timeLimit);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = async () => {
    if (submitting) return;
    await submitAnswer(null, '');
  };

  const submitAnswer = async (answerIndex: number | null, text: string) => {
    if (submitting) return;
    setSubmitting(true);
    clearTimer();
    
    try {
      const res = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerIndex, textResponse: text })
      });
      const data = await res.json();
      
      if (data.error === 'Quiz already completed' || data.completed) {
        onComplete();
        return;
      }
      
      if (question.type === 'mcq') {
        setFeedback({
          isCorrect: data.correct,
          correctIndex: data.correctAnswerIndex
        });
        
        // Wait 1.5 seconds to show feedback before fetching next
        setTimeout(() => {
          resetState();
          fetchQuestion();
        }, 1500);
      } else {
        onComplete();
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const resetState = () => {
    setSubmitting(false);
    setSelectedOption(null);
    setFeedback(null);
    setTextResponse('');
  };

  const handleOptionClick = (index: number) => {
    if (submitting || feedback) return;
    setSelectedOption(index);
    submitAnswer(index, '');
  };

  const handleTextSubmit = () => {
    if (textResponse.trim().length < 20) return;
    submitAnswer(null, textResponse.trim());
  };

  if (loading && !question) {
    return (
      <div className="min-h-screen flex items-center justify-center ieee-gradient text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-bold text-xl">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center ieee-gradient text-white p-4">
        <div className="bg-red-500/20 p-8 rounded-3xl backdrop-blur-md max-w-md border border-red-500/50 shadow-2xl text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-300" />
          <h1 className="text-2xl font-bold mb-4">Error Loading Question</h1>
          <p className="text-lg opacity-90">{error}</p>
          <button 
            onClick={() => { setError(null); fetchQuestion(); }}
            className="mt-6 px-6 py-2 bg-white text-red-600 rounded-full font-bold hover:bg-gray-100"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  // SVG Circular progress calc
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const maxTime = question.type === 'text' ? 60 : 30;
  const strokeDashoffset = circumference - (timeLeft / maxTime) * circumference;
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 ieee-gradient text-white">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden mt-6">
        
        {/* Header with Timer */}
        <div className="p-6 border-b border-white/20 flex justify-between items-center bg-black/10">
          <div className="font-bold text-lg text-white tracking-wide">
            Question {qIndex + 1} / 10
          </div>
          
          <div className="relative flex items-center justify-center w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-white/20"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={clsx(
                  "transition-all duration-1000 ease-linear",
                  timeLeft > 10 ? "text-white" : "text-red-400"
                )}
              />
            </svg>
            <div className={clsx(
              "absolute text-xl font-bold",
              timeLeft > 10 ? "text-white" : "text-red-400 animate-pulse drop-shadow-md"
            )}>
              {timeLeft}
            </div>
          </div>
        </div>

        {/* Question Body */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold mb-8 leading-relaxed text-white drop-shadow-sm">
            {question.question}
          </h2>

          {question.type === 'mcq' ? (
            <div className="space-y-4">
              {question.options?.map((opt: string, idx: number) => {
                let btnStyle = "bg-white/10 border-white/20 hover:border-white/50 hover:bg-white/20 text-white backdrop-blur-sm";
                
                if (feedback) {
                  if (idx === feedback.correctIndex) {
                    btnStyle = "bg-green-500/40 border-green-400 text-white shadow-[0_0_15px_rgba(74,222,128,0.4)]"; // Correct answer
                  } else if (idx === selectedOption && !feedback.isCorrect) {
                    btnStyle = "bg-red-500/40 border-red-400 text-white shadow-[0_0_15px_rgba(248,113,113,0.4)]"; // Picked wrong answer
                  } else {
                    btnStyle = "bg-white/5 border-white/10 opacity-50 cursor-not-allowed text-gray-300"; // Others
                  }
                } else if (selectedOption === idx) {
                  btnStyle = "bg-white/30 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]";
                }

                return (
                  <button
                    key={idx}
                    disabled={submitting || feedback !== null}
                    onClick={() => handleOptionClick(idx)}
                    className={clsx(
                      "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg",
                      btnStyle,
                      (!submitting && !feedback) && "active:scale-[0.98]"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-100 p-4 rounded-xl flex items-start space-x-3 text-sm backdrop-blur-sm">
                <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                <p>This is the final tie-breaker question. Your response will be reviewed if there is a tie.</p>
              </div>
              <textarea
                value={textResponse}
                onChange={(e) => setTextResponse(e.target.value)}
                disabled={submitting}
                placeholder="Type your brief proposal here..."
                className="w-full h-40 p-4 bg-black/20 border border-white/20 rounded-xl focus:border-white focus:ring-1 focus:ring-white outline-none resize-none text-lg text-white placeholder-gray-400 backdrop-blur-sm"
              />
              <div className="flex items-center justify-between">
                <span className={clsx(
                  "text-sm font-medium",
                  textResponse.trim().length >= 20 ? "text-green-400" : "text-gray-300"
                )}>
                  {textResponse.trim().length} chars (Min 20 required)
                </span>
                <button
                  onClick={handleTextSubmit}
                  disabled={submitting || textResponse.trim().length < 20}
                  className="bg-white/20 hover:bg-white/30 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-transform active:scale-95 shadow-lg backdrop-blur-sm"
                >
                  <span>Submit & Finish</span>
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
