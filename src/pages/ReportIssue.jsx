import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import UploadBox from '../components/civic/UploadBox';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../components/data/complaints';
import {
  clearReportDraft,
  EMPTY_REPORT_FORM,
  hasReportDraftContent,
  readReportDraft,
  saveReportDraft,
} from '../utils/reportDraft';
import { CheckCircle, ChevronDown, MapPin, Save } from 'lucide-react';

const formatSavedTime = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

export default function ReportIssue() {
  const { addComplaint } = useApp();
  const { user } = useAuth();
  const initialDraft = readReportDraft();
  const [form, setForm] = useState(() =>
    initialDraft
      ? { ...EMPTY_REPORT_FORM, ...initialDraft, image: null }
      : EMPTY_REPORT_FORM
  );
  const [submitted, setSubmitted] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(initialDraft?.updatedAt ?? null);
  const [restoredDraft, setRestoredDraft] = useState(Boolean(initialDraft));
  const [uploadResetKey, setUploadResetKey] = useState(0);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (!hasReportDraftContent(form)) {
      clearReportDraft();
      setLastSavedAt(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const savedDraft = saveReportDraft(form);
      setLastSavedAt(savedDraft?.updatedAt ?? null);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [form.title, form.description, form.category]);

  const updateForm = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const resetForm = () => {
    setForm({ ...EMPTY_REPORT_FORM });
    setUploadResetKey((currentKey) => currentKey + 1);
  };

  const handleClearDraft = () => {
    clearReportDraft();
    setLastSavedAt(null);
    setRestoredDraft(false);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addComplaint({
      ...form,
      userId: user.id,
      location: {
        lat: 21.1458 + (Math.random() - 0.5) * 0.05,
        lng: 79.0882 + (Math.random() - 0.5) * 0.05,
        address: 'Nagpur, Maharashtra',
      },
    });
    clearReportDraft();
    setLastSavedAt(null);
    setRestoredDraft(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      resetForm();
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
              <p className="text-sm text-muted-foreground mt-2">
                Assigned to <strong>Nagpur Municipal Corporation</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You will be notified of status updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-xl card-shadow p-6 space-y-5 animate-fade-in">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Save className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {restoredDraft ? 'Draft restored automatically' : 'Auto-save is on'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lastSavedAt
                          ? `Last saved ${formatSavedTime(lastSavedAt)}. Title, description, and category are stored on this device.`
                          : 'Start typing and your report draft will be saved automatically on this device.'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Images are not kept in saved drafts and need to be uploaded again if you return later.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    disabled={!hasReportDraftContent(form) && !lastSavedAt}
                    className="px-3 py-2 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear Draft
                  </button>
                </div>
              </div>

              <UploadBox
                resetKey={uploadResetKey}
                onFileSelect={(url) => updateForm('image', url)}
              />

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  required
                  placeholder="Brief title of the issue"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  required
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={(e) => updateForm('category', e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg p-3">
                <MapPin className="w-4 h-4" />
                <span>
                  Location will be auto-detected: <strong>Nagpur, Maharashtra</strong>
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Submit Complaint
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
