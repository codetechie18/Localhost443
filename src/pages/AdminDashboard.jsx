import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import KPIBox from '../components/civic/KPIBox';
import { TrendChart, StatusDonut, PriorityBar, MonthlyChart, WorkloadChart } from '../components/civic/ChartPanel';
import MapView from '../components/civic/MapView';
import { useApp } from '../context/AppContext';
import { dailyData, monthlyData } from '../components/data/complaints';
import { FileText, Clock, Loader, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { complaints, getStats } = useApp();
  const stats = getStats();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="NMC Admin Dashboard" />
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPIBox title="Total Complaints" value={stats.total} icon={FileText} variant="total" trend={12} />
            <KPIBox title="Pending" value={stats.pending} icon={Clock} variant="pending" trend={-8} />
            <KPIBox title="In Progress" value={stats.inProgress} icon={Loader} variant="in-progress" />
            <KPIBox title="Resolved" value={stats.resolved} icon={CheckCircle} variant="resolved" trend={22} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TrendChart data={dailyData} />
            <MonthlyChart data={monthlyData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatusDonut stats={stats} />
            <PriorityBar complaints={complaints} />
            <WorkloadChart data={dailyData} />
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
