import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { CodeViewer } from '../components/CodeViewer';
import { Quiz } from '../components/Quiz';
import { motion } from 'framer-motion';
import { Layers, Box, Lock } from 'lucide-react';

const valueVsRefCode = `
// Value Type (Struct)
public struct Point {
    public int X;
    public int Y;
}

// Reference Type (Class)
public class User {
    public string Name;
}

public void DemonstrateMemory() {
    // Stored on the Stack. Fast allocation/deallocation.
    Point p1 = new Point { X = 10, Y = 20 };
    Point p2 = p1; // Creates a complete copy
    p2.X = 30; // p1.X is still 10

    // Stored on the Heap. Handled by Garbage Collector.
    User u1 = new User { Name = "Alice" };
    User u2 = u1; // u2 points to the SAME memory location
    u2.Name = "Bob"; // u1.Name is now "Bob"
}
`;

const boxingCode = `
int i = 123;      // Value type
object o = i;     // Boxing: wraps 'i' in a reference type (Heap allocation!)
int j = (int)o;   // Unboxing: extracts the value back

// Why it matters:
// Boxing causes a heap allocation and garbage collection overhead.
// Avoid using non-generic collections like an ArrayList in high-performance code.
`;

export const Launchpad: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-vibrant">
                    Launchpad
                </h1>
                <p className="text-xl text-slate-400">Mastering the foundation of .NET engineering.</p>
            </motion.div>

            <div className="space-y-8">
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl"><Layers className="text-blue-400" /></div>
                        <h2 className="text-2xl font-bold">Value vs Reference Types</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Understanding memory management is the first hurdle in any C# interview.
                        <strong className="text-cyan-vibrant font-medium mx-1">Value types</strong> are stored on the Stack (fast, short-lived), while
                        <strong className="text-cyan-vibrant font-medium mx-1">Reference types</strong> live on the Heap (slower assignment, managed by GC).
                    </p>
                    <CodeViewer code={valueVsRefCode} title="Memory.cs" />
                </GlassCard>

                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-500/20 p-3 rounded-xl"><Box className="text-purple-400" /></div>
                        <h2 className="text-2xl font-bold">Boxing & Unboxing</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Boxing is the process of converting a value type to the type <code>object</code>. This is computationally expensive because it forces a new allocation on the heap.
                    </p>
                    <CodeViewer code={boxingCode} title="Boxing.cs" />
                </GlassCard>

                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-orange-500/20 p-3 rounded-xl"><Lock className="text-orange-400" /></div>
                        <h2 className="text-2xl font-bold">Access Modifiers (Quick Recap)</h2>
                    </div>
                    <ul className="space-y-3 text-slate-300">
                        <li className="flex gap-3"><strong className="text-white w-24">public:</strong> <span>Access is not restricted.</span></li>
                        <li className="flex gap-3"><strong className="text-white w-24">private:</strong> <span>Access is limited to the containing type.</span></li>
                        <li className="flex gap-3"><strong className="text-white w-24">protected:</strong> <span>Access is limited to the containing class or types derived from it.</span></li>
                        <li className="flex gap-3"><strong className="text-white w-24">internal:</strong> <span>Access is limited to the current assembly (.dll or .exe).</span></li>
                    </ul>
                </GlassCard>
            </div>

            <Quiz
                title="Launchpad Certification"
                questions={[
                    {
                        question: "Which of the following causes an allocation on the heap?",
                        options: [
                            "Declaring a struct inside a method",
                            "Boxing an integer into an object",
                            "Passing an int by reference using 'ref'",
                            "Creating a local variable of type double"
                        ],
                        correctAnswer: 1,
                        explanation: "Boxing takes a stack-allocated value type and wraps it in a reference type object, forcing an allocation on the managed heap."
                    },
                    {
                        question: "What is the primary benefit of structs over classes in C#?",
                        options: [
                            "They support multiple inheritance",
                            "They are automatically garbage collected immediately",
                            "They can avoid heap allocation overhead for small, short-lived data",
                            "They can hold unlimited amounts of string data"
                        ],
                        correctAnswer: 2,
                        explanation: "Structs are value types allocated on the stack. For small, densely packed data, this completely bypasses the Garbage Collector overhead."
                    }
                ]}
            />
        </div>
    );
};
