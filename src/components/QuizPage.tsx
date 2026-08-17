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

  // Random Quip
  const quips = ["Web-slinger's got a question for ya!", "Think fast, True Believer!", "My Spidey-Sense is tingling!", "Don't let this one bug you!"];
  const [quip, setQuip] = useState(quips[0]);

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
        setQuip(quips[Math.floor(Math.random() * quips.length)]);
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
      <div className="min-h-screen flex items-center justify-center marvel-bg text-[var(--color-text-primary)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-display font-semibold tracking-wide text-2xl text-[var(--color-accent-primary)]">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center marvel-bg text-[var(--color-text-primary)] p-4">
        <div className="glass-panel p-6 rounded-none max-w-md text-center relative z-10">
          <AlertCircle size={48} className="mx-auto mb-4 text-[var(--color-feedback-error)]" />
          <h1 className="text-3xl font-display font-semibold mb-4 tracking-tight text-[var(--color-feedback-error)]">Error Loading Question</h1>
          <p className="text-lg opacity-90 font-inter text-[var(--color-text-secondary)]">{error}</p>
          <button 
            onClick={() => { setError(null); fetchQuestion(); }}
            className="mt-6 px-6 py-3 glass-panel-accent hover:glass-panel-hover text-[var(--color-text-primary)] rounded-none font-display font-semibold text-xl tracking-tight transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const maxTime = question.type === 'text' ? 60 : 30;
  const progressPercent = (timeLeft / maxTime) * 100;
  
  return (
    <div className="min-h-screen flex flex-col items-center md:items-end justify-start md:justify-center p-4 marvel-bg text-[var(--color-text-primary)] pt-12 md:pt-4 overflow-x-hidden">
      
      {/* SVG Clip Path Definition for Jagged Progress */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="jagged-burst" clipPathUnits="objectBoundingBox">
            <polygon points="0,0 1,0.1 0.95,0.5 1,0.9 0,1" />
          </clipPath>
        </defs>
      </svg>

      <div className="w-full max-w-[720px] relative mt-16 md:mt-0 md:mr-16">
        
        {/* Mascot Side-Rail (Absolute) */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-left-32 md:top-1/2 md:-translate-y-1/2 flex flex-col items-center md:items-end z-20 transition-all duration-300">
          <div className="glass-panel px-4 py-3 rounded-none mb-2 max-w-[200px] text-center md:text-right font-display font-semibold text-lg text-[var(--color-text-primary)] leading-tight relative">
            {quip}
            {/* Tail */}
            <div className="absolute -bottom-2 right-4 w-4 h-4 glass-panel border-l-0 border-t-0 rotate-45 transform"></div>
          </div>
          <div className="w-24 h-24 md:w-32 md:h-32 glass-panel-accent rounded-full border-2 border-[var(--color-accent-primary)] overflow-hidden animate-bob">
            <img src="/spiderman.png" alt="Spider-Man" className="w-full h-full object-contain p-2" />
          </div>
        </div>

        <div className="glass-panel rounded-none overflow-visible relative z-10">
          {/* Header with Progress Bar */}
          <div className="p-4 sm:p-6 border-b border-[var(--color-glass-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center glass-panel-recessed rounded-none gap-4">
            <div className="comic-caption px-4 py-1 font-display font-bold text-lg uppercase tracking-wider">
              Question {qIndex + 1} / 10
            </div>
            
            <div className="w-full sm:w-1/2 h-8 glass-panel-recessed rounded-none relative overflow-hidden flex items-center p-1">
              {/* Jagged Progress Fill */}
              <div 
                className="h-full bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-highlight)] transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${progressPercent}%`, 
                  clipPath: 'url(#jagged-burst)',
                  filter: progressPercent < 20 ? 'hue-rotate(-30deg)' : 'none'
                }}
              />
              <div className={clsx(
                "absolute right-3 font-display font-bold text-lg",
                timeLeft <= 10 ? "text-[var(--color-feedback-error)] animate-pulse" : "text-white mix-blend-difference"
              )}>
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Question Body */}
          <div className="p-6 glass-panel rounded-none relative">
            <h2 className="text-2xl sm:text-[26px] font-inter font-semibold mb-6 leading-relaxed text-[var(--color-text-primary)]">
              {question.question}
            </h2>

            {question.type === 'mcq' ? (
              <div className="space-y-4">
                {question.options?.map((opt: string, idx: number) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = feedback?.correctIndex === idx;
                  
                  let btnStyle = "glass-panel hover:glass-panel-hover hover:scale-[1.01] text-[var(--color-text-primary)]";
                  let burstOverlay = null;
                  
                  if (feedback) {
                    if (isCorrect) {
                      // Correct Answer State
                      btnStyle = "glass-panel-recessed border-2 border-[var(--color-feedback-success)] text-[var(--color-feedback-success)] z-10 relative";
                      if (isSelected) {
                        burstOverlay = <div className="absolute -top-8 -right-8 font-display font-bold italic text-5xl text-[var(--color-feedback-success)] drop-shadow-[2px_2px_0px_#000] rotate-12 animate-burst-pop pointer-events-none z-50">POW!</div>;
                      }
                    } else if (isSelected && !feedback.isCorrect) {
                      // Picked Wrong Answer State
                      btnStyle = "glass-panel-recessed border-2 border-[var(--color-feedback-error)] text-[var(--color-feedback-error)] animate-shake z-10 relative";
                      burstOverlay = <div className="absolute -top-8 -right-8 font-display font-bold italic text-5xl text-[var(--color-feedback-error)] drop-shadow-[2px_2px_0px_#000] -rotate-12 animate-burst-pop pointer-events-none z-50">BAM!</div>;
                    } else {
                      // Disabled Others
                      btnStyle = "glass-panel opacity-40 cursor-not-allowed text-[var(--color-text-disabled)]";
                    }
                  } else if (isSelected) {
                    // Pre-submit Selected State
                    btnStyle = "glass-panel-accent border-2 border-[var(--color-glass-border-accent)] text-[var(--color-text-primary)]";
                  }

                  return (
                    <div key={idx} className="relative">
                      <button
                        disabled={submitting || feedback !== null}
                        onClick={() => handleOptionClick(idx)}
                        className={clsx(
                          "w-full text-left px-6 py-3 rounded-none transition-all duration-200 font-medium text-lg font-inter outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]",
                          btnStyle
                        )}
                      >
                        {opt}
                      </button>
                      {burstOverlay}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="glass-panel-recessed text-[var(--color-accent-highlight)] p-4 rounded-none flex items-start space-x-3 text-sm font-inter">
                  <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                  <p>This is the final tie-breaker question. Your response will be reviewed if there is a tie.</p>
                </div>
                <textarea
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  disabled={submitting}
                  placeholder="Type your brief proposal here..."
                  className="w-full h-40 p-4 glass-panel-recessed rounded-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] outline-none resize-none text-lg text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] font-inter"
                />
                <div className="flex items-center justify-between">
                  <span className={clsx(
                    "text-sm font-inter font-medium",
                    textResponse.trim().length >= 20 ? "text-[var(--color-feedback-success)]" : "text-[var(--color-text-secondary)]"
                  )}>
                    {textResponse.trim().length} chars (Min 20 required)
                  </span>
                  <button
                    onClick={handleTextSubmit}
                    disabled={submitting || textResponse.trim().length < 20}
                    className="glass-panel-accent hover:glass-panel-hover active:glass-panel-recessed disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-text-primary)] px-8 py-3 rounded-none font-display font-semibold tracking-wide text-xl flex items-center space-x-2 transition-all outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                  >
                    <span>Submit & Finish</span>
                    <Send size={20} className="mt-0.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
