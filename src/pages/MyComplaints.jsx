import { useState } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import ComplaintCard from '../components/civic/ComplaintCarde';
import FeedbackModal from '../components/civic/FeedbackModal';
import { useApp } from '../context/AppContext';

const filters = ['All', 'Pending', 'In Progress', 'Resolved'];

export default function MyComplaints() {
  const { complaints, addFeedback } = useApp();
  const [filter, setFilter] = useState('All');
  const [feedbackId, setFeedbackId] = useState(null);

  const filtered = filter === 'All' ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="My Complaints" />
        <main className="p-6 space-y-4">
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted card-shadow'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <ComplaintCard key={c.id} complaint={c} onFeedback={setFeedbackId} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No complaints found.</div>
          )}
          {feedbackId && (
            <FeedbackModal
              complaintId={feedbackId}
              onSubmit={addFeedback}
              onClose={() => setFeedbackId(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
