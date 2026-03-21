import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { CodeViewer } from '../components/CodeViewer';
import { Quiz } from '../components/Quiz';
import { motion } from 'framer-motion';
import {
    Cpu, Zap, Recycle, Search,
    GitBranch, Database, Code, ShieldAlert,
    Terminal, Activity
} from 'lucide-react';

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

const gcCode = `
// Structs (Value types) go to the Stack. Fast and destroyed automatically.
int age = 25; 

// Classes (Reference types) go to the Heap. The GC must clean them up.
var user = new User(); // Gen 0 (Small Object Heap)

// Very large objects (Arrays > 85,000 bytes) skip Gen 0 and Gen 1. 
// They go directly to the LOH (Large Object Heap).
// LOH collections are very expensive and cause fragmentation.
byte[] imageBuffer = new byte[100_000]; // LOH Allocation

// IDisposable pattern: Deterministic cleanup for unmanaged resources (DB connections, files)
public class DataProcessor : IDisposable {
    private SqlConnection _conn = new SqlConnection();

    public void Dispose() {
        _conn?.Dispose(); 
        // Prevent the GC from calling the finalizer since we already cleaned up
        GC.SuppressFinalize(this); 
    }
}
`;

const iqueryableCode = `
// IEnumerable: The query executes IN MEMORY.
IEnumerable<User> users = dbContext.Users; 
// The DB returns ALL USERS. Then C# filters them in RAM (Memory explosion!)
var filteredMemory = users.Where(u => u.Age > 18).ToList(); 

// IQueryable: The query is an EXPRESSION TREE. It executes ON THE SQL SERVER.
IQueryable<User> query = dbContext.Users;
// The expression is translated to: SELECT * FROM Users WHERE Age > 18
var filteredDb = query.Where(u => u.Age > 18).ToList(); // Executes precisely mapped SQL
`;

const reflectionCode = `
// Reflection: Inspecting metadata at runtime (Very Slow!)
Type type = typeof(User);
PropertyInfo prop = type.GetProperty("Name");
prop.SetValue(userInstance, "Abhi"); // Boxing/Unboxing and security checks occur here

// Source Generators: The modern .NET replacement for Reflection.
// They run AT COMPILE TIME to emit actual C# code instead of evaluating at runtime.
// Much faster, no startup penalty, strictly typed.
`;

const delegatesCode = `
// Action: Method that returns void
Action<string> logMessage = (msg) => Console.WriteLine(msg);

// Func: Method that returns a value (last parameter is the return type)
Func<int, int, int> addNumbers = (a, b) => a + b;

// Predicate: Method that takes an object and returns a boolean
Predicate<string> isLong = s => s.Length > 10;

// Multicast Delegates & Event Memory Leaks
public class Publisher {
    public event EventHandler DataProcessed;
}

// WARNING: If Subscriber outlives Publisher, but subscribes to the event, 
// Subscriber CANNOT be garbage collected because Publisher holds a reference to it!
// ALWAYS unsubscribe (-=) in Dispose() methods!
`;

const tplCode = `
// Task Parallel Library (TPL): Running CPU-bound workloads concurrently

// BAD: Awaiting tasks one by one (Sequential)
var val1 = await FetchData1();
var val2 = await FetchData2();

// GOOD: Running them concurrently and awaiting them all together
var task1 = FetchData1();
var task2 = FetchData2();
await Task.WhenAll(task1, task2); 

// Parallel.ForEach: Maximize CPU cores for independent tasks
var numbers = Enumerable.Range(1, 1000000);
Parallel.ForEach(numbers, (num) => {
    // Thread pool automatically handles partition size
    ProcessHeavyCalculations(num); 
});
`;

const unsafeCode = `
// Unsafe Code: Bypassing C# safety nets (Must enable 'AllowUnsafeBlocks' in .csproj)
public unsafe void ManipulateMemory() {
    int number = 10;
    
    // Direct pointer to memory address
    int* ptr = &number; 
    
    *ptr = 50; // Directly changing the memory value!
    
    // stackalloc: Allocates memory directly on the stack instead of the heap.
    // Extremely fast for small buffers (No GC overhead!)
    int* stackArray = stackalloc int[100];
}
`;

