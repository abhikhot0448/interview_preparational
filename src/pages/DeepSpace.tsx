import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { CodeViewer } from '../components/CodeViewer';
import { Quiz } from '../components/Quiz';
import { motion } from 'framer-motion';
import { Cpu, Zap } from 'lucide-react';

const spanCode = `
// Bad: Substring creates multiple string allocations on the Heap
public string GetLastName_Bad(string fullName) {
    var lastSpace = fullName.LastIndexOf(' ');
    // Allocates a BRAND NEW string in memory!
    return lastSpace == -1 ? fullName : fullName.Substring(lastSpace + 1);
}

// Good: Span<T> acts as a "window" into existing memory. ZERO new allocations!
public ReadOnlySpan<char> GetLastName_Good(ReadOnlySpan<char> fullName) {
    var lastSpace = fullName.LastIndexOf(' ');
    // Slices the span. Costs exactly 0 heap allocations.
    return lastSpace == -1 ? fullName : fullName.Slice(lastSpace + 1);
}
`;

const valueTaskCode = `
// A normal Task is a reference type (Heap allocation)
public async Task<int> GetUserAgeAsync(int userId) {
    return await _db.GetAge(userId); 
}

// ValueTask is a struct (Value type). It avoids allocation if the 
// result completes synchronously (e.g., fetching from a cache).
private Dictionary<int, int> _cache = new();

public async ValueTask<int> GetUserAgeOptimizedAsync(int userId) {
    if (_cache.TryGetValue(userId, out int cachedAge)) {
        // Boom! No Task allocation. Returns synchronously.
        return cachedAge; 
    }
    
    // Fall back to actual async work
    int age = await _db.GetAge(userId);
    _cache[userId] = age;
    return age;
}
`;

export const DeepSpace: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-vibrant">
                    Deep Space
                </h1>
                <p className="text-xl text-slate-400">High-Performance .NET and Zero-Allocation Systems.</p>
            </motion.div>

            <div className="space-y-8">
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-rose-500/20 p-3 rounded-xl"><Cpu className="text-rose-400" /></div>
                        <h2 className="text-2xl font-bold">Span&lt;T&gt; & Memory&lt;T&gt;</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        In high-performance systems, strings are the enemy of memory. Strings are immutable; calling <code>.Substring()</code> creates entirely new strings on the Heap, forcing Garbage Collection.
                        <br /><br />
                        <code>Span&lt;T&gt;</code> is a value-type that represents a contiguous region of memory. It allows you to <strong>slice</strong> existing memory without allocating new objects.
                    </p>
                    <CodeViewer code={spanCode} title="ZeroAllocation.cs" />
                </GlassCard>

                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-yellow-500/20 p-3 rounded-xl"><Zap className="text-yellow-400" /></div>
                        <h2 className="text-2xl font-bold">ValueTask vs Task</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        A <code>Task</code> is a reference type, meaning it allocates memory on the heap every single time it gets created.
                        If you have an API route that gets called 10,000 times a second, and often returns immediately (like from a short-circuit cache), you are creating 10,000 useless Tasks.
                        <br /><br />
                        <code>ValueTask</code> solves this by acting as a struct. If the operation completes synchronously, there is <strong>zero allocation</strong>.
                    </p>
                    <CodeViewer code={valueTaskCode} title="HighPerfAsync.cs" />
                </GlassCard>
            </div>

            <Quiz
                title="Deep Space Certification"
                questions={[
                    {
                        question: "Why does returning ReadOnlySpan<char> perform better than returning string.Substring()?",
                        options: [
                            "Span is processed directly by the GPU",
                            "Span bypasses bounds-checking in C#",
                            "Span acts as a window to existing memory rather than allocating a new memory block",
                            "ReadOnlySpan is automatically cached by the .NET Runtime"
                        ],
                        correctAnswer: 2,
                        explanation: "Span simply consists of a pointer to the existing memory and a length. It creates no new allocations, meaning the Garbage Collector ignores it completely."
                    },
                    {
                        question: "When should you prefer returning a ValueTask<T> instead of a Task<T>?",
                        options: [
                            "Always, because ValueTask is fundamentally faster in every scenario",
                            "When the returned method frequently completes synchronously (e.g., retrieving from a cache)",
                            "When doing heavy, continuous CPU-bound blocking work",
                            "When you need to await the same task multiple times concurrently"
                        ],
                        correctAnswer: 1,
                        explanation: "ValueTask prevents a heap allocation if the work finishes immediately. However, it actually has slightly more overhead if the operation is genuinely asynchronous, so it shouldn't just replace Task blindly."
                    }
                ]}
            />
        </div>
    );
};
