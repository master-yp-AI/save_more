import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, ShoppingCart, AlertTriangle, Ban, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { mockProducts } from '@/data/mockData';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find((p) => p.id === id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewTime, setViewTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // 计算浏览时间
  useEffect(() => {
    const timer = setInterval(() => {
      setViewTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 加载购物车数量
  useEffect(() => {
    const loadCartCount = () => {
      const cartData = localStorage.getItem('shopping_cart');
      if (cartData) {
        const cart = JSON.parse(cartData);
        const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(count);
      }
    };

    loadCartCount();

    // 监听storage事件
    const handleStorageChange = () => {
      loadCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadCartCount, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 浏览超过10秒显示警告
  useEffect(() => {
    if (viewTime >= 10) {
      setShowWarning(true);
    }
  }, [viewTime]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">商品不存在</p>
      </div>
    );
  }

  const handleSlash = () => {
    navigate(`/slash/${product.id}`);
  };

  const handleAddToBlacklist = () => {
    // 跳转到断念后的余韵页面
    navigate('/afterglow', {
      state: {
        productName: product.name,
        savedAmount: product.currentPrice
      }
    });
  };

  const handleAddToCart = () => {
    // 从localStorage获取购物车数据
    const cartData = localStorage.getItem('shopping_cart');
    const cart = cartData ? JSON.parse(cartData) : [];

    // 检查商品是否已在购物车中
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      // 如果已存在，增加数量
      existingItem.quantity += 1;
      toast.success('数量 +1', {
        description: '已增加购物车中该商品的数量',
        duration: 2000
      });
    } else {
      // 如果不存在，添加新商品
      cart.push({
        ...product,
        quantity: 1,
        selected: false
      });
      toast.success('✅ 已加入购物车', {
        description: '但请确认这真的是必需品！',
        duration: 3000,
        action: {
          label: '去查看',
          onClick: () => navigate('/cart')
        }
      });
    }

    // 保存到localStorage
    localStorage.setItem('shopping_cart', JSON.stringify(cart));

    // 触发存储事件，通知其他页面更新
    window.dispatchEvent(new Event('storage'));

    // 显示成功弹窗
    setShowCartDialog(true);
    setTimeout(() => {
      setShowCartDialog(false);
    }, 2000);
  };

  // 计算这笔钱可以买多少顿外卖
  const mealsCount = Math.floor(product.currentPrice / 30);
  
  // 计算如果存起来一年后的价值（假设年化收益3%）
  const yearlyValue = (product.currentPrice * 1.03).toFixed(2);

  // 生成劝败理由
  const dissuasionReasons = [
    `这笔钱够你吃${mealsCount}顿外卖了`,
    `买了之后90%的概率会吃灰`,
    `存起来一年后能变成¥${yearlyValue}`,
    `你家里可能已经有类似的东西了`,
    `冲动消费是贫穷的开始`,
  ];

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-8">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setIsFavorite(!isFavorite);
                if (!isFavorite) {
                  toast.error('收藏了也不代表你需要买！');
                }
              }}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* 浏览时间警告 */}
      {showWarning && (
        <div className="sticky top-16 z-40 bg-destructive text-destructive-foreground p-3 animate-pulse">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              你已经看了{viewTime}秒了！冷静一下，这真的是必需品吗？
            </span>
          </div>
        </div>
      )}

      {/* 商品图片轮播 */}
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="aspect-square bg-muted relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* 图片上的劝败水印 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-6xl opacity-10 rotate-[-30deg]">
                  三思而后买
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* 商品信息 */}
      <div className="p-4 space-y-4">
        <Card className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-secondary">
                  ¥{product.currentPrice}
                </span>
                {product.currentPrice > product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ¥{product.originalPrice}
                  </span>
                )}
                <Badge variant="outline" className="ml-2">
                  已被{Math.floor(Math.random() * 100)}人劝退
                </Badge>
              </div>
              {product.slashCount > 0 && (
                <Badge variant="destructive" className="mb-2">
                  已被劝{product.slashCount}刀，涨价¥{product.currentPrice - product.originalPrice}
                </Badge>
              )}
            </div>
          </div>
          <h1 className="text-lg font-medium text-foreground">{product.name}</h1>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </Card>

        {/* 劝败提示 - 增强版 */}
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <div className="flex items-start gap-3">
            <div className="text-3xl">⚠️</div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-2">冷静提示</h3>
              <ul className="space-y-1.5">
                {dissuasionReasons.map((reason, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* 理性消费计算器 */}
        <Card className="p-4 bg-merit-green-light border-merit-green/20">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <span>💰</span>
            <span>理性消费计算器</span>
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">这笔钱可以买</span>
              <span className="text-foreground font-medium">{mealsCount}顿外卖</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">或者坐</span>
              <span className="text-foreground font-medium">{Math.floor(product.currentPrice / 3)}次地铁</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">存一年后价值</span>
              <span className="text-merit-green font-medium">¥{yearlyValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">买了后使用率预测</span>
              <span className="text-destructive font-medium">{Math.floor(Math.random() * 20)}%</span>
            </div>
          </div>
        </Card>

        {/* 用户劝退评论 */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">用户劝退评论</h3>
          <div className="space-y-3">
            {[
              { user: '理性消费者', comment: '我买了同款，现在在吃灰，别重蹈覆辙！', time: '2小时前' },
              { user: '省钱达人', comment: '这玩意儿没用，纯属智商税', time: '5小时前' },
              { user: '过来人', comment: '买了就后悔系列，劝你三思', time: '1天前' },
            ].map((item, index) => (
              <div key={index} className="border-b border-border pb-3 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{item.user}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.comment}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 商品详情 */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-3">商品详情</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">分类</span>
              <span className="text-foreground">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">原价</span>
              <span className="text-foreground">¥{product.originalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">当前价格</span>
              <span className="text-secondary font-medium">¥{product.currentPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">浏览时长</span>
              <span className="text-destructive font-medium">{viewTime}秒（浪费生命中）</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
            {cartCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-secondary-foreground text-xs"
              >
                {cartCount}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleAddToBlacklist}
          >
            <Ban className="w-4 h-4 mr-2" />
            加入黑名单
          </Button>
          <Button
            className="flex-1 pdd-button"
            onClick={handleSlash}
          >
            劝一刀（涨价）
          </Button>
        </div>
      </div>

      {/* 加入购物车成功弹窗 */}
      <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-merit-green-light flex items-center justify-center">
                <Check className="w-6 h-6 text-merit-green" />
              </div>
            </DialogTitle>
            <DialogDescription className="text-center space-y-3 pt-2">
              <p className="text-lg font-bold text-foreground">
                已加入购物车
              </p>
              <p className="text-sm text-muted-foreground">
                但请确认这真的是必需品才购买！
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowCartDialog(false)}
            >
              继续逛逛
            </Button>
            <Button
              className="flex-1 pdd-button"
              onClick={() => {
                setShowCartDialog(false);
                navigate('/cart');
              }}
            >
              去购物车
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
