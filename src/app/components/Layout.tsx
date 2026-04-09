import { Link, Outlet, useLocation } from 'react-router';
import { Home, ClipboardList, History, Sparkles, Package, ScanBarcode, Flame } from 'lucide-react';
import { calculateStreak } from '../utils/storage';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Check-in', path: '/', icon: Home },
  { name: 'Routine', path: '/routine', icon: ClipboardList },
  { name: 'History', path: '/history', icon: History },
  { name: 'AI Coach', path: '/coach', icon: Sparkles },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Analyzer', path: '/analyzer', icon: ScanBarcode },
];

export default function Layout() {
  const location = useLocation();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const updateStreak = () => setStreak(calculateStreak());
    updateStreak();

    window.addEventListener('storage', updateStreak);
    window.addEventListener('checkin-update', updateStreak);

    return () => {
      window.removeEventListener('storage', updateStreak);
      window.removeEventListener('checkin-update', updateStreak);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="flex items-center gap-2">
            Skincare Tracker
          </h1>
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg">
            <Flame className="w-4 h-4 text-destructive" />
            <span>{streak} day{streak !== 1 ? 's' : ''} streak</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <main className="max-w-7xl mx-auto p-4">
          <Outlet />
        </main>
      </div>

      <nav className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
