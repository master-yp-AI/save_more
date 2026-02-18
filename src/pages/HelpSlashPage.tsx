import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { mockProducts } from '@/data/mockData';
import { dissuasionComments } from '@/data/mockData';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SlashRecord {
  id: number;
  name: string;
  amount: number;
  comment: string;
  time: string;
}

interface SlashSession {
  id: string;
  productId: string;
  initiatorId: string;
  initiatorName: string;
  currentPrice: number;
  originalPrice: number;
  records: SlashRecord[];
  createdAt: number;
}

export default function HelpSlashPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const [session, setSession] = useState<SlashSession | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [hasHelped, setHasHelped] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ amount: 0, comment: '' });

  useEffect(() => {
    if (!sessionId) {
      toast.error('无效的分享链接');
      navigate('/');
      return;
    }

    // 从 localStorage 加载会话数据
    const savedSession = localStorage.getItem(`slash_session_${sessionId}`);
    if (!savedSession) {
      toast.error('该劝一刀活动不存在或已过期');
      navigate('/');
      return;
    }

    const sessionData: SlashSession = JSON.parse(savedSession);
    setSession(sessionData);

    // 加载商品信息
    const productData = mockProducts.find(p => p.id === sessionData.productId);
    if (!productData) {
      toast.error('商品不存在');
      navigate('/');
      return;
    }
    setProduct(productData);

    // 检查是否已经帮忙过
    const helpedKey = `slash_helped_${sessionId}`;
    const helped = localStorage.getItem(helpedKey);
    if (helped) {
      setHasHelped(true);
    }
  }, [sessionId, navigate]);

  const handleSlash = () => {
    if (!session || !product || hasHelped) return;

    // 随机涨价金额
    const increaseAmount = Math.floor(Math.random() * 100) + 50;
    const newPrice = session.currentPrice + increaseAmount;
    const friendName = `好友${Math.floor(Math.random() * 100)}`;
    const comment = dissuasionComments[Math.floor(Math.random() * dissuasionComments.length)];

    // 创建新记录
    const newRecord: SlashRecord = {
      id: Date.now(),
      name: friendName,
      amount: increaseAmount,
      comment,
      time: new Date().toLocaleTimeString()
    };

    // 更新会话数据
    const updatedSession: SlashSession = {
      ...session,
      currentPrice: newPrice,
      records: [newRecord, ...session.records]
    };

    // 保存到 localStorage
    localStorage.setItem(`slash_session_${sessionId}`, JSON.stringify(updatedSession));
    
    // 标记已帮忙
    localStorage.setItem(`slash_helped_${sessionId}`, 'true');
    
    setSession(updatedSession);
    setHasHelped(true);
    setDialogContent({ amount: increaseAmount, comment });
    setShowDialog(true);

    // 触发存储事件，通知发起人页面更新
    window.dispatchEvent(new Event('storage'));
  };

  if (!session || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  const priceIncreasePercent = ((session.currentPrice - session.originalPrice) / session.originalPrice) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
        <div className="flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-secondary-foreground"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">帮TA劝一刀</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 邀请信息 */}
        <Card className="p-4 bg-gradient-to-r from-pdd-orange-light to-secondary/10 border-secondary/20">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              你的好友 <span className="font-bold text-foreground">{session.initiatorName}</span>
            </p>
            <p className="text-base text-foreground">
              邀请你帮TA劝一刀，让TA放弃购买这个垃圾
            </p>
            <div className="text-4xl">🎯</div>
          </div>
        </Card>

        {/* 商品信息 */}
        <Card className="p-4">
          <div className="flex gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-sm font-medium text-foreground mb-2 line-clamp-2">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-secondary">
                  ¥{session.currentPrice}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  ¥{session.originalPrice}
                </span>
              </div>
              <div className="flex items-center gap-1 text-destructive mt-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">已涨价 +{priceIncreasePercent.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 劝一刀按钮 */}
        {!hasHelped ? (
          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-destructive/5">
            <div className="text-center space-y-4">
              <div className="text-5xl">💰</div>
              <h3 className="text-lg font-bold text-foreground">
                帮TA涨价，劝TA放弃
              </h3>
              <p className="text-sm text-muted-foreground">
                点击下方按钮，随机涨价 50-150 元
              </p>
              <Button
                className="w-full h-14 text-lg pdd-button"
                onClick={handleSlash}
              >
                点此劝一刀
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-merit-green-light border-merit-green/20">
            <div className="text-center space-y-3">
              <div className="text-5xl">✅</div>
              <h3 className="text-lg font-bold text-foreground">
                劝一刀成功！
              </h3>
              <p className="text-sm text-muted-foreground">
                你已经帮TA涨价了，希望TA能理性消费
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                返回首页
              </Button>
            </div>
          </Card>
        )}

        {/* 涨价记录 */}
        {session.records.length > 0 && (
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-3">涨价记录</h3>
            <div className="space-y-3">
              {session.records.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                  <Avatar className="w-10 h-10 bg-muted" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{record.name}</span>
                      <span className="text-sm text-destructive font-medium">+¥{record.amount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{record.comment}</p>
                    <p className="text-xs text-muted-foreground">{record.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 说明 */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-medium text-foreground mb-2">活动说明</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 每个好友只能帮忙劝一刀一次</li>
            <li>• 每次劝一刀会随机涨价 50-150 元</li>
            <li>• 价格越高，越能劝TA放弃购买</li>
            <li>• 帮助朋友理性消费，功德无量</li>
          </ul>
        </Card>
      </div>

      {/* 涨价弹窗 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">🎉 劝一刀成功！</DialogTitle>
            <DialogDescription className="text-center space-y-3 pt-4">
              <p className="text-base text-foreground">
                你成功帮 <span className="font-bold text-secondary">{session.initiatorName}</span> 涨价了
              </p>
              <p className="text-2xl font-bold text-destructive">
                +¥{dialogContent.amount}
              </p>
              <p className="text-sm text-muted-foreground italic">
                "{dialogContent.comment}"
              </p>
              <p className="text-xs text-muted-foreground">
                希望TA能理性消费，不要冲动购物
              </p>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowDialog(false)} className="pdd-button">
            我知道了
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
