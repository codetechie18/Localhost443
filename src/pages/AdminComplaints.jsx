import { useState } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import StatusBadge from '../components/civic/StatusBadge';
import PriorityBadge from '../components/civic/PriorityBadge';
import { useApp } from '../context/AppContext';
import { STATUSES } from '../components/data/complaints';
import { ChevronDown } from 'lucide-react';

export default function AdminComplaints() {
  const { complaints, updateStatus } = useApp();
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Manage Complaints" />
        <main className="p-6 space-y-4">
          <div className="flex gap-2">
            {['All', ...STATUSES].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted card-shadow'
                }`}>
                {f}
              </button>
            ))}
          </div>

          <div className="bg-card rounded-lg card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-medium text-muted-foreground">Image</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Priority</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        {c.image && <img src={c.image} alt="" className="w-16 h-12 object-cover rounded" />}
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                      </td>
                      <td className="p-4"><span className="px-2 py-1 rounded bg-muted text-xs font-medium">{c.category}</span></td>
                      <td className="p-4"><PriorityBadge priority={c.priority} /></td>
                      <td className="p-4"><StatusBadge status={c.status} /></td>
                      <td className="p-4">
                        <div className="relative">
                          <select
                            value={c.status}
                            onChange={(e) => updateStatus(c.id, e.target.value)}
                            className="px-3 py-1.5 rounded border border-border bg-background text-xs appearance-none pr-7 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
