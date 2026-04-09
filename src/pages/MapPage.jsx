import { useState } from 'react';
import Sidebar from '../components/civic/Sidebar';
import Navbar from '../components/civic/Navbar';
import MapView from '../components/civic/MapView';
import { useApp } from '../context/AppContext';

const filters = ['All', 'Pending', 'In Progress', 'Resolved'];

export default function MapPage() {
  const { complaints } = useApp();
  const [filter, setFilter] = useState('All');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title="Map View" />
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
          <MapView
            complaints={complaints}
            height="calc(100vh - 200px)"
            filterStatus={filter === 'All' ? null : filter}
          />
        </main>
      </div>
    </div>
  );
}
