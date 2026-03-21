import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { CodeViewer } from '../components/CodeViewer';
import { Quiz } from '../components/Quiz';
import { motion } from 'framer-motion';
import {
    RadioTower, GitMerge, Settings, BoxSelect,
    Layers, Cpu, ShieldAlert, Terminal, Activity
} from 'lucide-react';

const mediatorCode = `
using MediatR;

// 1. The Request (Command)
public class RequestLandingCommand : IRequest<bool> {
    public string FlightNumber { get; set; }
}

// 2. The Handler (Flight Control Tower)
public class RequestLandingHandler : IRequestHandler<RequestLandingCommand, bool> {
    private readonly IRunwayService _runwayService;

    public RequestLandingHandler(IRunwayService runwayService) {
        _runwayService = runwayService;
    }

    public async Task<bool> Handle(RequestLandingCommand request, CancellationToken cancellationToken) {
        return await _runwayService.ReserveRunwayAsync(request.FlightNumber);
    }
}

// 3. The Controller (Airplane)
[ApiController]
[Route("api/[controller]")]
public class FlightController : ControllerBase {
    private readonly IMediator _mediator;

    public FlightController(IMediator mediator) => _mediator = mediator;

    [HttpPost("land")]
    public async Task<IActionResult> RequestLanding([FromBody] RequestLandingCommand command) {
        var success = await _mediator.Send(command);
        return success ? Ok("Clear to land") : BadRequest("Cannot land now");
    }
}
`;

const cqrsCode = `
// CQRS: Separate Read and Write Models
// COMMAND: Mutates State (Write)
public class CreateUserCommand : IRequest<Guid> {
    public string Name { get; set; }
    public string Email { get; set; }
}

public class CreateUserHandler : IRequestHandler<CreateUserCommand, Guid> {
    private readonly ApplicationDbContext _db;
    public CreateUserHandler(ApplicationDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateUserCommand request, CancellationToken token) {
        var user = new User { Id = Guid.NewGuid(), Name = request.Name, Email = request.Email };
        _db.Users.Add(user);
        await _db.SaveChangesAsync(token);
        return user.Id;
    }
}

// QUERY: Retrieve State (Read) - Can use Dapper for max performance
public class GetUserQuery : IRequest<UserDto> {
    public Guid UserId { get; set; }
}

public class GetUserHandler : IRequestHandler<GetUserQuery, UserDto> {
    private readonly IDbConnection _dbConnection;
    public GetUserHandler(IDbConnection dbConnection) => _dbConnection = dbConnection;

    public async Task<UserDto> Handle(GetUserQuery request, CancellationToken token) {
        // Fast, readonly query bypassing Entity Framework tracking
        var sql = "SELECT Id, Name, Email FROM Users WHERE Id = @UserId";
        return await _dbConnection.QuerySingleOrDefaultAsync<UserDto>(sql, new { request.UserId });
    }
}
`;

const pipelineCode = `
// MediatR Pipeline Behavior (Like an interceptor/middleware for all requests)
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> 
    where TRequest : IRequest<TResponse> 
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;
    private readonly Stopwatch _timer;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger) {
        _logger = logger;
        _timer = new Stopwatch();
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken) {
        _logger.LogInformation($"Handling {typeof(TRequest).Name}");
        
        _timer.Start();
        // The next() delegate executes the actual Handler (or next behavior)
        var response = await next(); 
        _timer.Stop();
        
        if (_timer.ElapsedMilliseconds > 500) {
            _logger.LogWarning($"Long running request: {typeof(TRequest).Name} ({_timer.ElapsedMilliseconds}ms)");
        }

        return response;
    }
}
`;

