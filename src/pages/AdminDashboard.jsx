import { useMemo } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import KPIBox from '../components/civic/KPIBox';
import StatusBadge from '../components/civic/StatusBadge';
import PriorityBadge from '../components/civic/PriorityBadge';
import { TrendChart, StatusDonut, PriorityBar, MonthlyChart, WorkloadChart } from '../components/civic/ChartPanel';
import MapView from '../components/civic/MapView';
import { useApp } from '../context/AppContext';
import { FileText, Clock, Loader, CheckCircle } from 'lucide-react';

const formatShortDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const buildWeekData = (complaints) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const dateKey = date.toISOString().split('T')[0];

    const filtered = complaints.filter((complaint) => complaint.date === dateKey);

    return {
      day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
      complaints: filtered.length,
      resolved: filtered.filter((complaint) => complaint.status === 'Resolved').length,
    };
  });
};

const buildMonthlyData = (complaints) => {
  const monthCounts = complaints.reduce((result, complaint) => {
    if (!complaint.date) return result;
    const month = new Date(complaint.date).toLocaleString('en-US', { month: 'short' });
    result[month] = (result[month] || 0) + 1;
    return result;
  }, {});

  const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return monthList.map((month) => ({
    month,
    complaints: monthCounts[month] || 0,
  }));
};

const getDepartmentSummary = (complaints) => {
  const counts = complaints.reduce((acc, complaint) => {
    acc[complaint.department] = (acc[complaint.department] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([department, count]) => ({ department, count }));
};

export default function AdminDashboard() {
  const { complaints, getStats } = useApp();
  const stats = getStats();

  const weeklyChartData = useMemo(() => buildWeekData(complaints), [complaints]);
  const monthlyChartData = useMemo(() => buildMonthlyData(complaints), [complaints]);
  const topDepartments = useMemo(() => getDepartmentSummary(complaints), [complaints]);
  const recentComplaints = useMemo(
    () => [...complaints].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4),
    [complaints]
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="NMC Admin Dashboard" />
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPIBox title="Total Complaints" value={stats.total} icon={FileText} variant="total" />
            <KPIBox title="Pending" value={stats.pending} icon={Clock} variant="pending" />
            <KPIBox title="In Progress" value={stats.inProgress} icon={Loader} variant="in-progress" />
            <KPIBox title="Resolved" value={stats.resolved} icon={CheckCircle} variant="resolved" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TrendChart data={weeklyChartData} />
            <MonthlyChart data={monthlyChartData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatusDonut stats={stats} />
            <PriorityBar complaints={complaints} />
            <WorkloadChart data={weeklyChartData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-lg card-shadow p-5 animate-fade-in">
              <h3 className="font-semibold text-sm mb-4">Top Departments</h3>
              <div className="space-y-3">
                {topDepartments.map((item) => (
                  <div key={item.department} className="flex items-center justify-between rounded-2xl border border-border p-4">
                    <div>
                      <p className="text-sm font-medium">{item.department}</p>
                      <p className="text-xs text-muted-foreground">Open issues: {item.count}</p>
                    </div>
                    <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold">{item.count}</span>
                  </div>
                ))}
                {topDepartments.length === 0 && <p className="text-sm text-muted-foreground">No departments have active complaints yet.</p>}
              </div>
            </div>

            <div className="bg-card rounded-lg card-shadow p-5 animate-fade-in">
              <h3 className="font-semibold text-sm mb-4">Recent Complaints</h3>
              <div className="space-y-4">
                {recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="rounded-3xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">{complaint.title}</p>
                        <p className="text-xs text-muted-foreground">{formatShortDate(complaint.date)}</p>
                      </div>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <PriorityBadge priority={complaint.priority} />
                      <span className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground">{complaint.department}</span>
                    </div>
                  </div>
                ))}
                {recentComplaints.length === 0 && <p className="text-sm text-muted-foreground">No complaints available yet.</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3">Issue Map — All Zones</h3>
            <MapView complaints={complaints} height="400px" />
          </div>
        </main>
      </div>
    </div>
  );
}
