import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../lib/utils';

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizProps {
    title?: string;
    questions: QuizQuestion[];
}

export const Quiz: React.FC<QuizProps> = ({ title = "Quick Fire Quiz", questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;

    const handleNext = () => {
        setSelectedAnswer(null);
        setIsSubmitted(false);
        setCurrentQuestion((prev) => (prev + 1) % questions.length);
    };

    return (
        <GlassCard className="mt-12 border-t-4 border-t-cyan-vibrant">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-vibrant/20 text-cyan-vibrant">
                    <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-wide">{title}</h3>
            </div>

            <div className="mb-8">
                <p className="text-lg text-slate-200 font-medium mb-6">
                    <span className="text-cyan-vibrant mr-2">Q{currentQuestion + 1}.</span>
                    {question.question}
                </p>

                <div className="flex flex-col gap-3">
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => !isSubmitted && setSelectedAnswer(idx)}
                            disabled={isSubmitted}
                            className={cn(
                                "text-left p-4 rounded-xl border transition-all duration-300",
                                !isSubmitted && selectedAnswer === idx
                                    ? "border-cyan-vibrant bg-cyan-vibrant/10 shadow-[0_0_15px_rgba(0,242,255,0.2)] text-white"
                                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
                                isSubmitted && idx === question.correctAnswer && "border-green-500 bg-green-500/20 text-white",
                                isSubmitted && selectedAnswer === idx && !isCorrect && "border-red-500 bg-red-500/20 text-white",
                                isSubmitted && "cursor-default"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {isSubmitted && idx === question.correctAnswer && (
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                )}
                                {isSubmitted && selectedAnswer === idx && !isCorrect && (
                                    <XCircle className="w-5 h-5 text-red-400" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mt-6">
                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 mr-4"
                        >
                            <div className={cn(
                                "p-4 rounded-xl border",
                                isCorrect ? "bg-green-500/10 border-green-500/30 text-green-200" : "bg-red-500/10 border-red-500/30 text-red-200"
                            )}>
                                <p className="font-semibold mb-1">{isCorrect ? "Correct!" : "Incorrect"}</p>
                                <p className="text-sm opacity-90">{question.explanation}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex-1" />
                    )}
                </AnimatePresence>

                <button
                    onClick={() => isSubmitted ? handleNext() : setIsSubmitted(true)}
                    disabled={selectedAnswer === null}
                    className={cn(
                        "px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap",
                        selectedAnswer !== null
                            ? "bg-cyan-vibrant text-space-900 hover:shadow-[0_0_20px_var(--color-cyan-glow)] hover:scale-105"
                            : "bg-white/10 text-slate-400 cursor-not-allowed"
                    )}
                >
                    {isSubmitted ? (currentQuestion === questions.length - 1 ? "Restart Quiz" : "Next Question") : "Submit Answer"}
                </button>
            </div>
        </GlassCard>
    );
};
