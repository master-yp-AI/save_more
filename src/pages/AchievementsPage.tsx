import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockAchievements } from '@/data/mockData';

export default function AchievementsPage() {
  const navigate = useNavigate();
  const [achievements] = useState([
    ...mockAchievements,
    {
      id: 'week-saver',
      name: '一周守财奴',
      description: '连续7天未购物',
      icon: '💰',
      unlocked: true,
      unlockedAt: Date.now() - 86400000
    },
    {
      id: 'month-saver',
      name: '月度理性消费者',
      description: '连续30天未购物',
      icon: '🏆',
      unlocked: false
    },
    {
      id: 'slash-master',
      name: '劝一刀大师',
      description: '完成10次劝一刀',
      icon: '⚡',
      unlocked: false
    },
    {
      id: 'dissuasion-hero',
      name: '劝退英雄',
      description: '成功劝退50人',
      icon: '🦸',
      unlocked: false
    },
    {
      id: 'blacklist-king',
      name: '黑名单之王',
      description: '黑名单商品达到100件',
      icon: '🛡️',
      unlocked: false
    }
  ]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">我的成就</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 进度卡片 */}
        <Card className="p-6 bg-gradient-to-br from-warning-yellow-light to-merit-green-light">
          <div className="text-center mb-4">
            <div className="text-6xl mb-3">🏆</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {unlockedCount} / {totalCount}
            </h2>
            <p className="text-sm text-muted-foreground">已解锁成就</p>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-center text-muted-foreground mt-2">
            完成度 {progress.toFixed(0)}%
          </p>
        </Card>

        {/* 成就列表 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">全部成就</h3>
            <Badge variant="secondary">
              {unlockedCount} 已解锁
            </Badge>
          </div>

          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-4 ${achievement.unlocked ? 'bg-gradient-to-r from-merit-green-light to-transparent border-merit-green/20' : 'bg-muted/30'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-5xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon.startsWith('http') ? (
                    <img
                      src={achievement.icon}
                      alt={achievement.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    <span>{achievement.icon}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked ? (
                      <Unlock className="w-5 h-5 text-merit-green flex-shrink-0" />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-merit-green text-white">
                        已解锁
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(achievement.unlockedAt)}
                      </span>
                    </div>
                  )}
                  {!achievement.unlocked && (
                    <Badge variant="outline" className="mt-2">
                      未解锁
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 说明 */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-medium text-foreground mb-2">成就说明</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 完成特定任务即可解锁成就</li>
            <li>• 解锁成就可获得功德值奖励</li>
            <li>• 收集更多成就，成为理性消费达人</li>
            <li>• 已解锁的成就可以分享到朋友圈</li>
          </ul>
        </Card>

        {/* 励志语录 */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <p className="text-center text-sm text-foreground italic">
            "每一个未解锁的成就，都是通往理性消费的里程碑"
          </p>
        </Card>
      </div>
    </div>
  );
}
