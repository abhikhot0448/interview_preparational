import React from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket, Orbit, Sparkles, TerminalSquare, Database } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { path: '/', label: 'Launchpad', icon: Rocket, description: 'Basic Concepts' },
    { path: '/orbit', label: 'Orbit', icon: Orbit, description: 'Mediator Pattern' },
    { path: '/deep-space', label: 'Deep Space', icon: Sparkles, description: 'Advanced Concepts' },
    { path: '/data-core', label: 'Data Core', icon: Database, description: 'The 400+ Question Archive' },
];

export const Sidebar: React.FC = () => {
    return (
        <aside className="fixed inset-y-0 left-0 w-72 glass-panel border-r border-white/10 flex flex-col z-50">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="bg-cyan-vibrant/20 p-2 rounded-xl">
                    <TerminalSquare className="w-8 h-8 text-cyan-vibrant" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-vibrant tracking-wider">
                        ANTIGRAVITY
                    </h1>
                    <p className="text-xs text-cyan-vibrant/80 uppercase tracking-[0.2em] font-medium">Code</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex flex-col p-4 rounded-xl transition-all duration-300 relative group",
                            isActive
                                ? "bg-cyan-vibrant/10 border border-cyan-vibrant/30"
                                : "border border-transparent hover:bg-white/5 hover:border-white/10"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-cyan-vibrant/5 rounded-xl border border-cyan-vibrant/20"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <div className="relative z-10 flex items-center gap-3">
                                    <item.icon className={cn(
                                        "w-6 h-6 transition-colors",
                                        isActive ? "text-cyan-vibrant" : "text-slate-400 group-hover:text-cyan-vibrant/70"
                                    )} />
                                    <div className="flex flex-col text-left">
                                        <span className={cn(
                                            "font-bold transition-colors",
                                            isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                                        )}>
                                            {item.label}
                                        </span>
                                        <span className="text-xs text-slate-500 mt-0.5 font-medium">
                                            {item.description}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-white/10 text-xs text-slate-500 text-center font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                Systems Online
            </div>
        </aside>
    );
};
