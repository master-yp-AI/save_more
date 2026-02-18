import { Home, Users, Grid, Sprout, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: '首页', icon: Home, path: '/', badge: 0 },
    { id: 'dissuasion', label: '劝退', icon: Users, path: '/dissuasion', badge: 0 },
    { id: 'category', label: '分类', icon: Grid, path: '/category', badge: 0 },
    { id: 'desert', label: '荒漠', icon: Sprout, path: '/desert', badge: 0 },
    { id: 'profile', label: '个人中心', icon: User, path: '/profile', badge: 0 }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full relative transition-colors',
                isActive ? 'text-secondary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center p-0 px-1 bg-destructive text-destructive-foreground text-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
