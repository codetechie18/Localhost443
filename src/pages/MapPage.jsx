import { useMemo, useState } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import MapView from '../components/civic/MapView';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/civic/StatusBadge';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Resolved'];

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

  const summary = useMemo(() => {
    const counts = { Pending: 0, 'In Progress': 0, Resolved: 0 };
    filteredComplaints.forEach((complaint) => {
      counts[complaint.status] += 1;
    });
    return counts;
  }, [filteredComplaints]);

  const recentlyUpdated = useMemo(
    () => [...filteredComplaints].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [filteredComplaints]
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Map View" />
        <main className="p-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Map Controls</h2>
                <p className="mt-2 text-sm text-muted-foreground">Filter complaints, search addresses, and focus individual issues.</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Search</label>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search by title, location, or description"
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Status</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {STATUS_FILTERS.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setStatusFilter(status);
                            setActiveComplaintId(null);
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            statusFilter === status
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Category</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setCategoryFilter(category);
                            setActiveComplaintId(null);
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                            categoryFilter === category
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-lg font-semibold">Current View</h3>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-3xl border border-white/10 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Visible complaints</p>
                    <p className="mt-2 text-3xl font-semibold">{filteredComplaints.length}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-background/80 p-4 text-center">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Pending</p>
                      <p className="mt-2 text-xl font-semibold text-pending">{summary.Pending}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-background/80 p-4 text-center">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">In Progress</p>
                      <p className="mt-2 text-xl font-semibold text-in-progress">{summary['In Progress']}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-background/80 p-4 text-center">
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Resolved</p>
                      <p className="mt-2 text-xl font-semibold text-resolved">{summary.Resolved}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">Recent Issues</h3>
                  <span className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground">Top {recentlyUpdated.length}</span>
                </div>

                <div className="mt-4 space-y-3 max-h-[calc(100vh-380px)] overflow-auto pr-1">
                  {recentlyUpdated.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No complaints match your filters.</p>
                  ) : (
                    recentlyUpdated.map((complaint) => (
                      <button
                        key={complaint.id}
                        type="button"
                        onClick={() => setActiveComplaintId(complaint.id)}
                        className={`w-full rounded-3xl border p-4 text-left transition ${
                          activeComplaintId === complaint.id ? 'border-primary bg-primary/5' : 'border-white/5 bg-background hover:border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">{complaint.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{complaint.location.address}</p>
                          </div>
                          <StatusBadge status={complaint.status} />
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{complaint.category} · {complaint.priority} priority</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </aside>

            <section className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Map View</p>
                    <p className="mt-1 text-sm text-muted-foreground">Inspect complaints and click a card to focus the map.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-background px-3 py-1">Status: {statusFilter}</span>
                    <span className="rounded-full bg-background px-3 py-1">Category: {categoryFilter}</span>
                    <span className="rounded-full bg-background px-3 py-1">Search: {query || 'none'}</span>
                  </div>
                </div>
              </div>

              <MapView
                complaints={filteredComplaints}
                height="calc(100vh - 220px)"
                activeComplaintId={activeComplaintId}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
