import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { CodeViewer } from '../components/CodeViewer';
import { Quiz } from '../components/Quiz';
import { motion } from 'framer-motion';
import {
    ShieldCheck, Key, Lock, Fingerprint,
    FileBadge, GlobeLock
} from 'lucide-react';

const authnVsAuthzCode = `
// Authentication (AuthN): "Who are you?"
// Typically handled by logging in (Username/Password, Social Login, MFA)
// Result: A token (JWT) or session cookie proving identity.

// Authorization (AuthZ): "What are you allowed to do?"
// Typically handled by checking Roles or Claims on the validated token.

[Authorize] // Requires AUTHENTICATION (Must be logged in)
public class SecureController : ControllerBase {
    
    [HttpGet("user-profile")]
    public IActionResult GetProfile() { ... }

    [Authorize(Roles = "Admin")] // Requires AUTHORIZATION (Must have Admin role)
    [HttpDelete("delete-system")]
    public IActionResult DeleteSystem() { ... }
}
`;

const jwtCode = `
// JSON Web Token (JWT) Anatomy
// 1. Header (Algorithm & Token Type)
// 2. Payload (Claims: User ID, Email, Role, Expiration time)
// 3. Signature (Used to verify the token hasn't been tampered with)

// Validating a JWT in ASP.NET Core Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true, // Checks if token is expired
            ValidateIssuerSigningKey = true, // Cryptographic verification
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };
    });
`;

const claimsPoliciesCode = `
// Claims-Based Authorization
// A "Claim" is a piece of information about the user (e.g., "Age: 21", "Department: HR")

// Policy-Based Authorization (The Modern Way)
// Policies group multiple claims and complex logic into a single authorized requirement.

// In Program.cs:
builder.Services.AddAuthorization(options => {
    // Creating a custom policy
    options.AddPolicy("AtLeast21", policy => 
        policy.RequireClaim("Age", "21", "22", "23") // Simplified age check
              .RequireRole("Employee")
    );
});

// In Controller:
[Authorize(Policy = "AtLeast21")]
[HttpGet("restricted-data")]
public IActionResult GetRestricted() {
    return Ok("You passed the policy check!");
}
`;

const oauthCode = `
// OAuth 2.0 & OpenID Connect (OIDC)
// OAuth 2.0 is an AUTHORIZATION framework.
// OIDC sits on top of OAuth 2.0 to provide AUTHENTICATION.

// Standard Flow (Authorization Code Flow with PKCE - for SPAs/Mobiles):
// 1. User clicks "Login with Google".
// 2. React app redirects user to Google's Authorization Server.
// 3. User authenticates on Google.
// 4. Google redirects back to React with a short-lived "Authorization Code".
// 5. React sends the code to your backend API.
// 6. Backend API securely exchanges the code with Google for an Access Token (and ID Token via OIDC).
// 7. Backend creates its own JWT and sends it back to React.
`;

const hashCode = `
// Hashing Passwords (NEVER store plaintext!)
// You should use slow, iterative hashing algorithms with a unique Salt.
// Examples: BCrypt, Argon2, PBKDF2.

// DO NOT USE MD5 or SHA256 for passwords. They are too fast and easily cracked via Rainbow Tables!

// ASP.NET Core Identity automatically handles secure hashing with PBKDF2 (PasswordHasher<TUser>).
var hasher = new PasswordHasher<User>();

// Hashing the password during registration
user.PasswordHash = hasher.HashPassword(user, "MySuperSecretPassword123!");

// Verifying during login
var result = hasher.VerifyHashedPassword(user, user.PasswordHash, "MySuperSecretPassword123!");
if (result == PasswordVerificationResult.Success) {
    // Login valid
}
`;