const diCode = `
// Dependency Injection Lifetimes in ASP.NET Core
public void ConfigureServices(IServiceCollection services) {
    
    // 1. Transient: Created EVERY TIME they are requested.
    // Use for lightweight, stateless services.
    services.AddTransient<IEmailSender, EmailSender>();
    
    // 2. Scoped: Created ONCE PER HTTP REQUEST.
    // Standard for Entity Framework DbContexts.
    services.AddScoped<IOrderRepository, OrderRepository>();
    
    // 3. Singleton: Created ONE TIME and lives forever (until app restarts).
    // Shared across all requests. Use for Caches, Configs, memory-heavy allocations.
    services.AddSingleton<IMemoryCache, MemoryCache>();
}

// DANGER ZONE: Captive Dependencies
// If a Singleton injects a Scoped service, the Scoped service implicitly becomes a Singleton!
// ASP.NET Core tries to detect this at startup and throw an exception.
`;

const backgroundCode = `
// Hosted Services / Background Workers
public class EmailQueueProcessor : BackgroundService {
    private readonly IServiceProvider _serviceProvider;

    public EmailQueueProcessor(IServiceProvider serviceProvider) {
        _serviceProvider = serviceProvider; // Inject Provider, not Scoped services directly!
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken) {
        while (!stoppingToken.IsCancellationRequested) {
            
            // To use Scoped services in a Singleton/Background task, create a scope:
            using (var scope = _serviceProvider.CreateScope()) {
                var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                await emailService.ProcessQueueAsync(stoppingToken);
            }

            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }
}
`;

