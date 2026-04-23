import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 text-foreground relative">
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </button>
      </div>
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card/90 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.06),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.06),transparent_18%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),transparent_18%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <aside className="flex flex-col justify-center px-10 py-12 sm:px-12 lg:px-16">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-200 dark:border-cyan-400/20 bg-cyan-50 dark:bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-200 shadow-sm shadow-cyan-400/10">
              <Shield className="w-4 h-4" /> Secure civic access
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground">Welcome to Civic IRS</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Sign in to manage complaints, review civic requests, and monitor live analytics for Nagpur Municipal Corporation.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-muted/80 p-5 shadow-lg">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-300">Fast access</p>
                <p className="mt-3 text-sm text-muted-foreground">Choose your role and get instant access to the right workspace.</p>
              </div>
              <div className="rounded-3xl border border-border bg-muted/80 p-5 shadow-lg">
                <p className="text-xs uppercase tracking-[0.28em] text-violet-600 dark:text-violet-300">Live insights</p>
                <p className="mt-3 text-sm text-muted-foreground">View map-based issue tracking, priority alerts, and status reports after signing in.</p>
              </div>
            </div>
          </aside>

          <section className="rounded-[1.75rem] bg-card p-8 sm:p-10 shadow-2xl">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Sign in</p>
                <h2 className="mt-3 text-3xl font-semibold text-foreground">Access your dashboard</h2>
              </div>
              <div className="rounded-full border border-border bg-muted px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                NMC Portal
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Email</label>
                <div className="relative mt-2">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-3xl border border-input bg-background px-12 py-3 text-sm text-foreground shadow-inner outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Password</label>
                <div className="relative mt-2">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-3xl border border-input bg-background px-12 py-3 text-sm text-foreground shadow-inner outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Role</label>
                <div className="relative mt-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="citizen">Citizen</option>
                    <option value="admin">NMC Admin</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:scale-[1.01]"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-foreground hover:text-primary">
                Create one
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
