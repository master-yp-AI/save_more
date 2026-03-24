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
    <>
      {/* 桌面端：左侧固定侧边栏 */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 w-56 bg-card border-r border-border flex-col">
        <div className="p-5 border-b border-border">
          <h1 className="text-xl font-bold text-secondary">省点吧</h1>
          <p className="text-xs text-muted-foreground mt-1">理性消费，从我做起</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex items-center gap-3 w-full px-5 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-secondary bg-secondary/10 border-r-2 border-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center p-0 px-1 bg-destructive text-destructive-foreground text-xs">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-5 border-t border-border text-xs text-muted-foreground">
          © 2026 省点吧
        </div>
      </aside>

      {/* 移动端：底部导航栏 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
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
    </>
  );
}
