import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, TrendingUp, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { mockProducts, dissuasionComments } from '@/data/mockData';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';
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

export default function SlashPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [slashRecords, setSlashRecords] = useState<SlashRecord[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ name: '', amount: 0, comment: '' });
  const [countdown, setCountdown] = useState(24 * 60 * 60);
  const [sessionId, setSessionId] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');

  // 初始化会话
  useEffect(() => {
    if (!id) return;

    const foundProduct = mockProducts.find(p => p.id === id);
    if (!foundProduct) return;

    setProduct(foundProduct);

    // 生成或加载会话ID
    const existingSessionId = localStorage.getItem(`slash_session_id_${id}`);
    let newSessionId: string;

    if (existingSessionId) {
      newSessionId = existingSessionId;
      // 加载已有会话数据
      const savedSession = localStorage.getItem(`slash_session_${existingSessionId}`);
      if (savedSession) {
        const sessionData: SlashSession = JSON.parse(savedSession);
        setCurrentPrice(sessionData.currentPrice);
        setSlashRecords(sessionData.records || []);
      }
    } else {
      // 创建新会话
      newSessionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(`slash_session_id_${id}`, newSessionId);

      // 初始化会话数据
      const sessionData: SlashSession = {
        id: newSessionId,
        productId: id,
        initiatorId: 'user_001',
        initiatorName: '我',
        currentPrice: foundProduct.originalPrice,
        originalPrice: foundProduct.originalPrice,
        records: [],
        createdAt: Date.now()
      };
      localStorage.setItem(`slash_session_${newSessionId}`, JSON.stringify(sessionData));
      setCurrentPrice(foundProduct.originalPrice);
    }

    setSessionId(newSessionId);
    
    // 生成分享链接
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/help-slash?session=${newSessionId}`;
    setShareUrl(url);
  }, [id]);

  // 监听 localStorage 变化，实时更新价格
  useEffect(() => {
    if (!sessionId) return;

    const handleStorageChange = () => {
      const savedSession = localStorage.getItem(`slash_session_${sessionId}`);
      if (savedSession) {
        const sessionData: SlashSession = JSON.parse(savedSession);
        setCurrentPrice(sessionData.currentPrice);
        setSlashRecords(sessionData.records || []);
      }
    };

    // 使用轮询实时更新（因为同一页面的 localStorage 变化不会触发 storage 事件）
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sessionId]);

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSlash = () => {
    if (!product || !sessionId) return;

    const increaseAmount = Math.floor(Math.random() * 100) + 50;
    const newPrice = currentPrice + increaseAmount;
    const friendName = `好友${Math.floor(Math.random() * 100)}`;
    const comment = dissuasionComments[Math.floor(Math.random() * dissuasionComments.length)];

    const newRecord: SlashRecord = {
      id: Date.now(),
      name: friendName,
      amount: increaseAmount,
      comment,
      time: new Date().toLocaleTimeString()
    };

    // 更新会话数据
    const savedSession = localStorage.getItem(`slash_session_${sessionId}`);
    if (savedSession) {
      const sessionData: SlashSession = JSON.parse(savedSession);
      const updatedSession: SlashSession = {
        ...sessionData,
        currentPrice: newPrice,
        records: [newRecord, ...sessionData.records]
      };
      localStorage.setItem(`slash_session_${sessionId}`, JSON.stringify(updatedSession));
    }

    setCurrentPrice(newPrice);
    setSlashRecords([newRecord, ...slashRecords]);
    setDialogContent({ name: friendName, amount: increaseAmount, comment });
    setShowDialog(true);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = () => {
    if (!shareUrl) {
      toast.error('分享链接生成中，请稍候');
      return;
    }

    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('链接已复制！快去分享给好友吧');
      setShowShareDialog(false);
    }).catch(() => {
      // 降级方案：创建临时输入框
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      toast.success('链接已复制！快去分享给好友吧');
      setShowShareDialog(false);
    });
  };

  // 如果没有商品ID，显示商品选择页面
  if (!id) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
          <div className="flex items-center justify-between p-4">
            <Button
              size="icon"
              variant="ghost"
              className="text-secondary-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold">劝一刀</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          <Card className="p-6 text-center bg-gradient-to-br from-secondary/10 to-destructive/5">
            <div className="text-6xl mb-4">🔪</div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              选择一个商品开始劝一刀
            </h2>
            <p className="text-sm text-muted-foreground">
              邀请好友帮你涨价，让价格高到离谱，从而放弃购买
            </p>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {mockProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 如果商品ID存在但找不到商品
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
          <div className="flex items-center justify-between p-4">
            <Button
              size="icon"
              variant="ghost"
              className="text-secondary-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold">劝一刀</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="text-6xl">😕</div>
          <p className="text-muted-foreground">商品不存在</p>
          <Button onClick={() => navigate('/slash')}>重新选择商品</Button>
        </div>
      </div>
    );
  }

  const priceIncreasePercent = ((currentPrice - product.originalPrice) / product.originalPrice) * 100;
  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
        <div className="flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-secondary-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">劝一刀</h1>
          <Button
            size="icon"
            variant="ghost"
            className="text-secondary-foreground"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
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
                  ¥{currentPrice}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  ¥{product.originalPrice}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* 涨价进度 */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">涨价进度</h3>
            <div className="flex items-center gap-1 text-destructive">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+{priceIncreasePercent.toFixed(0)}%</span>
            </div>
          </div>
          <Progress value={Math.min(priceIncreasePercent, 100)} className="h-3" />
          <p className="text-sm text-muted-foreground">
            已涨价 ¥{currentPrice - product.originalPrice}，继续加油！
          </p>
        </Card>

        {/* 倒计时 */}
        <Card className="p-4 bg-warning-yellow-light border-warning-yellow/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">距离活动结束还有</p>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-background px-3 py-2 rounded-lg">
                <span className="text-2xl font-bold text-foreground">{hours.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-xl font-bold text-foreground">:</span>
              <div className="bg-background px-3 py-2 rounded-lg">
                <span className="text-2xl font-bold text-foreground">{minutes.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-xl font-bold text-foreground">:</span>
              <div className="bg-background px-3 py-2 rounded-lg">
                <span className="text-2xl font-bold text-foreground">{seconds.toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 劝一刀按钮 */}
        <div className="space-y-2">
          <Button
            className="w-full h-14 text-lg pdd-button"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 mr-2" />
            邀请好友帮我涨价
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSlash}
          >
            模拟好友劝一刀（测试用）
          </Button>
        </div>

        {/* 劝一刀记录 */}
        {slashRecords.length > 0 && (
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-3">涨价记录</h3>
            <div className="space-y-3">
              {slashRecords.map((record) => (
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
            <li>• 每邀请一位好友，商品价格随机上涨50-150元</li>
            <li>• 好友会发送劝败评论，帮你认清现实</li>
            <li>• 价格涨到离谱时，你就会放弃购买了</li>
            <li>• 这才是真正的"省钱"之道</li>
          </ul>
        </Card>
      </div>

      {/* 分享弹窗 */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">分享给好友</DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <div className="text-6xl">📤</div>
              <p className="text-base text-foreground">
                复制链接分享给微信好友
              </p>
              <p className="text-sm text-muted-foreground">
                好友点击链接后可以帮你劝一刀
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground break-all">
                  {shareUrl}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleCopyLink} className="pdd-button">
            <Copy className="w-4 h-4 mr-2" />
            复制链接
          </Button>
        </DialogContent>
      </Dialog>

      {/* 涨价弹窗 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">🎉 涨价成功！</DialogTitle>
            <DialogDescription className="text-center space-y-3 pt-4">
              <p className="text-base text-foreground">
                你的好友 <span className="font-bold text-secondary">{dialogContent.name}</span> 觉得你并不缺这个垃圾
              </p>
              <p className="text-2xl font-bold text-destructive">
                反手给商品加价了 ¥{dialogContent.amount}
              </p>
              <p className="text-sm text-muted-foreground italic">
                "{dialogContent.comment}"
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
