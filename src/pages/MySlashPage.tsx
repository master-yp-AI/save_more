import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProducts } from '@/data/mockData';

export default function MySlashPage() {
  const navigate = useNavigate();
  const [activeSlashes] = useState([
    {
      id: '1',
      product: mockProducts[0],
      originalPrice: mockProducts[0].originalPrice,
      currentPrice: mockProducts[0].currentPrice + 500,
      slashCount: 8,
      timeLeft: 18 * 3600 + 30 * 60,
      status: 'active'
    },
    {
      id: '2',
      product: mockProducts[1],
      originalPrice: mockProducts[1].originalPrice,
      currentPrice: mockProducts[1].currentPrice + 300,
      slashCount: 5,
      timeLeft: 12 * 3600,
      status: 'active'
    }
  ]);

  const [completedSlashes] = useState([
    {
      id: '3',
      product: mockProducts[2],
      originalPrice: mockProducts[2].originalPrice,
      finalPrice: mockProducts[2].currentPrice + 1000,
      slashCount: 15,
      completedAt: Date.now() - 86400000,
      status: 'completed'
    }
  ]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时${minutes}分钟`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
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
          <h1 className="text-lg font-bold text-foreground">我的劝一刀</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 统计卡片 */}
        <Card className="p-4 bg-gradient-to-r from-destructive/10 to-warning-yellow-light border-destructive/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {activeSlashes.length + completedSlashes.length}
              </p>
              <p className="text-xs text-muted-foreground">总计</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">
                {activeSlashes.length}
              </p>
              <p className="text-xs text-muted-foreground">进行中</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-merit-green">
                {completedSlashes.length}
              </p>
              <p className="text-xs text-muted-foreground">已完成</p>
            </div>
          </div>
        </Card>

        {/* 标签页 */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">进行中</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
          </TabsList>

          {/* 进行中 */}
          <TabsContent value="active" className="space-y-3 mt-4">
            {activeSlashes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">⚡</div>
                <p className="text-muted-foreground">暂无进行中的劝一刀</p>
                <Button
                  className="mt-4"
                  onClick={() => navigate('/')}
                >
                  去首页看看
                </Button>
              </div>
            ) : (
              activeSlashes.map((slash) => (
                <Card key={slash.id} className="p-4">
                  <div className="flex gap-3 mb-3">
                    <img
                      src={slash.product.image}
                      alt={slash.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm text-foreground line-clamp-2 mb-2">
                        {slash.product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-destructive">
                          ¥{slash.currentPrice}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ¥{slash.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">涨价进度</span>
                      <div className="flex items-center gap-1 text-destructive">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">
                          +{((slash.currentPrice - slash.originalPrice) / slash.originalPrice * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">已劝一刀</span>
                      <span className="text-foreground font-medium">{slash.slashCount} 次</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">剩余时间</span>
                      <div className="flex items-center gap-1 text-warning-yellow">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{formatTime(slash.timeLeft)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/slash/${slash.product.id}`)}
                    >
                      查看详情
                    </Button>
                    <Button
                      size="sm"
                      className="pdd-button"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      继续邀请
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* 已完成 */}
          <TabsContent value="completed" className="space-y-3 mt-4">
            {completedSlashes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">🎉</div>
                <p className="text-muted-foreground">暂无已完成的劝一刀</p>
              </div>
            ) : (
              completedSlashes.map((slash) => (
                <Card key={slash.id} className="p-4 bg-muted/30">
                  <div className="flex gap-3 mb-3">
                    <img
                      src={slash.product.image}
                      alt={slash.product.name}
                      className="w-20 h-20 object-cover rounded-lg grayscale"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm text-foreground line-clamp-2 mb-2">
                        {slash.product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-muted-foreground line-through">
                          ¥{slash.finalPrice}
                        </span>
                        <Badge variant="secondary" className="bg-merit-green text-white">
                          已放弃
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">最终涨价</span>
                      <span className="text-destructive font-medium">
                        +¥{slash.finalPrice - slash.originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">劝一刀次数</span>
                      <span className="text-foreground font-medium">{slash.slashCount} 次</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">完成时间</span>
                      <span className="text-foreground">{formatDate(slash.completedAt)}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-merit-green-light rounded-lg">
                    <p className="text-sm text-center text-foreground">
                      🎉 恭喜！成功抵制消费诱惑，省下 ¥{slash.finalPrice}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* 说明 */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-medium text-foreground mb-2">活动说明</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 每个劝一刀活动有效期为24小时</li>
            <li>• 邀请好友越多，价格涨得越高</li>
            <li>• 活动结束后，如果放弃购买即为成功</li>
            <li>• 成功抵制消费可获得功德值奖励</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
