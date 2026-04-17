import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, ChevronDown } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),transparent_20%),#020617] flex items-center justify-center px-4 py-10 text-slate-100">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),transparent_18%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <aside className="flex flex-col justify-center px-10 py-12 sm:px-12 lg:px-16">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 shadow-sm shadow-cyan-400/10">
              <Shield className="w-4 h-4" /> Secure civic access
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white">Welcome to Civic IRS</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Sign in to manage complaints, review civic requests, and monitor live analytics for Nagpur Municipal Corporation.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Fast access</p>
                <p className="mt-3 text-sm text-slate-300">Choose your role and get instant access to the right workspace.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/10">
                <p className="text-xs uppercase tracking-[0.28em] text-violet-300">Live insights</p>
                <p className="mt-3 text-sm text-slate-300">View map-based issue tracking, priority alerts, and status reports after signing in.</p>
              </div>
            </div>
          </aside>

          <section className="rounded-[1.75rem] bg-slate-900/95 p-8 sm:p-10 shadow-2xl shadow-slate-950/30">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Sign in</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Access your dashboard</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200">
                NMC Portal
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Email</label>
                <div className="relative mt-2">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-12 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950/20 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Password</label>
                <div className="relative mt-2">
                  <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-12 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950/20 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Role</label>
                <div className="relative mt-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  >
                    <option value="citizen">Citizen</option>
                    <option value="admin">NMC Admin</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-white hover:text-cyan-300">
                Create one
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
