import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, MapPin, Bell, LogOut, PlusCircle, BarChart3, Users, Shield
} from 'lucide-react';

const citizenLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/report', label: 'Report Issue', icon: PlusCircle },
  { to: '/complaints', label: 'My Complaints', icon: FileText },
  { to: '/map', label: 'Map View', icon: MapPin },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/complaints', label: 'Manage Complaints', icon: FileText },
  { to: '/admin/map', label: 'Map View', icon: MapPin },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = user?.role === 'admin' ? adminLinks : citizenLinks;

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground h-screen flex flex-col fixed left-0 top-0 z-40 animate-slide-in">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-accent flex items-center justify-center">
            <Shield className="w-5 h-5 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold">Civic IRS</h1>
            <p className="text-[10px] text-sidebar-foreground/60">Nagpur Municipal Corp</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-sidebar-accent text-sidebar-primary font-medium' : 'hover:bg-sidebar-accent/50'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user?.name}</p>
            <p className="text-[10px] text-sidebar-foreground/60 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/70"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
