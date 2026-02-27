import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Launchpad } from './pages/Launchpad';
import { Orbit } from './pages/Orbit';
import { DeepSpace } from './pages/DeepSpace';
import { DataCore } from './pages/DataCore';
import { AnimatePresence } from 'framer-motion';

function App() {
    return (
        <Router>
            <div className="flex min-h-screen bg-space-900 overflow-hidden relative">
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 ml-72 overflow-y-auto min-h-screen relative">
                    {/* Animated Background Orbs */}
                    <div className="fixed top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-cyan-vibrant/5 blur-[120px] pointer-events-none" />
                    <div className="fixed bottom-[-10%] left-[20%] w-[30rem] h-[30rem] rounded-full bg-purple-600/5 blur-[100px] pointer-events-none" />

                    <div className="p-12 relative z-10">
                        <AnimatePresence mode="wait">
                            <Routes>
                                <Route path="/" element={<Launchpad />} />
                                <Route path="/orbit" element={<Orbit />} />
                                <Route path="/deep-space" element={<DeepSpace />} />
                                <Route path="/data-core" element={<DataCore />} />
                            </Routes>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </Router>
    );
}

export default App;
