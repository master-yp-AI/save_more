import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Share2, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import MoneyFirewall from '@/components/festival/MoneyFirewall';
import SpringBill from '@/components/festival/SpringBill';

export default function SpringFestivalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const posterRef = useRef<HTMLDivElement>(null);
  const [income, setIncome] = useState('');
  const [debt, setDebt] = useState('');
  const [savings, setSavings] = useState('');
  const [posterGenerated, setPosterGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState<'poster' | 'firewall' | 'bill'>('poster');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  // 处理分享链接参数
  useEffect(() => {
    const fromShare = searchParams.get('from');
    if (fromShare === 'share') {
      const sharedIncome = searchParams.get('income');
      const sharedDebt = searchParams.get('debt');
      const sharedSavings = searchParams.get('savings');
      
      if (sharedIncome && sharedDebt && sharedSavings) {
        setIncome(sharedIncome);
        setDebt(sharedDebt);
        setSavings(sharedSavings);
        setPosterGenerated(true);
        toast.success('已加载好友分享的海报数据');
      }
    }
  }, [searchParams]);

  const handleGenerate = () => {
    if (!income || !debt || !savings) {
      toast.error('请填写完整信息');
      return;
    }
    setPosterGenerated(true);
    toast.success('海报生成成功！');
  };

  const handleReset = () => {
    setIncome('');
    setDebt('');
    setSavings('');
    setPosterGenerated(false);
  };

  const handleDownload = async () => {
    if (!posterRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `省点吧-春节海报-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('海报已保存到本地');
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    // 生成分享链接（包含海报数据）
    const posterData = {
      income,
      debt,
      savings,
      timestamp: Date.now()
    };
    
    // 将数据编码到URL参数中
    const params = new URLSearchParams({
      income,
      debt,
      savings
    });
    
    // 生成完整的分享链接
    const baseUrl = window.location.origin + window.location.pathname;
    const fullShareLink = `${baseUrl}?from=share&${params.toString()}`;
    
    setShareLink(fullShareLink);
    setShowShareDialog(true);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('链接已复制到剪贴板');
      
      // 3秒后重置复制状态
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      toast.error('复制失败，请手动复制');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-4">
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
          <h1 className="text-lg font-bold">春节特辑</h1>
          <div className="w-10" />
        </div>
        
        {/* 标签切换 */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <Button
            size="sm"
            variant={activeTab === 'poster' ? 'default' : 'ghost'}
            className={activeTab === 'poster' ? 'bg-secondary-foreground text-secondary' : 'text-secondary-foreground'}
            onClick={() => setActiveTab('poster')}
          >
            🧧 贫困海报
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'firewall' ? 'default' : 'ghost'}
            className={activeTab === 'firewall' ? 'bg-secondary-foreground text-secondary' : 'text-secondary-foreground'}
            onClick={() => setActiveTab('firewall')}
          >
            🧨 压岁钱防火墙
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'bill' ? 'default' : 'ghost'}
            className={activeTab === 'bill' ? 'bg-secondary-foreground text-secondary' : 'text-secondary-foreground'}
            onClick={() => setActiveTab('bill')}
          >
            🎊 消费账单
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 贫困潦倒海报 */}
        {activeTab === 'poster' && (
          <>
        {/* 说明卡片 */}
        <Card className="p-4 bg-gradient-to-r from-pdd-orange-light to-secondary/10 border-secondary/20">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🧧</div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">亲戚互怼模式</h3>
              <p className="text-sm text-muted-foreground">
                春节期间，如果亲戚问你挣多少钱，生成一个穷困潦倒海报，发到朋友圈，让大家都不敢找你借钱。
              </p>
            </div>
          </div>
        </Card>

        {!posterGenerated ? (
          <>
            {/* 输入表单 */}
            <Card className="p-4 space-y-4">
              <h3 className="font-medium text-foreground">填写你的"惨状"</h3>
              
              <div className="space-y-2">
                <Label htmlFor="income">年收入（元）</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="越少越好"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="debt">负债（元）</Label>
                <Input
                  id="debt"
                  type="number"
                  placeholder="越多越好"
                  value={debt}
                  onChange={(e) => setDebt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="savings">存款（元）</Label>
                <Input
                  id="savings"
                  type="number"
                  placeholder="建议填0"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value)}
                />
              </div>
            </Card>

            {/* 生成按钮 */}
            <Button
              className="w-full h-12 pdd-button"
              onClick={handleGenerate}
            >
              生成穷困潦倒海报
            </Button>

            {/* 示例 */}
            <Card className="p-4 bg-muted/50">
              <h3 className="font-medium text-foreground mb-2">使用场景</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 亲戚问："今年挣了多少钱啊？"</li>
                <li>• 亲戚问："什么时候买房啊？"</li>
                <li>• 亲戚问："能不能借我点钱？"</li>
                <li>• 朋友圈发布后，效果拔群</li>
              </ul>
            </Card>
          </>
        ) : (
          <>
            {/* 生成的海报 */}
            <Card className="overflow-hidden">
              <div 
                ref={posterRef}
                className="relative aspect-[3/4] bg-gradient-to-br from-destructive/20 via-warning-yellow-light to-muted"
              >
                <img
                  src="https://miaoda-image.cdn.bcebos.com/img/corpus/d097e8ee7dbb4a3483e51c7f33e0fabc.jpg"
                  alt="春节背景"
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="text-6xl">😭</div>
                  <h2 className="text-3xl font-bold text-foreground">
                    2026年度总结
                  </h2>
                  
                  <div className="space-y-4 w-full">
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">年收入</p>
                      <p className="text-2xl font-bold text-foreground">¥{income}</p>
                    </div>
                    
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">负债</p>
                      <p className="text-2xl font-bold text-destructive">¥{debt}</p>
                    </div>
                    
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">存款</p>
                      <p className="text-2xl font-bold text-muted-foreground">¥{savings}</p>
                    </div>
                  </div>

                  <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg w-full">
                    <p className="text-sm text-foreground italic">
                      "今年真的太难了，别问我借钱了"
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    来自省点吧 · 春节特辑
                  </p>
                </div>
              </div>
            </Card>

            {/* 操作按钮 */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isDownloading}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                重新生成
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-1" />
                {isDownloading ? '保存中...' : '保存'}
              </Button>
              <Button
                className="pdd-button"
                onClick={handleShare}
                disabled={isDownloading}
              >
                <Share2 className="w-4 h-4 mr-1" />
                分享
              </Button>
            </div>

            {/* 使用提示 */}
            <Card className="p-4 bg-merit-green-light border-merit-green/20">
              <h3 className="font-medium text-foreground mb-2">💡 使用提示</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 发到朋友圈，让亲戚看到你的"惨状"</li>
                <li>• 配文："今年真的太难了😭"</li>
                <li>• 效果：亲戚不敢再问你借钱了</li>
                <li>• 副作用：可能会收到红包安慰</li>
              </ul>
            </Card>
          </>
        )}
        </>
        )}

        {/* 压岁钱防火墙 */}
        {activeTab === 'firewall' && <MoneyFirewall />}

        {/* 春节消费账单 */}
        {activeTab === 'bill' && <SpringBill />}
      </div>

      {/* 分享对话框 */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-secondary" />
              分享海报
            </DialogTitle>
            <DialogDescription>
              复制链接分享给好友，让他们也来生成自己的贫困潦倒海报
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 分享链接 */}
            <div className="space-y-2">
              <Label>分享链接</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1 text-sm"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button
                  size="icon"
                  variant={copied ? 'default' : 'outline'}
                  onClick={handleCopyLink}
                  className={copied ? 'bg-merit-green hover:bg-merit-green' : ''}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* 分享说明 */}
            <Card className="p-4 bg-gradient-to-r from-secondary/10 to-primary/10">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                裂变玩法
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 好友点击链接可以看到你的"惨状"</li>
                <li>• 好友也可以生成自己的海报</li>
                <li>• 形成裂变传播，让更多人加入</li>
                <li>• 一起在春节期间"比惨"</li>
              </ul>
            </Card>

            {/* 分享渠道 */}
            <div className="space-y-2">
              <Label>快速分享到</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent('我的2026年度总结，今年真的太难了😭')}`, '_blank');
                  }}
                >
                  <span className="text-xl mr-2">📱</span>
                  微博
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    handleCopyLink();
                    toast.info('请在微信中粘贴链接分享');
                  }}
                >
                  <span className="text-xl mr-2">💬</span>
                  微信
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent('我的2026年度总结')}`, '_blank');
                  }}
                >
                  <span className="text-xl mr-2">🐧</span>
                  QQ
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    handleCopyLink();
                    toast.info('链接已复制，可以分享到任何平台');
                  }}
                >
                  <span className="text-xl mr-2">🔗</span>
                  更多
                </Button>
              </div>
            </div>

            {/* 关闭按钮 */}
            <Button
              className="w-full pdd-button"
              onClick={() => setShowShareDialog(false)}
            >
              我知道了
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
