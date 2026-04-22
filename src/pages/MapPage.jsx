import { useMemo, useState } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import MapView from '../components/civic/MapView';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/civic/StatusBadge';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Resolved'];

// Chart Colors matching the application's premium dark theme
const COLORS = {
  Pending: '#f87171', // red-400
  'In Progress': '#facc15', // yellow-400
  Resolved: '#34d399', // emerald-400
};

export default function MapPage() {
  const { complaints } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [activeComplaintId, setActiveComplaintId] = useState(null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(complaints.map((complaint) => complaint.category)))],
    [complaints]
  );

  const filteredComplaints = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || complaint.category === categoryFilter;
      const matchesQuery =
        !normalizedQuery ||
        complaint.title.toLowerCase().includes(normalizedQuery) ||
        complaint.description.toLowerCase().includes(normalizedQuery) ||
        complaint.location.address.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesCategory && matchesQuery;
    });
  }, [complaints, statusFilter, categoryFilter, query]);

  const chartData = useMemo(() => {
    const counts = { Pending: 0, 'In Progress': 0, Resolved: 0 };
    filteredComplaints.forEach((complaint) => {
      counts[complaint.status] += 1;
    });
    return [
      { name: 'Pending', value: counts.Pending },
      { name: 'In Progress', value: counts['In Progress'] },
      { name: 'Resolved', value: counts.Resolved },
    ].filter(item => item.value > 0);
  }, [filteredComplaints]);

  const recentlyUpdated = useMemo(
    () => [...filteredComplaints].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [filteredComplaints]
  );

  return (
    <div className="flex min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Premium Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/20 blur-[140px] pointer-events-none" />
      
      <Sidebar />
      <div className="flex-1 ml-64 relative z-10 flex flex-col h-screen overflow-hidden">
        <Navbar title="Interactive Map Dashboard" />
        <main className="flex-1 p-6 overflow-hidden animate-fade-in flex">
          <div className="grid gap-6 w-full h-full lg:grid-cols-[360px_minmax(0,1fr)]">
            
            {/* Left Sidebar for Controls & Analytics */}
            <aside className="space-y-6 h-full overflow-y-auto pr-2 pb-6 custom-scrollbar flex flex-col">
              
              {/* Map Controls */}
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent relative z-10">Filters & Search</h2>

                <div className="mt-5 space-y-5 relative z-10">
                  <div>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search location, title..."
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-slate-200 outline-none transition-all focus:border-indigo-500/50 focus:bg-black/80 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-500 shadow-inner"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_FILTERS.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setStatusFilter(status);
                            setActiveComplaintId(null);
                          }}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                            statusFilter === status
                              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-[1.02]'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Category</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setCategoryFilter(category);
                            setActiveComplaintId(null);
                          }}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                            categoryFilter === category
                              ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.02]'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Chart */}
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden shrink-0">
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none" />
                <h3 className="text-xl font-extrabold tracking-tight text-slate-100 mb-1 relative z-10">Analytics</h3>
                <p className="text-xs text-slate-400 mb-4 relative z-10">Real-time status breakdown</p>
                
                <div className="h-[220px] w-full relative z-10">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={6}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={6}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}
                          itemStyle={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}
                        />
                        <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}/>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-slate-500 text-sm">No active issues found.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Issues */}
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 shadow-2xl flex-1 flex flex-col min-h-[250px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold tracking-tight text-slate-100">Recent Issues</h3>
                  <span className="rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 text-[10px] font-bold tracking-widest">TOP {recentlyUpdated.length}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {recentlyUpdated.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-slate-500">No issues match filters.</p>
                    </div>
                  ) : (
                    recentlyUpdated.map((complaint) => (
                      <button
                        key={complaint.id}
                        type="button"
                        onClick={() => setActiveComplaintId(complaint.id)}
                        className={`w-full rounded-xl border p-3.5 text-left transition-all duration-300 group ${
                          activeComplaintId === complaint.id 
                            ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                            : 'border-white/5 bg-black/20 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-200 truncate group-hover:text-indigo-300 transition-colors">{complaint.title}</p>
                            <p className="mt-1 text-xs text-slate-500 truncate">{complaint.location.address}</p>
                          </div>
                          <div className="shrink-0 scale-90 origin-top-right">
                            <StatusBadge status={complaint.status} />
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </aside>

            {/* Main Map Area */}
            <section className="h-full flex flex-col pb-6">
              <div className="h-full rounded-[1.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-2 shadow-2xl relative flex flex-col group">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none rounded-[1.5rem]" />
                <div className="flex-1 rounded-[1rem] overflow-hidden border border-white/5 relative z-10 shadow-inner">
                  <MapView
                    complaints={filteredComplaints}
                    height="100%"
                    activeComplaintId={activeComplaintId}
                  />
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

