import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function DesertPage() {
  const navigate = useNavigate();
  const [grassCount, setGrassCount] = useState(100);
  const [totalGrass] = useState(100);
  const [daysWithoutShopping, setDaysWithoutShopping] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const handlePullGrass = () => {
    if (grassCount > 0) {
      const pulled = Math.floor(Math.random() * 5) + 1;
      const newCount = Math.max(0, grassCount - pulled);
      setGrassCount(newCount);
      
      if (newCount === 0 && !showReward) {
        setShowReward(true);
        toast.success('🎉 恭喜！你获得了"铁公鸡"勋章！');
      } else {
        toast.success(`拔掉了 ${pulled} 根欲望之草！`);
      }
    }
  };

  const handleCheckIn = () => {
    setDaysWithoutShopping(daysWithoutShopping + 1);
    const pulled = Math.floor(Math.random() * 10) + 5;
    const newCount = Math.max(0, grassCount - pulled);
    setGrassCount(newCount);
    toast.success(`签到成功！拔掉了 ${pulled} 根草`);
  };

  const progress = ((totalGrass - grassCount) / totalGrass) * 100;
  const isDesert = grassCount === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-merit-green text-white">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">荒漠求生</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 进度卡片 */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-foreground">拔草进度</h3>
            <Badge variant={isDesert ? 'default' : 'secondary'} className="bg-merit-green text-white">
              {isDesert ? '🏆 荒漠达成' : `${grassCount}/${totalGrass}`}
            </Badge>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {isDesert ? '恭喜！你已经拔光所有欲望之草' : `还剩 ${grassCount} 根欲望之草`}
          </p>
        </Card>

        {/* 荒漠场景 */}
        <Card className="overflow-hidden">
          <div className="relative aspect-[4/3] bg-gradient-to-b from-warning-yellow-light to-pdd-orange-light">
            <img
              src="https://miaoda-image.cdn.bcebos.com/img/corpus/5dd2b3a53c264d12aa04760011555a0c.jpg"
              alt="荒漠场景"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {isDesert ? (
                <div className="text-center space-y-3 bg-background/90 p-6 rounded-lg">
                  <div className="text-6xl">🏆</div>
                  <p className="text-xl font-bold text-foreground">荒漠达成！</p>
                  <p className="text-sm text-muted-foreground">你已经拔光所有欲望之草</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-8xl animate-bounce">🌱</div>
                  <p className="text-sm text-foreground bg-background/80 px-3 py-1 rounded-full">
                    点击下方按钮拔草
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">连续未购物</p>
            <p className="text-3xl font-bold text-merit-green">{daysWithoutShopping}</p>
            <p className="text-xs text-muted-foreground">天</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">已拔草</p>
            <p className="text-3xl font-bold text-secondary">{totalGrass - grassCount}</p>
            <p className="text-xs text-muted-foreground">根</p>
          </Card>
        </div>

        {/* 操作按钮 */}
        {!isDesert && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={handleCheckIn}
              className="h-14"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              每日签到
            </Button>
            <Button
              className="h-14 bg-merit-green hover:bg-merit-green/90 text-white"
              onClick={handlePullGrass}
            >
              拔草
            </Button>
          </div>
        )}

        {/* 奖励展示 */}
        {showReward && (
          <Card className="p-4 bg-gradient-to-br from-warning-yellow-light to-pdd-orange-light border-warning-yellow/20">
            <div className="text-center space-y-3">
              <div className="text-6xl">🐔</div>
              <h3 className="text-xl font-bold text-foreground">铁公鸡勋章</h3>
              <p className="text-sm text-muted-foreground">
                恭喜你拔光所有欲望之草，成为真正的理性消费者！
              </p>
              <Button
                className="pdd-button"
                onClick={() => navigate('/profile')}
              >
                查看我的勋章
              </Button>
            </div>
          </Card>
        )}

        {/* 游戏说明 */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-medium text-foreground mb-2">游戏说明</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 每次点击"拔草"可以拔掉1-5根欲望之草</li>
            <li>• 每日签到可以拔掉5-15根草</li>
            <li>• 每忍住一次不打开购物APP，草就会自动枯萎</li>
            <li>• 拔光所有草后，你将获得"铁公鸡"勋章</li>
            <li>• 理性消费，从拒绝欲望开始</li>
          </ul>
        </Card>

        {/* 励志语录 */}
        <Card className="p-4 bg-primary/10 border-primary/20">
          <p className="text-center text-sm text-foreground italic">
            "真正的富有，不是拥有更多，而是需要更少"
          </p>
        </Card>
      </div>
    </div>
  );
}
