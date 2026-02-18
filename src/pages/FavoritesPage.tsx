import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 从localStorage加载收藏数据
  useEffect(() => {
    const loadFavorites = () => {
      const favData = localStorage.getItem('favorites');
      if (favData) {
        setFavorites(JSON.parse(favData));
      }
    };

    loadFavorites();

    // 监听storage事件
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadFavorites, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === favorites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(favorites.map(p => p.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      toast.error('请先选择要删除的商品');
      return;
    }
    const newFavorites = favorites.filter(p => !selectedIds.includes(p.id));
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    window.dispatchEvent(new Event('storage'));
    setSelectedIds([]);
    toast.success(`已删除 ${selectedIds.length} 件商品`);
  };

  const handleMoveToBlacklist = () => {
    if (selectedIds.length === 0) {
      toast.error('请先选择要移动的商品');
      return;
    }
    
    // 获取要移动的商品
    const itemsToMove = favorites.filter(p => selectedIds.includes(p.id));
    
    // 从收藏中删除
    const newFavorites = favorites.filter(p => !selectedIds.includes(p.id));
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // 添加到黑名单
    const blacklistData = localStorage.getItem('blacklist');
    const blacklist = blacklistData ? JSON.parse(blacklistData) : [];
    const newBlacklist = [...blacklist, ...itemsToMove];
    localStorage.setItem('blacklist', JSON.stringify(newBlacklist));
    
    window.dispatchEvent(new Event('storage'));
    setSelectedIds([]);
    toast.success(`已将 ${selectedIds.length} 件商品移至黑名单，帮你远离诱惑！`);
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
          <h1 className="text-lg font-bold text-foreground">我的收藏</h1>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSelectAll}
          >
            {selectedIds.length === favorites.length ? '取消' : '全选'}
          </Button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Heart className="w-20 h-20 text-muted-foreground" />
          <p className="text-muted-foreground">暂无收藏</p>
          <p className="text-sm text-merit-green">很好，说明你很理性！</p>
          <Button onClick={() => navigate('/')}>去首页看看</Button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* 提示卡片 */}
          <Card className="p-4 bg-warning-yellow-light border-warning-yellow/20">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium mb-1">
                  理性消费提示
                </p>
                <p className="text-sm text-muted-foreground">
                  收藏不等于需要。建议将不必要的商品移至黑名单，远离消费诱惑。
                </p>
              </div>
            </div>
          </Card>

          {/* 商品列表 */}
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((product) => (
              <div key={product.id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedIds.includes(product.id)}
                    onCheckedChange={() => handleSelect(product.id)}
                    className="bg-background"
                  />
                </div>
                <ProductCard product={product} />
              </div>
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
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除
                </Button>
                <Button
                  className="bg-merit-green hover:bg-merit-green/90 text-white"
                  onClick={handleMoveToBlacklist}
                >
                  移至黑名单
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
