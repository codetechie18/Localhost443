import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import { TrendChart, StatusDonut, PriorityBar, MonthlyChart, WorkloadChart } from '../components/civic/ChartPanel';
import { useApp } from '../context/AppContext';
import { dailyData, monthlyData } from '../components/data/complaints';

export default function AdminAnalytics() {
  const { complaints, getStats } = useApp();
  const stats = getStats();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Analytics & Reports" />
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TrendChart data={dailyData} />
            <MonthlyChart data={monthlyData} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <StatusDonut stats={stats} />
            <PriorityBar complaints={complaints} />
            <WorkloadChart data={dailyData} />
          </div>
        </main>
      </div>
    </div>
  );
}
