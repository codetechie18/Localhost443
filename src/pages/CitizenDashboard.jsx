import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import KPIBox from '../components/civic/KPIBox';
import { TrendChart } from '../components/civic/ChartPanel';
import { useApp } from '../context/AppContext';
import { dailyData } from '../components/data/complaints';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, Loader, CheckCircle, PlusCircle, MapPin } from 'lucide-react';

export default function CitizenDashboard() {
  const { getStats } = useApp();
  const stats = getStats();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Citizen Dashboard" />
        <main className="p-6 space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_24px_80px_rgba(0,0,0,0.14)] animate-fade-in">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Citizen Workspace</p>
                <h1 className="mt-3 text-3xl font-semibold text-foreground">Track your civic requests with confidence</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Stay updated on every complaint status, submit new reports quickly, and monitor progress across the city.
                </p>
              </div>
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Total</p>
                  <p className="mt-3 text-2xl font-semibold text-foreground">{stats.total}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Pending</p>
                  <p className="mt-3 text-2xl font-semibold text-pending">{stats.pending}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">In Progress</p>
                  <p className="mt-3 text-2xl font-semibold text-in-progress">{stats.inProgress}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Resolved</p>
                  <p className="mt-3 text-2xl font-semibold text-resolved">{stats.resolved}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPIBox title="Total Complaints" value={stats.total} icon={FileText} variant="total" trend={12} />
            <KPIBox title="Pending" value={stats.pending} icon={Clock} variant="pending" trend={-5} />
            <KPIBox title="In Progress" value={stats.inProgress} icon={Loader} variant="in-progress" />
            <KPIBox title="Resolved" value={stats.resolved} icon={CheckCircle} variant="resolved" trend={18} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TrendChart data={dailyData} />
            </div>
            <div className="bg-card rounded-lg card-shadow p-5 space-y-4 animate-fade-in">
              <h3 className="font-semibold text-sm text-foreground">Quick Actions</h3>
              <button
                onClick={() => navigate('/report')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-border hover:card-shadow-hover transition-all hover:border-primary/30"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <PlusCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Report Issue</p>
                  <p className="text-xs text-muted-foreground">Submit a new civic complaint</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/map')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border border-border hover:card-shadow-hover transition-all hover:border-secondary/30"
              >
                <div className="w-12 h-12 rounded-2xl bg-resolved/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-resolved" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">View Map</p>
                  <p className="text-xs text-muted-foreground">See all issues on the map</p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
