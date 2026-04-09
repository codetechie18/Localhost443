import { useState } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import UploadBox from '../components/civic/UploadBox';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../components/data/complaints';
import { ChevronDown, MapPin, CheckCircle } from 'lucide-react';

export default function ReportIssue() {
  const { addComplaint } = useApp();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', category: '', image: null });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addComplaint({
      ...form,
      userId: user.id,
      location: { lat: 21.1458 + (Math.random() - 0.5) * 0.05, lng: 79.0882 + (Math.random() - 0.5) * 0.05, address: 'Nagpur, Maharashtra' },
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ title: '', description: '', category: '', image: null });
    }, 3000);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Report an Issue" />
        <main className="p-6 max-w-2xl">
          {submitted ? (
            <div className="bg-card rounded-xl card-shadow p-12 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-resolved/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-resolved" />
              </div>
              <h3 className="text-lg font-bold">Complaint Registered!</h3>
              <p className="text-sm text-muted-foreground mt-2">Assigned to <strong>Nagpur Municipal Corporation</strong></p>
              <p className="text-xs text-muted-foreground mt-1">You will be notified of status updates.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-xl card-shadow p-6 space-y-5 animate-fade-in">
              <UploadBox onFileSelect={(url) => setForm((f) => ({ ...f, image: url }))} />
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required placeholder="Brief title of the issue"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                <div className="relative">
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg p-3">
                <MapPin className="w-4 h-4" />
                <span>Location will be auto-detected: <strong>Nagpur, Maharashtra</strong></span>
              </div>
              <button type="submit"
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Submit Complaint
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
