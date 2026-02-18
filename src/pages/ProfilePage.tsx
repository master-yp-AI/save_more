import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, Award, Heart, Ban, TrendingUp, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockUser, mockAchievements } from '@/data/mockData';
import BottomNav from '@/components/layouts/BottomNav';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user] = useState(mockUser);
  const [afterglowData, setAfterglowData] = useState<any>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [blacklistCount, setBlacklistCount] = useState(0);

  useEffect(() => {
    const loadData = () => {
      // 从 localStorage 加载断念数据
      const saved = localStorage.getItem('afterglow_data');
      if (saved) {
        setAfterglowData(JSON.parse(saved));
      }

      // 加载收藏数量
      const favData = localStorage.getItem('favorites');
      if (favData) {
        const favorites = JSON.parse(favData);
        setFavoritesCount(favorites.length);
      }

      // 加载黑名单数量
      const blacklistData = localStorage.getItem('blacklist');
      if (blacklistData) {
        const blacklist = JSON.parse(blacklistData);
        setBlacklistCount(blacklist.length);
      }
    };

    loadData();

    // 监听storage事件
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const menuItems = [
    {
      id: 'favorites',
      label: '我的收藏',
      icon: Heart,
      path: '/favorites',
      badge: favoritesCount
    },
    {
      id: 'blacklist',
      label: '我的黑名单',
      icon: Ban,
      path: '/blacklist',
      badge: blacklistCount
    },
    {
      id: 'slash',
      label: '我的劝一刀',
      icon: TrendingUp,
      path: '/my-slash',
      badge: 0
    },
    {
      id: 'achievements',
      label: '我的成就',
      icon: Award,
      path: '/achievements',
      badge: user.achievements.filter(a => a.unlocked).length
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-foreground">个人中心</h1>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 用户信息 */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-1">{user.name}</h2>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* 功德值 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">功德值</p>
              <p className="text-2xl font-bold text-merit-green">{user.meritPoints}</p>
            </div>
            <div className="text-4xl">🏅</div>
          </div>
        </Card>

        {/* 成就展示 */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-foreground">我的成就</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/achievements')}
            >
              查看全部
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {mockAchievements.slice(0, 4).map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center gap-2"
              >
                <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon.startsWith('http') ? (
                    <img src={achievement.icon} alt={achievement.name} className="w-12 h-12 object-cover rounded-full" />
                  ) : (
                    <span>{achievement.icon}</span>
                  )}
                </div>
                <p className="text-xs text-center text-muted-foreground line-clamp-1">
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 断念记录 */}
        {afterglowData && (
          <Card className="p-4 bg-gradient-to-br from-merit-green/10 to-primary/10 border-merit-green/30">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-foreground mb-1">断念记录</h3>
                <p className="text-sm text-muted-foreground">你的精神成长轨迹</p>
              </div>
              <div className="text-3xl">✨</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-background/50 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">累计断念</p>
                <p className="text-2xl font-bold text-foreground">{afterglowData.refusalCount || 0}</p>
                <p className="text-xs text-muted-foreground">次</p>
              </div>
              <div className="bg-background/50 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">累计省下</p>
                <p className="text-2xl font-bold text-merit-green">¥{afterglowData.totalSaved || 0}</p>
                <p className="text-xs text-muted-foreground">元</p>
              </div>
            </div>
            {afterglowData.selectedGoal && (
              <div className="bg-background/50 p-3 rounded-lg mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{afterglowData.selectedGoal.image}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {afterglowData.selectedGoal.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {afterglowData.refusalCount || 0} / {afterglowData.selectedGoal.requiredRefusals} 次
                    </p>
                  </div>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/afterglow')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              查看完整记录
            </Button>
          </Card>
        )}

        {/* 菜单列表 */}
        <Card className="divide-y divide-border">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge > 0 && (
                    <Badge variant="secondary">{item.badge}</Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </Card>

        {/* 春节特别功能 */}
        <Card className="p-4 bg-gradient-to-r from-pdd-orange-light to-secondary/10 border-secondary/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-foreground mb-1">春节特辑</h3>
              <p className="text-sm text-muted-foreground">亲戚互怼模式</p>
            </div>
            <div className="text-3xl">🧧</div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/spring-festival')}
          >
            <Share2 className="w-4 h-4 mr-2" />
            生成穷困潦倒海报
          </Button>
        </Card>

        {/* 关于 */}
        <Card className="p-4 text-center bg-muted/50">
          <p className="text-sm text-muted-foreground mb-2">
            与其拼单，不如从源头切断消费欲望
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 省点吧 v1.0.0
          </p>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
