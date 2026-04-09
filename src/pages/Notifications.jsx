import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle } from 'lucide-react';

export default function Notifications() {
  const { notifications } = useApp();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Notifications" />
        <main className="p-6 max-w-2xl space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-card rounded-lg card-shadow p-12 text-center">
              <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Updates will appear here when your complaints are processed.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="bg-card rounded-lg card-shadow p-4 flex items-start gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(n.time).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
