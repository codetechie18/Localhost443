import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import KPIBox from '../components/civic/KPIBox';
import { TrendChart } from '../components/civic/ChartPanel';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  FileText,
  Loader,
  MapPin,
  PlusCircle,
} from 'lucide-react';

const formatDateKey = (value) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatShortDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const getTrend = (current, previous) => {
  if (current === 0 && previous === 0) return undefined;
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
};

export default function CitizenDashboard() {
  const { complaints } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const citizenComplaints = complaints.filter((complaint) => complaint.userId === user?.id);
  const sortedComplaints = [...citizenComplaints].sort(
    (left, right) => new Date(right.date) - new Date(left.date)
  );

  const stats = {
    total: citizenComplaints.length,
    pending: citizenComplaints.filter((complaint) => complaint.status === 'Pending').length,
    inProgress: citizenComplaints.filter((complaint) => complaint.status === 'In Progress').length,
    resolved: citizenComplaints.filter((complaint) => complaint.status === 'Resolved').length,
  };

  const topCategory = citizenComplaints.reduce(
    (currentTop, complaint) => {
      const nextCount = currentTop.counts[complaint.category]
        ? currentTop.counts[complaint.category] + 1
        : 1;
      const counts = {
        ...currentTop.counts,
        [complaint.category]: nextCount,
      };

      if (nextCount > currentTop.value) {
        return {
          name: complaint.category,
          value: nextCount,
          counts,
        };
      }

      return {
        ...currentTop,
        counts,
      };
    },
    { name: 'None yet', value: 0, counts: {} }
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countByDateWindow = (startOffset, endOffset, matcher = () => true) => {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - startOffset);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() - endOffset);

    return citizenComplaints.filter((complaint) => {
      const complaintDate = new Date(complaint.date);
      complaintDate.setHours(0, 0, 0, 0);

      return complaintDate >= startDate && complaintDate <= endDate && matcher(complaint);
    }).length;
  };

  const totalTrend = getTrend(countByDateWindow(6, 0), countByDateWindow(13, 7));
  const pendingTrend = getTrend(
    countByDateWindow(6, 0, (complaint) => complaint.status === 'Pending'),
    countByDateWindow(13, 7, (complaint) => complaint.status === 'Pending')
  );
  const resolvedTrend = getTrend(
    countByDateWindow(6, 0, (complaint) => complaint.status === 'Resolved'),
    countByDateWindow(13, 7, (complaint) => complaint.status === 'Resolved')
  );

  const chartData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const dateKey = formatDateKey(date);
    const complaintsForDay = citizenComplaints.filter((complaint) => complaint.date === dateKey);

    return {
      day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
      complaints: complaintsForDay.length,
      resolved: complaintsForDay.filter((complaint) => complaint.status === 'Resolved').length,
    };
  });

  const recentComplaints = sortedComplaints.slice(0, 3);
  const firstName = user?.name?.split(' ')[0] || 'Citizen';
  const resolvedRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const latestComplaint = sortedComplaints[0];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Citizen Dashboard" />
        <main className="p-6 space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_24px_80px_rgba(0,0,0,0.14)] animate-fade-in">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Citizen Workspace
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-foreground">
                  Welcome back, {firstName}
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  You have {stats.total} civic requests on record, {stats.pending} awaiting action,
                  and a {resolvedRate}% resolution rate so far.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-background px-3 py-1.5">
                    Top category: {topCategory.name}
                  </span>
                  <span className="rounded-full bg-background px-3 py-1.5">
                    Latest update: {latestComplaint ? formatShortDate(latestComplaint.date) : 'No reports yet'}
                  </span>
                </div>
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
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    In Progress
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-in-progress">{stats.inProgress}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Resolved</p>
                  <p className="mt-3 text-2xl font-semibold text-resolved">{stats.resolved}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPIBox title="My Complaints" value={stats.total} icon={FileText} variant="total" trend={totalTrend} />
            <KPIBox title="Pending" value={stats.pending} icon={Clock} variant="pending" trend={pendingTrend} />
            <KPIBox title="In Progress" value={stats.inProgress} icon={Loader} variant="in-progress" />
            <KPIBox title="Resolved" value={stats.resolved} icon={CheckCircle} variant="resolved" trend={resolvedTrend} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TrendChart data={chartData} />
            </div>

            <div className="bg-card rounded-lg card-shadow p-5 space-y-4 animate-fade-in">
              <h3 className="font-semibold text-sm text-foreground">Quick Actions</h3>
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live Summary</p>
                <p className="mt-2 text-sm text-foreground">
                  {stats.pending > 0
                    ? `${stats.pending} request${stats.pending > 1 ? 's are' : ' is'} waiting for action.`
                    : 'No pending requests right now.'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stats.inProgress > 0
                    ? `${stats.inProgress} complaint${stats.inProgress > 1 ? 's are' : ' is'} actively being handled.`
                    : 'New reports will appear here as soon as you submit them.'}
                </p>
              </div>
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

          <section className="bg-card rounded-lg card-shadow p-5 animate-fade-in">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-sm text-foreground">Recent Activity</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Your latest complaints appear here automatically.
                </p>
              </div>
              <button
                onClick={() => navigate('/complaints')}
                className="text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                View all
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <article key={complaint.id} className="rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{complaint.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{complaint.location?.address}</p>
                      </div>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        {complaint.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                      {complaint.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{complaint.category}</span>
                      <span>{formatShortDate(complaint.date)}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="md:col-span-3 rounded-2xl border border-dashed border-border bg-background p-8 text-center">
                  <p className="text-sm font-medium text-foreground">No complaints yet</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Once you submit a report, this dashboard will update with fresh stats and recent activity.
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
