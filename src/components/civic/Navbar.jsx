import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ title }) {
  const { user } = useAuth();
  const { notifications } = useApp();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-xs text-muted-foreground">Welcome back, {user?.name}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 w-56"
          />
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </button>
        <div className="relative">
          <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pending text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
