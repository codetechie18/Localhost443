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
              <h3 className="font-semibold text-sm">Quick Actions</h3>
              <button
                onClick={() => navigate('/report')}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:card-shadow-hover transition-all hover:border-primary/30"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Report Issue</p>
                  <p className="text-xs text-muted-foreground">Submit a new civic complaint</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/map')}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:card-shadow-hover transition-all hover:border-primary/30"
              >
                <div className="w-10 h-10 rounded-lg bg-resolved/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-resolved" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">View Map</p>
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
