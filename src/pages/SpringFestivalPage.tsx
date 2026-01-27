import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import MoneyFirewall from '@/components/festival/MoneyFirewall';
import SpringBill from '@/components/festival/SpringBill';

export default function SpringFestivalPage() {
  const navigate = useNavigate();
  const posterRef = useRef<HTMLDivElement>(null);
  const [income, setIncome] = useState('');
  const [debt, setDebt] = useState('');
  const [savings, setSavings] = useState('');
  const [posterGenerated, setPosterGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState<'poster' | 'firewall' | 'bill'>('poster');
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleShare = async () => {
    if (!posterRef.current) {
      toast.error('海报未生成');
      return;
    }
    
    toast.loading('正在生成分享图片...');
    
    try {
      const canvas = await html2canvas(posterRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.dismiss();
          toast.error('生成图片失败');
          return;
        }
        
        const file = new File([blob], '省点吧-春节海报.png', { type: 'image/png' });
        
        // 优先尝试 Web Share API
        if (navigator.share) {
          try {
            // 检查是否支持文件分享
            const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });
            
            if (canShareFiles) {
              await navigator.share({
                files: [file],
                title: '我的2026年度总结',
                text: '今年真的太难了😭'
              });
              toast.dismiss();
              toast.success('分享成功');
              return;
            } else {
              // 不支持文件分享，尝试只分享文本
              await navigator.share({
                title: '我的2026年度总结',
                text: '今年真的太难了😭\n\n来自省点吧春节特辑'
              });
              toast.dismiss();
              toast.info('已分享文本，请手动保存图片后一起发送');
              return;
            }
          } catch (error: any) {
            if (error.name === 'AbortError') {
              toast.dismiss();
              return; // 用户取消分享
            }
            console.error('Web Share API 失败:', error);
          }
        }
        
        // 降级方案1：复制图片到剪贴板
        if (navigator.clipboard && navigator.clipboard.write) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            toast.dismiss();
            toast.success('图片已复制到剪贴板，可以粘贴分享');
            return;
          } catch (error) {
            console.error('复制到剪贴板失败:', error);
          }
        }
        
        // 降级方案2：自动下载图片
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `省点吧-春节海报-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        
        toast.dismiss();
        toast.success('图片已保存，请手动分享');
      }, 'image/png');
    } catch (error) {
      console.error('分享失败:', error);
      toast.dismiss();
      toast.error('分享失败，请使用保存按钮');
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
    </div>
  );
}
