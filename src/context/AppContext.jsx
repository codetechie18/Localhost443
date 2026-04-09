import { createContext, useContext, useState, useCallback } from 'react';
import { initialComplaints, getDepartment } from '../components/data/complaints';
import { toast } from 'sonner';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [notifications, setNotifications] = useState([]);

  const addComplaint = useCallback((complaint) => {
    const newComplaint = {
      ...complaint,
      id: Date.now(),
      status: 'Pending',
      priority: 'Medium',
      department: getDepartment(complaint.category),
      date: new Date().toISOString().split('T')[0],
      feedback: null,
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    toast.success('Complaint registered! Assigned to Nagpur Municipal Corporation.');
    return newComplaint;
  }, []);

  const updateStatus = useCallback((id, newStatus) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    const msg = `Complaint #${id} status updated to ${newStatus}`;
    setNotifications((prev) => [{ id: Date.now(), message: msg, time: new Date() }, ...prev]);
    toast.info(msg);
  }, []);

  const addFeedback = useCallback((id, feedback) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, feedback } : c))
    );
    toast.success('Thank you for your feedback!');
  }, []);

  const getStats = useCallback(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    return { total, pending, inProgress, resolved };
  }, [complaints]);

  return (
    <AppContext.Provider value={{ complaints, addComplaint, updateStatus, addFeedback, getStats, notifications }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