export const Vault: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-vibrant flex items-center gap-4">
                    <ShieldCheck className="w-12 h-12 text-cyan-vibrant" />
                    The Vault
                </h1>
                <p className="text-xl text-slate-400">Security, Authentication, and Identity in modern .NET Architecture.</p>
            </motion.div>

            <div className="space-y-8">
                {/* 1. AuthN vs AuthZ */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-500/20 p-3 rounded-xl"><Fingerprint className="text-red-400" /></div>
                        <h2 className="text-2xl font-bold">1. Authentication vs Authorization</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        The most fundamental interview question. <strong>Authentication (AuthN)</strong> verifies <em>who</em> you are (e.g., verifying a password). <strong>Authorization (AuthZ)</strong> verifies <em>what</em> you are allowed to do (e.g., checking if you have the Admin role).
                    </p>
                    <CodeViewer code={authnVsAuthzCode} title="AuthOverview.cs" />
                </GlassCard>

                {/* 2. JWT */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-emerald-500/20 p-3 rounded-xl"><Key className="text-emerald-400" /></div>
                        <h2 className="text-2xl font-bold">2. JSON Web Tokens (JWT)</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        A JWT is a stateless, signed token exchanged between the client and server. The server verifies its authenticity using a secret cryptographic key, ensuring the payload hasn't been altered.
                    </p>
                    <CodeViewer code={jwtCode} title="TokenValidation.cs" />
                </GlassCard>

                {/* 3. Claims & Policies */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl"><FileBadge className="text-blue-400" /></div>
                        <h2 className="text-2xl font-bold">3. Claims & Policy-Based Authorization</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Role-based security (e.g., "Admin", "User") is often too rigid. <strong className="text-cyan-vibrant">Claims</strong> provide rich, nuanced user data (e.g., "Department: HR", "Clearance: TopSecret"). <strong className="text-cyan-vibrant">Policies</strong> combine multiple claims into complex logical rules.
                    </p>
                    <CodeViewer code={claimsPoliciesCode} title="Policies.cs" />
                </GlassCard>

                {/* 4. OAuth & OIDC */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-500/20 p-3 rounded-xl"><GlobeLock className="text-purple-400" /></div>
                        <h2 className="text-2xl font-bold">4. OAuth 2.0 & OpenID Connect</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        OAuth 2.0 provides delegated authorization so apps can access resources on a user's behalf without seeing their password. OpenID Connect adds an "ID Token" layer on top of OAuth to standardize authentication.
                    </p>
                    <CodeViewer code={oauthCode} title="OAuthFlows.txt" />
                </GlassCard>

                {/* 5. Password Hashing */}
                <GlassCard hoverEffect>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-yellow-500/20 p-3 rounded-xl"><Lock className="text-yellow-400" /></div>
                        <h2 className="text-2xl font-bold">5. Password Hashing</h2>
                    </div>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        Never store passwords in plain text! You must use a one-way iterative hashing algorithm with a random <strong className="text-cyan-vibrant">Salt</strong> to defeat Rainbow Tables. ASP.NET Core Identity handles this perfectly using PBKDF2 out of the box.
                    </p>
                    <CodeViewer code={hashCode} title="Security.cs" />
                </GlassCard>

            </div>

            <Quiz
                title="Vault Security Clearance"
                questions={[
                    {
                        question: "What is the key difference between Authentication and Authorization?",
                        options: [
                            "Authentication checks privileges, Authorization checks identity",
                            "Authentication proves who you are, Authorization verifies what you are allowed to do",
                            "They are exactly the same concept in ASP.NET",
                            "Authentication is for APIs, Authorization is for Web UIs"
                        ],
                        correctAnswer: 1,
                        explanation: "AuthN = Identity verification (login). AuthZ = Permission verification (roles/claims)."
                    },
                    {
                        question: "Why should you NOT use MD5 or standard SHA-256 for hashing passwords?",
                        options: [
                            "Because they produce strings that are too long for databases",
                            "Because they aren't supported on Linux",
                            "Because they are designed to be extremely fast, making them vulnerable to brute-force and rainbow table attacks",
                            "Because they cannot use salts"
                        ],
                        correctAnswer: 2,
                        explanation: "Password hashing must be SLOW (iterative) to prevent an attacker from trying billions of combinations per second. Algorithms like BCrypt, Argon2, or PBKDF2 are designed specifically to be computationally expensive."
                    },
                    {
                        question: "In a JWT, how does the server know the payload hasn't been altered by a malicious client?",
                        options: [
                            "The payload is encrypted with AES-256",
                            "The client sends a secondary password with the request",
                            "The server uses its secure, private 'IssuerSigningKey' to recalculate the Signature portion of the token and checks if it matches",
                            "The server asks the database if the claims are correct"
                        ],
                        correctAnswer: 2,
                        explanation: "JWT payloads are usually Base64 encoded, meaning they are easily readable (NOT encrypted). However, if an attacker changes a claim (e.g., from User to Admin), the Signature recalculation will fail because the attacker doesn't possess the server's private key."
                    },
                    {
                        question: "What does OAuth 2.0 fundamentally provide?",
                        options: [
                            "A secure hashing algorithm for SQL databases",
                            "Deligated Authorization (e.g., allowing an app to access your Google Calendar without giving the app your Google password)",
                            "A framework for Dependency Injection",
                            "Authentication (Verifying user identity)"
                        ],
                        correctAnswer: 1,
                        explanation: "OAuth 2.0 is specifically an Authorization framework. OpenID Connect (OIDC) was built on top of it to standardize Authentication."
                    }
                ]}
            />
        </div>
    );
};
