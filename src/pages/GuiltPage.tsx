import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingDown, Coffee, Home as HomeIcon, Plane, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function GuiltPage() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [stats, setStats] = useState({
    totalWasted: 0,
    cartValue: 0,
    equivalentMeals: 0,
    equivalentRetirementDays: 0,
    equivalentTrips: 0,
    itemCount: 0
  });

  useEffect(() => {
    const analyzeCart = async () => {
      try {
        // 从localStorage获取购物车数据
        const cartData = localStorage.getItem('shopping_cart');
        if (!cartData) {
          // 购物车为空
          setStats({
            totalWasted: 0,
            cartValue: 0,
            equivalentMeals: 0,
            equivalentRetirementDays: 0,
            equivalentTrips: 0,
            itemCount: 0
          });
          setAiAnalysis('购物车是空的，恭喜你！保持这个好习惯，理性消费从现在开始。');
          setAnalyzing(false);
          return;
        }

        const cartItems = JSON.parse(cartData);
        if (cartItems.length === 0) {
          setStats({
            totalWasted: 0,
            cartValue: 0,
            equivalentMeals: 0,
            equivalentRetirementDays: 0,
            equivalentTrips: 0,
            itemCount: 0
          });
          setAiAnalysis('购物车是空的，恭喜你！保持这个好习惯，理性消费从现在开始。');
          setAnalyzing(false);
          return;
        }

        // 调用AI分析Edge Function
        const response = await fetch('https://app-9pjyq18643cx-supabase.appmiaoda.com/functions/v1/analyze-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartItems })
        });

        if (!response.ok) {
          throw new Error('AI分析失败');
        }

        const data = await response.json();

        if (data.success) {
          const cartValue = data.totalPrice;
          setStats({
            totalWasted: 0,
            cartValue,
            equivalentMeals: Math.floor(cartValue / 30),
            equivalentRetirementDays: Math.floor(cartValue / 50),
            equivalentTrips: Math.floor(cartValue / 3000),
            itemCount: data.itemCount
          });
          setAiAnalysis(data.analysis);
        } else {
          throw new Error('分析结果异常');
        }
      } catch (error) {
        console.error('分析错误:', error);
        toast.error('AI分析失败，显示默认数据');
        
        // 降级：使用本地计算
        const cartData = localStorage.getItem('shopping_cart');
        if (cartData) {
          const cartItems = JSON.parse(cartData);
          const cartValue = cartItems.reduce((sum: number, item: any) => 
            sum + (item.currentPrice * item.quantity), 0
          );
          setStats({
            totalWasted: 0,
            cartValue,
            equivalentMeals: Math.floor(cartValue / 30),
            equivalentRetirementDays: Math.floor(cartValue / 50),
            equivalentTrips: Math.floor(cartValue / 3000),
            itemCount: cartItems.length
          });
          setAiAnalysis(`这¥${cartValue}，够你在退休后喝${Math.floor(cartValue / 50)}天的稀饭了。想象一下，60岁的你坐在小区门口，手里端着一碗热粥，看着年轻人背着你现在想买的这些东西匆匆走过。那时候的你，会感谢现在克制的自己。`);
        }
      } finally {
        setAnalyzing(false);
      }
    };

    analyzeCart();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-warning-yellow text-foreground">
        <div className="flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">百亿愧疚</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 主标题 */}
        <Card className="p-6 text-center bg-gradient-to-br from-warning-yellow-light to-destructive/10">
          <div className="text-6xl mb-4">💸</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            今日已为您省下
          </h2>
          <p className="text-5xl font-bold text-secondary mb-3">¥0</p>
          <p className="text-sm text-muted-foreground">
            因为您刚才盯着那双运动鞋看了30秒
          </p>
          <p className="text-sm text-destructive font-medium mt-2">
            请反省
          </p>
        </Card>

        {/* 分析中/分析结果 */}
        {analyzing ? (
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl">🤖</div>
              <p className="text-foreground font-medium">AI正在分析您的购物车...</p>
              <Progress value={66} className="h-2" />
              <p className="text-sm text-muted-foreground">
                正在计算您的浪费指数
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* 购物车总价值 */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">购物车总价值</h3>
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <p className="text-3xl font-bold text-destructive mb-2">
                ¥{stats.cartValue}
              </p>
              <p className="text-sm text-muted-foreground">
                这些钱如果存起来...
              </p>
            </Card>

            {/* 等价物计算 */}
            <div className="grid grid-cols-1 gap-3">
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-merit-green-light flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-merit-green" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">够你吃</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.equivalentMeals} 顿
                    </p>
                    <p className="text-xs text-muted-foreground">外卖（按30元/顿计算）</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pdd-orange-light flex items-center justify-center">
                    <HomeIcon className="w-6 h-6 text-pdd-orange" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">够你退休后喝</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.equivalentRetirementDays} 天
                    </p>
                    <p className="text-xs text-muted-foreground">稀饭（按50元/天计算）</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">够你来</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.equivalentTrips} 次
                    </p>
                    <p className="text-xs text-muted-foreground">说走就走的旅行（按3000元/次计算）</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* 毒鸡汤 */}
            <Card className="p-4 bg-destructive/10 border-destructive/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="font-medium text-foreground">AI劝败分析</h3>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {aiAnalysis}
              </p>
            </Card>

            {/* 清醒一下 */}
            <Card className="p-4 bg-warning-yellow-light border-warning-yellow/20">
              <h3 className="font-medium text-foreground mb-3">清醒一下</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 你的工资卡余额正在偷偷哭泣</p>
                <p>• 这些钱够你买多少顿外卖了？</p>
                <p>• 买了之后真的会用吗？还是又要吃灰？</p>
                <p>• 省下来的钱可以做更有意义的事</p>
                <p>• 理性消费，从现在开始</p>
              </div>
            </Card>

            {/* 行动建议 */}
            <Card className="p-4 bg-merit-green-light border-merit-green/20">
              <h3 className="font-medium text-foreground mb-3">💡 建议</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ 把购物车里的商品加入黑名单</p>
                <p>✓ 去"荒漠求生"拔草，培养理性消费习惯</p>
                <p>✓ 邀请好友"劝一刀"，让价格涨到离谱</p>
                <p>✓ 把省下的钱存起来，做更有价值的事</p>
              </div>
            </Card>
          </>
        )}

        {/* 底部按钮 */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/desert')}
          >
            去拔草
          </Button>
          <Button
            className="pdd-button"
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