const recordsCode = `
// C# 9+ Records: Immutable reference types with value-based equality.
public record Person(string Name, int Age);

// Under the hood, the compiler generates:
// 1. Properties with public 'get' and 'init' setters (cannot be changed after creation)
// 2. An overridden Equals() that compares values instead of references
// 3. A beautiful ToString() implementation automatically

var p1 = new Person("Abhi", 25);
var p2 = new Person("Abhi", 25);
Console.WriteLine(p1 == p2); // TRUE! (If this was a class, it would be FALSE)

// "With" Expression (Non-destructive mutation)
var p3 = p1 with { Age = 26 }; // Creates a new instance based on p1
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
                <p className="text-xl text-slate-400">Advanced C# and High-Performance .NET Systems. The pinnacle of language mastery.</p>
            </motion.div>

            <div className="space-y-8">
                {/* 1. Span & Memory */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-rose-500/20 p-3 rounded-xl"><Cpu className="text-rose-400" /></div>
                        <h2 className="text-2xl font-bold">1. Span&lt;T&gt; & Memory&lt;T&gt;</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        In high-performance systems, strings are the enemy of memory. Calling <code>.Substring()</code> creates new strings on the Heap, forcing Garbage Collection.
                        <code>Span&lt;T&gt;</code> is a value-type that represents a contiguous region of memory, allowing you to <strong>slice</strong> existing memory without allocating new objects.
                    </p>
                    <CodeViewer code={spanCode} title="ZeroAllocation.cs" />
                </GlassCard>

                {/* 2. ValueTask vs Task */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-yellow-500/20 p-3 rounded-xl"><Zap className="text-yellow-400" /></div>
                        <h2 className="text-2xl font-bold">2. ValueTask vs Task</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        A <code>Task</code> is a reference type (heap allocation). If an API hits a cache continuously, you generate millions of useless tasks.
                        <code>ValueTask</code> solves this by acting as a struct. If the operation completes synchronously, there is <strong>zero allocation</strong>.
                    </p>
                    <CodeViewer code={valueTaskCode} title="HighPerfAsync.cs" />
                </GlassCard>

                {/* 3. Garbage Collection */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-500/20 p-3 rounded-xl"><Recycle className="text-green-400" /></div>
                        <h2 className="text-2xl font-bold">3. Garbage Collection & LOH</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        The GC tracks objects traversing three Generations (0, 1, 2). Short-lived variables die in Gen 0. But huge arrays (&gt;85,000 bytes) skip straight to the <strong className="text-cyan-vibrant">Large Object Heap (LOH)</strong>, causing high performance costs and memory fragmentation.
                    </p>
                    <CodeViewer code={gcCode} title="GarbageCollection.cs" />
                </GlassCard>

                {/* 4. IEnumerable vs IQueryable */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl"><Database className="text-blue-400" /></div>
                        <h2 className="text-2xl font-bold">4. IEnumerable vs IQueryable</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Using <code>IEnumerable</code> against a database fetches <strong>everything</strong> into RAM before filtering. <code>IQueryable</code> builds an <strong>Expression Tree</strong>, allowing the provider (Entity Framework) to translate it directly into raw SQL.
                    </p>
                    <CodeViewer code={iqueryableCode} title="DataFetching.cs" />
                </GlassCard>

                {/* 5. Reflection vs Source Generators */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-500/20 p-3 rounded-xl"><Search className="text-purple-400" /></div>
                        <h2 className="text-2xl font-bold">5. Reflection & Source Generators</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Reflection fetches metadata at runtime, making it incredibly slow. .NET modernizes this with <strong className="text-cyan-vibrant">Source Generators</strong>, which analyze code during compilation and generate the needed C# files instantly.
                    </p>
                    <CodeViewer code={reflectionCode} title="Reflection.cs" />
                </GlassCard>

                {/* 6. Delegates and Events */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-teal-500/20 p-3 rounded-xl"><GitBranch className="text-teal-400" /></div>
                        <h2 className="text-2xl font-bold">6. Delegates, Func, Action & Leaks</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Delegates wrap method signatures. <code>Func</code> returns values; <code>Action</code> returns void. Beware of Event Memory Leaks—if you subscribe to a long-living publisher and never unsubscribe, the garbage collector will never delete your subscriber!
                    </p>
                    <CodeViewer code={delegatesCode} title="Delegates.cs" />
                </GlassCard>

                {/* 7. Task Parallel Library (TPL) */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-indigo-500/20 p-3 rounded-xl"><Activity className="text-indigo-400" /></div>
                        <h2 className="text-2xl font-bold">7. Task Parallel Library (TPL)</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        For I/O work, use async/await. But for CPU-bound computations, the TPL (using <code>Parallel.ForEach</code> or <code>Task.WhenAll</code>) is best. It leverages all your multicore processing power automatically.
                    </p>
                    <CodeViewer code={tplCode} title="Concurrency.cs" />
                </GlassCard>

                {/* 8. Modern C#: Records */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-pink-500/20 p-3 rounded-xl"><Code className="text-pink-400" /></div>
                        <h2 className="text-2xl font-bold">8. Records & Pattern Matching</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Introduced in C# 9, <code>record</code> types provide immutable classes with <strong>value-based equality</strong> instantly out of the box, perfect for DTOs and CQRS commands.
                    </p>
                    <CodeViewer code={recordsCode} title="Records.cs" />
                </GlassCard>

                {/* 9. Unsafe Code */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-500/20 p-3 rounded-xl"><ShieldAlert className="text-red-400" /></div>
                        <h2 className="text-2xl font-bold">9. Unsafe Code & stackalloc</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Unsafe code bypasses the Garbage Collector completely. You can use direct memory addresses and pointers (<code>*</code>, <code>&</code>). Use <code>stackalloc</code> for allocating fast, local arrays directly on the CPU stack.
                    </p>
                    <CodeViewer code={unsafeCode} title="MemoryPointers.cs" />
                </GlassCard>

            </div>

            <Quiz
                title="Deep Space Mastery Exam"
                questions={[
                    {
                        question: "Why is IEnumerable highly dangerous when querying an Entity Framework DbContext?",
                        options: [
                            "It converts the database to NoSQL format automatically",
                            "It downloads the entire SQL table into system RAM before evaluating your .Where() filters",
                            "It modifies your application's connection string",
                            "It throws an exception if the table is larger than 85,000 bytes"
                        ],
                        correctAnswer: 1,
                        explanation: "IEnumerable uses deferred execution but it evaluates IN MEMORY. IQueryable is necessary because it sends the Expression Tree to the database, so the database server does the filtering."
                    },
                    {
                        question: "If an array exceeds 85,000 bytes, what happens to it?",
                        options: [
                            "It is split into multiple Gen 0 objects automatically",
                            "It is written to the physical Hard Drive (Page File)",
                            "It goes straight to the Large Object Heap (LOH) ignoring Gen 0/1",
                            "A StackOverflowException is thrown"
                        ],
                        correctAnswer: 2,
                        explanation: "The CLR optimizes large allocations by skipping standard GC generations and putting them directly in the LOH. Because the LOH is rarely compacted, doing this often causes severe fragmentation."
                    },
                    {
                        question: "What is the key functional difference between a C# `class` and a C# `record`?",
                        options: [
                            "A record can be multiple inherited",
                            "A record provides Value-Based Equality out of the box instead of Reference Equality",
                            "A record cannot have methods",
                            "A record compiles to JavaScript automatically"
                        ],
                        correctAnswer: 1,
                        explanation: "If you instantiate two distinct Classes with the same exact values, 'class1 == class2' returns False. If you do this with Records, it returns True because it evaluates all the properties automatically."
                    },
                    {
                        question: "How does a typical Event-based Memory Leak occur in C#?",
                        options: [
                            "Instantiating too many classes on a single thread",
                            "Using the 'unsafe' keyword incorrectly",
                            "A long-lived Publisher event holding a reference to a short-lived Subscriber that forgot to unsubscribe",
                            "Using an IQueryable with too many inner joins"
                        ],
                        correctAnswer: 2,
                        explanation: "The Garbage Collector cannot delete an object if a 'root' object holds an active reference to it. Event subscriptions create strong references, keeping subscribers alive indefinitely."
                    }
                ]}
            />
        </div>
    );
};
