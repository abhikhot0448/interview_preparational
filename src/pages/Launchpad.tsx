import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { CodeViewer } from '../components/CodeViewer';
import { Quiz } from '../components/Quiz';
import { motion } from 'framer-motion';
import {
    Layers, Box, Lock, Code, Type,
    BoxSelect, Activity, Database, Zap
} from 'lucide-react';

const syntaxTypeCode = `
// 1. Data Types
int myAge = 25;                  // Value type (Stack)
double salary = 45000.50;
string name = "Antigravity";      // Reference type (Heap)
bool isActive = true;

// 2. Control Flow
if (isActive) {
    Console.WriteLine($"Welcome {name}");
}

// 3. Loops (foreach is optimized for IEnumerable)
var numbers = new[] { 1, 2, 3 };
foreach (var num in numbers) {
    Console.WriteLine(num);
}
`;

const oopCode = `
// Encapsulation & Properties
public class Employee {
    // Auto-property
    public string Name { get; set; } 
    
    // Encapsulation: Private backing field
    private int _salary;
    public int Salary {
        get => _salary;
        set => _salary = value > 0 ? value : 0;
    }
}

// Inheritance & Polymorphism
public abstract class Animal {
    public abstract void MakeSound(); // Abstract method (no implementation)
}

public class Dog : Animal {
    public override void MakeSound() { // Overriding base method
        Console.WriteLine("Bark!");
    }
}
`;

const methodParamsCode = `
// 'ref' requires initialization before passing
// 'out' requires initialization inside the method
public void UpdateValues(ref int a, out int b) {
    a += 10;   
    b = 20;    
}

int val1 = 5;
// int val2; // Not initialized
UpdateValues(ref val1, out int val2); // Inline out declaration
// val1 is 15, val2 is 20
`;

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
// Avoid using non-generic collections like strictly an ArrayList.
`;

const linqCode = `
// LINQ: Language Integrated Query
var scores = new List<int> { 97, 92, 81, 60, 100 };

// Fluent Syntax
var highScores = scores
    .Where(s => s > 90)
    .OrderByDescending(s => s)
    .Select(s => $"Score: {s}");