const middlewareCode = `
// ASP.NET Core Request Pipeline Middleware
public class ExceptionHandlingMiddleware {
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger) {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context) {
        try {
            // Pass the request to the next middleware down the pipeline
            await _next(context); 
        }
        catch (Exception ex) {
            _logger.LogError(ex, "An unhandled exception occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception) {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        return context.Response.WriteAsync(new { Error = "A problem occurred while processing your request." }.ToString());
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
                <p className="text-xl text-slate-400">Deep System Architecture & Advanced C# Patterns. The engine room of Enterprise Microservices.</p>
            </motion.div>

            <div className="space-y-8">
                {/* 1. Mediator */}
                <GlassCard>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-emerald-500/20 p-3 rounded-xl"><RadioTower className="text-emerald-400" /></div>
                        <h2 className="text-2xl font-bold">1. The Mediator Pattern</h2>
                    </div>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        In robust microservices, direct communication between components creates tight coupling. The Mediator pattern acts as a "Flight Control Tower". Instead of Controllers injecting services directly, they dispatch a Request to the Mediator, which finds the responsible Handler.
                    </p>
                    <CodeViewer code={mediatorCode} title="Mediator.cs" />
                </GlassCard>

                {/* 2. CQRS */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-500/20 p-3 rounded-xl"><GitMerge className="text-purple-400" /></div>
                        <h2 className="text-2xl font-bold">2. CQRS (Command Query Responsibility Segregation)</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        CQRS splits your application logic into two distinct pathways: <strong className="text-cyan-vibrant font-medium mx-1">Commands</strong> (writes, updates, deletes) which mutate state usually via an ORM like Entity Framework, and <strong className="text-cyan-vibrant font-medium mx-1">Queries</strong> (reads) which retrieve state directly bypassing heavy ORM tracking (often using pure SQL/Dapper to maximize speed).
                    </p>
                    <CodeViewer code={cqrsCode} title="CQRS.cs" />
                </GlassCard>

                {/* 3. Pipeline Behaviors */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl"><Layers className="text-blue-400" /></div>
                        <h2 className="text-2xl font-bold">3. MediatR Pipeline Behaviors</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Pipeline Behaviors are middlewares that wrap your command handlers. This allows you to implement Cross-Cutting Concerns (Logging, Validation, Caching, Authorization) centrally, instead of polluting your handlers.
                    </p>
                    <CodeViewer code={pipelineCode} title="LoggingBehavior.cs" />
                </GlassCard>

                {/* 4. Dependency Injection */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-yellow-500/20 p-3 rounded-xl"><BoxSelect className="text-yellow-400" /></div>
                        <h2 className="text-2xl font-bold">4. Dependency Injection (DI) Lifetimes</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        The .NET Core DI container manages when instances are created and destroyed. Mixing lifetimes incorrectly leads to memory leaks and "Captive Dependencies".
                    </p>
                    <CodeViewer code={diCode} title="DependencyInjection.cs" />
                </GlassCard>

                {/* 5. Background Tasks */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-500/20 p-3 rounded-xl"><Activity className="text-red-400" /></div>
                        <h2 className="text-2xl font-bold">5. Background Tasks (IHostedService)</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        <code>BackgroundService</code> provides a generic implementation for long-running I/O operations (like reading from a RabbitMQ queue) that run independently of HTTP requests inside the app domain.
                    </p>
                    <CodeViewer code={backgroundCode} title="EmailQueueProcessor.cs" />
                </GlassCard>

                {/* 6. ASP.NET Middleware */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-orange-500/20 p-3 rounded-xl"><Terminal className="text-orange-400" /></div>
                        <h2 className="text-2xl font-bold">6. Custom Middleware Pipeline</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        ASP.NET Core uses a request pipeline composed of Middleware. Requests flow IN, and responses flow OUT. The execution order is strictly deterministic. Global Exception handlers are typically the first middleware registered so they catch everything trailing them.
                    </p>
                    <CodeViewer code={middlewareCode} title="ExceptionMiddleware.cs" />
                </GlassCard>
            </div>

            <Quiz
                title="Orbit Deep Architecture Certification"
                questions={[
                    {
                        question: "What is a 'Captive Dependency' in .NET Core DI?",
                        options: [
                            "A transient service that caches data",
                            "A service that fails to inject causing a runtime crash",
                            "When a Singleton injects a Scoped or Transient service, effectively making them singletons and keeping them alive forever",
                            "When a transient service is injected too many times"
                        ],
                        correctAnswer: 2,
                        explanation: "A Singleton lives for the entire app lifetime. If it holds a reference to a Scoped service (like a DbContext), the Scoped service cannot be garbage collected, breaking its intended lifestyle and causing concurrency bugs."
                    },
                    {
                        question: "In CQRS, why are write models and read models often separated?",
                        options: [
                            "Because C# requires two different data contexts",
                            "To scale them independently and optimize writes with ORMs (Entity Framework) and reads with pure SQL (Dapper)",
                            "To avoid using interfaces",
                            "Because MediatR forces you to"
                        ],
                        correctAnswer: 1,
                        explanation: "CQRS allows massive read optimization (using direct SQL, Views, or Dapper) while retaining the safety of an ORM (Entity Framework) for validating business logic during writes."
                    },
                    {
                        question: "How do you correctly use a Scoped service (like DbContext) inside a long-running BackgroundService (Singleton)?",
                        options: [
                            "Inject the DbContext directly into the constructor",
                            "Change the BackgroundService to Scoped",
                            "Make the DbContext Singleton",
                            "Inject IServiceProvider, call .CreateScope() inside the Execute execution loop, and resolve the DbContext from the scope"
                        ],
                        correctAnswer: 3,
                        explanation: "Since IHostedServices are Singletons, injecting a Scoped service creates a captive dependency. You must manually generate a Scope during execution, resolve the service, use it, and let the using statement dispose it."
                    },
                    {
                        question: "Which pattern correctly describes adding a Cross-Cutting concern (like Validation) across all MediatR requests without repeating code?",
                        options: [
                            "Dependency Injection",
                            "CQRS",
                            "Pipeline Behaviors (IPipelineBehavior)",
                            "Action Filters"
                        ],
                        correctAnswer: 2,
                        explanation: "MediatR provides IPipelineBehavior for exactly this. It wraps the execution of Handlers natively, similar to how Middleware wraps controllers."
                    }
                ]}
            />
        </div>
    );
};
