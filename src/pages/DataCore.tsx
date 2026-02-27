import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import questionsData from '../data/questions.json';

interface Question {
    id: number;
    question: string;
    answer: string;
}

const QUESTIONS_PER_PAGE = 20;

export const DataCore: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Filter questions based on search
    const filteredQuestions = useMemo(() => {
        if (!searchQuery.trim()) return questionsData;

        const query = searchQuery.toLowerCase();
        return questionsData.filter((q: Question) =>
            q.question.toLowerCase().includes(query) ||
            q.answer.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    // Handle pagination logic
    const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
    const currentQuestions = filteredQuestions.slice(
        (currentPage - 1) * QUESTIONS_PER_PAGE,
        currentPage * QUESTIONS_PER_PAGE
    );

    // Reset page when search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-vibrant flex items-center gap-4">
                    <Database className="w-10 h-10 text-cyan-vibrant" />
                    The Data Core
                </h1>
                <p className="text-xl text-slate-400">
                    Archival database containing {questionsData.length} core .NET interview queries.
                </p>
            </motion.div>

            {/* Search Bar */}
            <GlassCard className="mb-8 sticky top-4 z-50 shadow-2xl backdrop-blur-3xl bg-space-900/80">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-cyan-vibrant" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl leading-5 bg-transparent placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-vibrant/50 focus:border-cyan-vibrant/50 sm:text-lg transition-all"
                        placeholder="Search thousands of answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="mt-2 text-sm text-slate-400 ml-2">
                    {filteredQuestions.length} matches found
                </div>
            </GlassCard>

            {/* Question List */}
            <div className="space-y-4 mb-8">
                <AnimatePresence>
                    {currentQuestions.map((q: Question) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <GlassCard
                                className="p-0 overflow-hidden"
                                hoverEffect
                            >
                                <div
                                    className="w-full text-left p-6 font-semibold text-lg flex justify-between items-center cursor-pointer group"
                                    onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                                >
                                    <span className="flex-1 pr-4 text-white group-hover:text-cyan-vibrant transition-colors">
                                        <span className="text-cyan-vibrant/50 mr-2 text-sm">#{q.id}</span>
                                        {q.question}
                                    </span>
                                    {expandedId === q.id ? (
                                        <ChevronUp className="w-5 h-5 text-cyan-vibrant flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-cyan-vibrant flex-shrink-0 transition-colors" />
                                    )}
                                </div>

                                <AnimatePresence>
                                    {expandedId === q.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-white/5 bg-white/[0.02]"
                                        >
                                            <div className="p-6 text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                {q.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-slate-400">
                        Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-cyan-vibrant/20 hover:bg-cyan-vibrant/40 text-cyan-vibrant disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
