import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Unlock, Trash2, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function BlacklistPage() {
  const navigate = useNavigate();
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 从localStorage加载黑名单数据
  useEffect(() => {
    const loadBlacklist = () => {
      const blacklistData = localStorage.getItem('blacklist');
      if (blacklistData) {
        setBlacklist(JSON.parse(blacklistData));
      }
    };

    loadBlacklist();

    // 监听storage事件
    const handleStorageChange = () => {
      loadBlacklist();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadBlacklist, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === blacklist.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(blacklist.map(p => p.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemove = () => {
    if (selectedIds.length === 0) {
      toast.error('请先选择要移除的商品');
      return;
    }
    const newBlacklist = blacklist.filter(p => !selectedIds.includes(p.id));
    setBlacklist(newBlacklist);
    localStorage.setItem('blacklist', JSON.stringify(newBlacklist));
    window.dispatchEvent(new Event('storage'));
    setSelectedIds([]);
    toast.success(`已移除 ${selectedIds.length} 件商品`);
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      toast.error('请先选择要删除的商品');
      return;
    }
    const newBlacklist = blacklist.filter(p => !selectedIds.includes(p.id));
    setBlacklist(newBlacklist);
    localStorage.setItem('blacklist', JSON.stringify(newBlacklist));
    window.dispatchEvent(new Event('storage'));
    setSelectedIds([]);
    toast.success(`已删除 ${selectedIds.length} 件商品`);
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
          <h1 className="text-lg font-bold text-foreground">我的黑名单</h1>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSelectAll}
          >
            {selectedIds.length === blacklist.length ? '取消' : '全选'}
          </Button>
        </div>
      </div>

      {blacklist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Ban className="w-20 h-20 text-muted-foreground" />
          <p className="text-muted-foreground">黑名单是空的</p>
          <p className="text-sm text-muted-foreground text-center px-8">
            将不需要的商品加入黑名单，帮你远离消费诱惑
          </p>
          <Button onClick={() => navigate('/')}>去首页看看</Button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* 统计卡片 */}
          <Card className="p-4 bg-merit-green-light border-merit-green/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">黑名单商品</p>
                <p className="text-3xl font-bold text-merit-green">{blacklist.length}</p>
              </div>
              <div className="text-5xl">🛡️</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              已帮你屏蔽 {blacklist.length} 件商品，远离消费诱惑
            </p>
          </Card>

          {/* 提示卡片 */}
          <Card className="p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium mb-1">
                  黑名单说明
                </p>
                <p className="text-sm text-muted-foreground">
                  黑名单中的商品将不会在首页推荐中出现，帮助你保持理性消费。
                </p>
              </div>
            </div>
          </Card>

          {/* 商品列表 */}
          <div className="space-y-3">
            {blacklist.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex gap-3">
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => handleSelect(product.id)}
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm text-foreground line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-muted-foreground line-through">
                        ¥{product.currentPrice}
                      </span>
                      <Badge variant="secondary" className="bg-merit-green text-white">
                        已屏蔽
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 操作按钮 */}
          {selectedIds.length > 0 && (
            <div className="fixed bottom-4 left-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg">
              <p className="text-sm text-muted-foreground mb-3 text-center">
                已选择 {selectedIds.length} 件商品
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleRemove}
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  移出黑名单
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