foreach (var score in highScores) {
    Console.WriteLine(score); 
}
`;

const asyncCode = `
// Async / Await Basics
public async Task<string> FetchDataAsync(string url) {
    using var client = new HttpClient();
    
    // The thread is freed up here while waiting for the network
    var result = await client.GetStringAsync(url);
    
    return result; // Implicitly wrapped in a Task<string>
}
`;

const exceptionCode = `
try {
    int parsed = int.Parse("not-a-number");
} 
catch (FormatException ex) {
    Console.WriteLine($"Format error: {ex.Message}");
    throw; // Rethrow to preserve stack trace! (Don't use 'throw ex;')
} 
catch (Exception ex) {
    Console.WriteLine($"General error: {ex.Message}");
} 
finally {
    Console.WriteLine("Always runs, even if an exception is thrown. Great for cleanup.");
}
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
                <p className="text-xl text-slate-400">Mastering the foundation of .NET engineering. Covers all basic C# necessities.</p>
            </motion.div>

            <div className="space-y-8">
                {/* 1. Syntax, Types, Flow */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-500/20 p-3 rounded-xl"><Type className="text-green-400" /></div>
                        <h2 className="text-2xl font-bold">1. Syntax, Variables & Control Flow</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        C# is a statically-typed language. You define your data types upfront (or use <code>var</code> for implicit typing). Control flow structures like <code>if</code>, <code>switch</code>, and <code>foreach</code> power the logic.
                    </p>
                    <CodeViewer code={syntaxTypeCode} title="Basics.cs" />
                </GlassCard>

                {/* 2. OOP */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-indigo-500/20 p-3 rounded-xl"><BoxSelect className="text-indigo-400" /></div>
                        <h2 className="text-2xl font-bold">2. Object-Oriented Programming (OOP)</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        The core pillars are <strong className="text-cyan-vibrant">Encapsulation</strong> (hiding internal state), <strong className="text-cyan-vibrant">Inheritance</strong> (reusing code), <strong className="text-cyan-vibrant">Polymorphism</strong> (overriding behavior), and <strong className="text-cyan-vibrant">Abstraction</strong> (defining contracts).
                    </p>
                    <CodeViewer code={oopCode} title="OOP.cs" />
                </GlassCard>

                {/* 3. Methods & Params */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-yellow-500/20 p-3 rounded-xl"><Code className="text-yellow-400" /></div>
                        <h2 className="text-2xl font-bold">3. Methods & Parameters (ref, out)</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        By default, parameters are passed by value. The <code>ref</code> and <code>out</code> keywords allow passing by reference, meaning modifications inside the method affect the original variable.
                    </p>
                    <CodeViewer code={methodParamsCode} title="Parameters.cs" />
                </GlassCard>

                {/* 4. Memory (Value vs Reference Types) */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl"><Layers className="text-blue-400" /></div>
                        <h2 className="text-2xl font-bold">4. Value Types vs Reference Types</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        <strong className="text-cyan-vibrant font-medium mx-1">Value types</strong> are stored on the Stack (fast, short-lived), while
                        <strong className="text-cyan-vibrant font-medium mx-1">Reference types</strong> live on the Heap (managed by Garbage Collector).
                    </p>
                    <CodeViewer code={valueVsRefCode} title="Memory.cs" />
                </GlassCard>

                {/* 5. Boxing & Unboxing */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-500/20 p-3 rounded-xl"><Box className="text-purple-400" /></div>
                        <h2 className="text-2xl font-bold">5. Boxing & Unboxing</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Boxing converts a value type to an <code>object</code>. This is computationally expensive because it forces a new allocation on the heap.
                    </p>
                    <CodeViewer code={boxingCode} title="Boxing.cs" />
                </GlassCard>

                {/* 6. Exception Handling */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-500/20 p-3 rounded-xl"><Activity className="text-red-400" /></div>
                        <h2 className="text-2xl font-bold">6. Exception Handling</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Wrap risky code in a <code>try-catch</code> block. Use <code>finally</code> to clean up resources, like closing file streams or database connections.
                    </p>
                    <CodeViewer code={exceptionCode} title="Exceptions.cs" />
                </GlassCard>

                {/* 7. LINQ */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-teal-500/20 p-3 rounded-xl"><Database className="text-teal-400" /></div>
                        <h2 className="text-2xl font-bold">7. LINQ (Language Integrated Query)</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        LINQ provides a powerful, declarative way to query and manipulate collections, databases, and XML.
                    </p>
                    <CodeViewer code={linqCode} title="LinqOverview.cs" />
                </GlassCard>

                {/* 8. Async / Await */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-pink-500/20 p-3 rounded-xl"><Zap className="text-pink-400" /></div>
                        <h2 className="text-2xl font-bold">8. Asynchronous Programming (Async/Await)</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Use <code>async</code> and <code>await</code> to prevent blocking the main thread during I/O bound operations (like network calls or disk access).
                    </p>
                    <CodeViewer code={asyncCode} title="AsyncAwait.cs" />
                </GlassCard>

                {/* 9. Access Modifiers */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-orange-500/20 p-3 rounded-xl"><Lock className="text-orange-400" /></div>
                        <h2 className="text-2xl font-bold">9. Access Modifiers</h2>
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
                    },
                    {
                        question: "What happens when you use 'throw ex;' instead of 'throw;'?",
                        options: [
                            "The compiler will throw an error.",
                            "The application will crash immediately.",
                            "The original stack trace is lost and resets to the current line.",
                            "It correctly bubbles the exception up."
                        ],
                        correctAnswer: 2,
                        explanation: "Using 'throw;' preserves the original stack trace. Using 'throw ex;' resets the stack trace, making debugging much harder."
                    },
                    {
                        question: "Which keyword modifies a parameter so it doesn't need to be initialized before being passed?",
                        options: [
                            "ref",
                            "in",
                            "out",
                            "params"
                        ],
                        correctAnswer: 2,
                        explanation: "The 'out' keyword requires the method to assign a value before returning, so the caller doesn't need to initialize it first."
                    }
                ]}
            />
        </div>
    );
};
