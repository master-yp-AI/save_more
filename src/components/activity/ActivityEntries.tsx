import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ActivityEntry {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  path: string;
  bgColor: string;
}

const activities: ActivityEntry[] = [
  {
    id: 'slash',
    title: '劝一刀',
    subtitle: '好友帮涨价',
    icon: '⚡',
    path: '/slash',
    bgColor: 'bg-destructive'
  },
  {
    id: 'guilt',
    title: '百亿愧疚',
    subtitle: '看看浪费了多少',
    icon: '💰',
    path: '/guilt',
    bgColor: 'bg-warning-yellow'
  },
  {
    id: 'desert',
    title: '荒漠求生',
    subtitle: '拔草大作战',
    icon: '🌵',
    path: '/desert',
    bgColor: 'bg-merit-green'
  },
  {
    id: 'dissuasion',
    title: '去劝退',
    subtitle: '劝退他人购物',
    icon: '🛡️',
    path: '/dissuasion',
    bgColor: 'bg-primary'
  }
];

export default function ActivityEntries() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 lg:px-6">
      {activities.map((activity) => (
        <Card
          key={activity.id}
          className="p-2.5 cursor-pointer hover:shadow-md transition-shadow rounded-lg border-2 border-secondary h-16"
          onClick={() => navigate(activity.path)}
        >
          <div className="flex items-center justify-between gap-2 h-full">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground leading-tight">{activity.title}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-0.5 leading-tight">
                {activity.subtitle}
                <span className="text-muted-foreground text-xs">❓</span>
              </p>
            </div>
            <div className="text-2xl flex-shrink-0 leading-none">
              {activity.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
