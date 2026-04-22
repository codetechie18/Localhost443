import { useMemo, useState } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import MapView from '../components/civic/MapView';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import StatusBadge from '../components/civic/StatusBadge';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Resolved'];
const PRIORITY_FILTERS = ['All', 'High', 'Medium', 'Low'];

export default function AdminMap() {
  const { complaints } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [activeComplaintId, setActiveComplaintId] = useState(null);

  const departments = useMemo(
    () => ['All', ...Array.from(new Set(complaints.map((c) => c.department)))],
    [complaints]
  );

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchDept = departmentFilter === 'All' || c.department === departmentFilter;
      return matchStatus && matchPriority && matchDept;
    });
  }, [complaints, statusFilter, priorityFilter, departmentFilter]);

  const deptChartData = useMemo(() => {
    const counts = {};
    filteredComplaints.forEach((c) => {
      counts[c.department] = (counts[c.department] || 0) + 1;
    });
    return Object.keys(counts)
      .map(dept => ({ name: dept, count: counts[dept] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 departments
  }, [filteredComplaints]);

  const criticalIssues = useMemo(() => {
    return filteredComplaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').slice(0, 5);
  }, [filteredComplaints]);

  return (
    <div className="flex min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Admin Premium Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-900/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/20 blur-[150px] pointer-events-none" />
      
      <Sidebar />
      <div className="flex-1 ml-64 relative z-10 flex flex-col h-screen overflow-hidden">
        <Navbar title="Command Center — Issue Map" />
        
        <main className="flex-1 p-6 overflow-hidden animate-fade-in flex">
          <div className="grid gap-6 w-full h-full lg:grid-cols-[380px_minmax(0,1fr)]">
            
            {/* Admin Sidebar Panel */}
            <aside className="space-y-6 h-full overflow-y-auto pr-2 pb-6 custom-scrollbar flex flex-col">
              
              {/* Advanced Filters */}
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 to-violet-400 bg-clip-text text-transparent relative z-10">Advanced Filters</h2>

                <div className="mt-5 space-y-5 relative z-10">
                  {/* Status */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_FILTERS.map((status) => (
                        <button
                          key={status}
                          onClick={() => { setStatusFilter(status); setActiveComplaintId(null); }}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                            statusFilter === status
                              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] scale-[1.02]'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Priority</p>
                    <div className="flex flex-wrap gap-2">
                      {PRIORITY_FILTERS.map((priority) => (
                        <button
                          key={priority}
                          onClick={() => { setPriorityFilter(priority); setActiveComplaintId(null); }}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                            priorityFilter === priority
                              ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] scale-[1.02]'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Department</p>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => { setDepartmentFilter(dept); setActiveComplaintId(null); }}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                            departmentFilter === dept
                              ? 'bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] scale-[1.02]'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-white/5'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Workload Chart */}
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden shrink-0">
                <h3 className="text-xl font-extrabold tracking-tight text-slate-100 mb-1 relative z-10">Department Workload</h3>
                <p className="text-xs text-slate-400 mb-5 relative z-10">Top departments by issue count</p>
                
                <div className="h-[200px] w-full relative z-10">
                  {deptChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f1f5f9' }}
                          itemStyle={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {deptChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${320 + index * 20}, 70%, 60%)`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-slate-500 text-sm">No data for selected filters.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Critical Issues */}
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-6 shadow-2xl flex-1 flex flex-col min-h-[250px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold tracking-tight text-red-400">Critical Alerts</h3>
                  <span className="rounded-full bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-1 text-[10px] font-bold tracking-widest animate-pulse">ACTION REQ</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {criticalIssues.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-slate-500">No unresolved high-priority issues.</p>
                    </div>
                  ) : (
                     criticalIssues.map((complaint) => (
                      <button
                        key={complaint.id}
                        onClick={() => setActiveComplaintId(complaint.id)}
                        className={`w-full rounded-xl border p-3.5 text-left transition-all duration-300 group ${
                          activeComplaintId === complaint.id 
                            ? 'border-red-500/50 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                            : 'border-white/5 bg-black/20 hover:border-red-500/30 hover:bg-red-500/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-200 truncate group-hover:text-red-300 transition-colors">{complaint.title}</p>
                            <p className="mt-1 text-xs text-slate-500 truncate">{complaint.location.address}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                           <StatusBadge status={complaint.status} />
                           <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10">{complaint.department}</span>
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
                <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none rounded-[1.5rem]" />
                <div className="absolute top-4 left-4 z-[400] flex gap-2">
                   <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-200 px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                      Showing {filteredComplaints.length} issues
                   </div>
                </div>
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
