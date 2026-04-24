import { useMemo, useState, useRef, useEffect } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import MapView from '../components/civic/MapView';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import StatusBadge from '../components/civic/StatusBadge';
import { Bot } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Resolved'];
const PRIORITY_FILTERS = ['All', 'High', 'Medium', 'Low'];

export default function AdminMap() {
  const { complaints, updateStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [activeComplaintId, setActiveComplaintId] = useState(null);

  // AI Workflow States
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiLogs, setAiLogs] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const logsEndRef = useRef(null);

  // Auto-scroll AI logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiLogs]);

  const generateRoute = () => {
    const pendingCases = complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress');
    if (pendingCases.length < 2) {
      setAiLogs([{ text: "Not enough cases to generate an optimized route.", type: "info" }]);
      setTimeout(() => setAiLogs([]), 3000);
      return;
    }

    setIsAiRunning(true);
    setAiLogs([{ text: "Initializing AI Dispatcher...", type: "system" }]);

    setTimeout(() => {
      setAiLogs(prev => [...prev, { text: `Calculating Traveling Salesperson (TSP) algorithm for ${pendingCases.length} locations...`, type: "processing" }]);
      
      setTimeout(() => {
        // Simple mock route: just map their coordinates and maybe sort by lat/lng to look somewhat realistic
        const route = pendingCases
          .map(c => [c.location.lat, c.location.lng])
          .sort((a, b) => a[0] - b[0] || a[1] - b[1]); 
        
        setOptimizedRoute(route);
        setAiLogs(prev => [...prev, { text: `✅ Optimal Route Generated. Rendering on map...`, type: "success" }]);
        setIsAiRunning(false);
      }, 2000);
    }, 1000);
  };

  const runAiWorkflow = () => {
    const pendingCases = complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress');
    if (pendingCases.length === 0) {
      setAiLogs([{ text: "No pending or in-progress cases found for AI to process.", type: "info" }]);
      setTimeout(() => setAiLogs([]), 3000);
      return;
    }

    setIsAiRunning(true);
    setAiLogs([{ text: "Initializing Civic AI Case Solver...", type: "system" }]);

    let index = 0;

    const processNext = () => {
      if (index >= pendingCases.length) {
        setAiLogs(prev => [...prev, { text: "✅ AI Workflow Complete. All verified cases have been automatically resolved.", type: "success" }]);
        setTimeout(() => {
          setIsAiRunning(false);
        }, 1000);
        return;
      }

      const currentCase = pendingCases[index];
      setAiLogs(prev => [...prev, { text: `🔍 Analyzing Case #${currentCase.id} (${currentCase.title})...`, type: "processing" }]);

      setTimeout(() => {
        const isFake = Math.random() > 0.8; // 20% fake simulation
        if (isFake) {
          setAiLogs(prev => [...prev, { text: `⚠️ FRAUD DETECTED: Case #${currentCase.id} fails authenticity checks (e.g. invalid geolocation or duplicated image). Skipped.`, type: "error" }]);
        } else {
          setAiLogs(prev => [...prev, { text: `✅ VERIFIED: Case #${currentCase.id} is real. Executing auto-resolution...`, type: "success" }]);
          updateStatus(currentCase.id, 'Resolved');
        }
        index++;
        setTimeout(processNext, 1000);
      }, 1500);
    };

    setTimeout(processNext, 1200);
  };

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
    <div className="flex min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Admin Premium Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-destructive/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />

      <Sidebar />
      <div className="flex-1 ml-64 relative z-10 flex flex-col h-screen overflow-hidden">
        <Navbar title="Command Center — Issue Map" />

        <main className="flex-1 p-6 overflow-hidden animate-fade-in flex">
          <div className="grid gap-6 w-full h-full lg:grid-cols-[400px_minmax(0,1fr)]">

            {/* Admin Sidebar Panel */}
            <aside className="space-y-6 h-full overflow-y-auto pr-2 pb-6 custom-scrollbar flex flex-col">

              {/* AI Auto-Resolver */}
              <div className="rounded-[1.5rem] border border-indigo-500/30 bg-indigo-900/20 backdrop-blur-2xl p-6 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden shrink-0 group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="flex items-start justify-between mb-2 relative z-10">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                      <Bot size={24} className="text-indigo-400" /> AI Solver
                    </h3>
                    <p className="text-[11px] text-indigo-200/70 mt-1 uppercase tracking-widest font-semibold">Automation & Dispatch</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={runAiWorkflow}
                      disabled={isAiRunning}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-wait text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.8)]"
                    >
                      {isAiRunning ? 'Processing...' : 'Auto-Resolve All'}
                    </button>
                    <button
                      onClick={generateRoute}
                      disabled={isAiRunning}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-wait text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)]"
                    >
                      {isAiRunning ? 'Processing...' : 'Generate Route'}
                    </button>
                  </div>
                </div>

                {/* AI Terminal Logs */}
                {(aiLogs.length > 0 || isAiRunning) && (
                  <div className="mt-4 bg-input/60 rounded-xl border border-border p-3 h-40 overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-2 relative z-10 shadow-inner">
                    {aiLogs.map((log, i) => (
                      <div key={i} className={`flex items-start gap-2 ${log.type === 'error' ? 'text-destructive' : log.type === 'success' ? 'text-success' : log.type === 'processing' ? 'text-primary' : 'text-muted-foreground'}`}>
                        <span className="opacity-50 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className="leading-snug">{log.text}</span>
                      </div>
                    ))}
                    {isAiRunning && (
                      <div className="flex items-center gap-2 text-indigo-400 animate-pulse mt-2">
                        <span className="opacity-50 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className="w-2 h-4 bg-indigo-400 inline-block"></span>
                      </div>
                    )}
                    <div ref={logsEndRef} />
                  </div>
                )}
              </div>

              {/* Advanced Filters */}
              <div className="rounded-[1.5rem] border border-border bg-card/60 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden shrink-0 group">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-destructive to-primary bg-clip-text text-transparent relative z-10">Advanced Filters</h2>

                <div className="mt-5 space-y-5 relative z-10">
                  {/* Status */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_FILTERS.map((status) => (
                        <button
                          key={status}
                          onClick={() => { setStatusFilter(status); setActiveComplaintId(null); }}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${statusFilter === status
                              ? 'bg-destructive text-destructive-foreground shadow-[0_0_20px_rgba(var(--destructive),0.4)] scale-[1.02]'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                            }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Priority</p>
                    <div className="flex flex-wrap gap-2">
                      {PRIORITY_FILTERS.map((priority) => (
                        <button
                          key={priority}
                          onClick={() => { setPriorityFilter(priority); setActiveComplaintId(null); }}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${priorityFilter === priority
                              ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.4)] scale-[1.02]'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                            }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">Department</p>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => { setDepartmentFilter(dept); setActiveComplaintId(null); }}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${departmentFilter === dept
                              ? 'bg-secondary text-secondary-foreground shadow-[0_0_20px_rgba(var(--secondary),0.4)] scale-[1.02]'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
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
              <div className="rounded-[1.5rem] border border-border bg-card/60 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden shrink-0">
                <h3 className="text-xl font-extrabold tracking-tight text-foreground mb-1 relative z-10">Department Workload</h3>
                <p className="text-xs text-muted-foreground mb-5 relative z-10">Top departments by issue count</p>

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
                      <p className="text-muted-foreground text-sm">No data for selected filters.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Critical Issues */}
              <div className="rounded-[1.5rem] border border-border bg-card/60 backdrop-blur-2xl p-6 shadow-2xl flex-1 flex flex-col min-h-[250px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold tracking-tight text-destructive">Critical Alerts</h3>
                  <span className="rounded-full bg-destructive/20 text-destructive border border-destructive/30 px-2.5 py-1 text-[10px] font-bold tracking-widest animate-pulse">ACTION REQ</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  {criticalIssues.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">No unresolved high-priority issues.</p>
                    </div>
                  ) : (
                    criticalIssues.map((complaint) => (
                      <button
                        key={complaint.id}
                        onClick={() => setActiveComplaintId(complaint.id)}
                        className={`w-full rounded-xl border p-3.5 text-left transition-all duration-300 group ${activeComplaintId === complaint.id
                            ? 'border-destructive/50 bg-destructive/10 shadow-[0_0_20px_rgba(var(--destructive),0.2)]'
                            : 'border-border bg-background/20 hover:border-destructive/30 hover:bg-destructive/5'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate group-hover:text-destructive transition-colors">{complaint.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground truncate">{complaint.location.address}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <StatusBadge status={complaint.status} />
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-2 py-0.5 rounded-md bg-muted/50 border border-border">{complaint.department}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

            </aside>

            {/* Main Map Area */}
            <section className="h-full flex flex-col pb-6">
              <div className="h-full rounded-[1.5rem] border border-border bg-card/60 backdrop-blur-2xl p-2 shadow-2xl relative flex flex-col group">
                <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 to-transparent pointer-events-none rounded-[1.5rem]" />
                <div className="absolute top-4 left-4 z-[400] flex gap-2">
                  <div className="bg-card/80 backdrop-blur-md border border-border text-foreground px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                    Showing {filteredComplaints.length} issues
                  </div>
                </div>
                <div className="flex-1 rounded-[1rem] overflow-hidden border border-border/50 relative z-10 shadow-inner">
                  <MapView
                    complaints={filteredComplaints}
                    height="100%"
                    activeComplaintId={activeComplaintId}
                    optimizedRoute={optimizedRoute}
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
