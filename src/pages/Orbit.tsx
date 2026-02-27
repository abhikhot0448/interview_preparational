import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { CodeViewer } from '../components/CodeViewer';
import { Quiz } from '../components/Quiz';
import { motion } from 'framer-motion';
import { RadioTower, GitMerge } from 'lucide-react';

const mediatorCode = `
using MediatR;

// 1. The Request (Command)
// Represents a request to land an airplane, returning a boolean (Success/Fail)
public class RequestLandingCommand : IRequest<bool> {
    public string FlightNumber { get; set; }
    public int Altitude { get; set; }
}

// 2. The Handler (Flight Control Tower)
// Handles the specific command. The controller doesn't know this exists.
public class RequestLandingHandler : IRequestHandler<RequestLandingCommand, bool> {
    private readonly IRunwayService _runwayService;

    public RequestLandingHandler(IRunwayService runwayService) {
        _runwayService = runwayService;
    }

    public async Task<bool> Handle(RequestLandingCommand request, CancellationToken cancellationToken) {
        if (request.Altitude > 10000) return false;
        
        return await _runwayService.ReserveRunwayAsync(request.FlightNumber);
    }
}

// 3. The Controller (Airplane)
// Only injects IMediator. Clean and completely decoupled!
[ApiController]
[Route("api/[controller]")]
public class FlightController : ControllerBase {
    private readonly IMediator _mediator;

    public FlightController(IMediator mediator) {
        _mediator = mediator;
    }

    [HttpPost("land")]
    public async Task<IActionResult> RequestLanding([FromBody] RequestLandingCommand command) {
        var success = await _mediator.Send(command);
        return success ? Ok("Clear to land") : BadRequest("Cannot land now");
    }
}
`;

export const Orbit: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-vibrant">
                    Orbit
                </h1>
                <p className="text-xl text-slate-400">Design Patterns: The Architecture of Microservices.</p>
            </motion.div>

            <div className="space-y-8">
                <GlassCard>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-emerald-500/20 p-3 rounded-xl"><RadioTower className="text-emerald-400" /></div>
                        <h2 className="text-2xl font-bold">The Mediator Pattern</h2>
                    </div>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        In complex microservices, direct communication between components creates tight coupling.
                        The Mediator pattern acts as a "Flight Control Tower". Instead of airplanes (Controllers/Services) talking directly to each other, they all talk to the Tower (Mediator).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="p-4 border border-red-500/30 bg-red-500/5 rounded-xl">
                            <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                                <GitMerge className="w-4 h-4" /> Without Mediator
                            </h3>
                            <p className="text-sm text-slate-400">Controllers inject 5-10 different services resulting in constructor over-injection and tangled dependencies mapping.</p>
                        </div>
                        <div className="p-4 border border-green-500/30 bg-green-500/5 rounded-xl">
                            <h3 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                                <RadioTower className="w-4 h-4" /> With Mediator
                            </h3>
                            <p className="text-sm text-slate-400">Controllers inject ONLY <code className="text-cyan-vibrant bg-cyan-vibrant/10 px-1 rounded">IMediator</code>. They send a command, and MediatR routes it to the specific handler.</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard hoverEffect>
                    <h2 className="text-2xl font-bold mb-4">Implementation with MediatR</h2>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Let's implement the Flight Control scenario using the standard C# <code>MediatR</code> library.
                        Notice how the <code>FlightController</code> has absolutely zero knowledge of how <code>IRunwayService</code> works or that it even exists.
                    </p>
                    <CodeViewer code={mediatorCode} title="FlightControl.cs" />
                </GlassCard>
            </div>

            <Quiz
                title="Orbit Certification"
                questions={[
                    {
                        question: "What is the main problem the Mediator pattern solves in a web API?",
                        options: [
                            "It makes the application run faster natively",
                            "It automatically maps database tables to classes",
                            "It resolves constructor over-injection and tight coupling by decoupling the sender and receiver",
                            "It allows C# to interpret json dynamically"
                        ],
                        correctAnswer: 2,
                        explanation: "By having controllers only inject IMediator, they don't need to know about the intricate web of business logic services, resulting in loose coupling."
                    },
                    {
                        question: "In the MediatR library, what interface defines the object that executes the business logic?",
                        options: [
                            "IRequest<T>",
                            "IRequestHandler<TRequest, TResponse>",
                            "IMediatorCommand",
                            "IServiceProvider"
                        ],
                        correctAnswer: 1,
                        explanation: "IRequestHandler handles the logic. IRequest is merely the data model (the command/query payload) being sent."
                    }
                ]}
            />
        </div>
    );
};
