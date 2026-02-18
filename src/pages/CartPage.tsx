import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import BottomNav from '@/components/layouts/BottomNav';
import RunawayButton from '@/components/ui/RunawayButton';

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);

  // 从localStorage加载购物车数据
  useEffect(() => {
    const loadCart = () => {
      const cartData = localStorage.getItem('shopping_cart');
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
    };

    loadCart();

    // 监听storage事件，实时更新购物车
    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 使用轮询作为备用方案
    const interval = setInterval(loadCart, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 保存购物车到localStorage
  const saveCart = (items: any[]) => {
    localStorage.setItem('shopping_cart', JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new Event('storage'));
  };

  const handleSelectAll = (checked: boolean) => {
    const updatedItems = cartItems.map(item => ({ ...item, selected: checked }));
    saveCart(updatedItems);
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, selected: checked } : item
    );
    saveCart(updatedItems);
  };

  const handleDelete = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast.error('请先选择要删除的商品');
      return;
    }
    
    // 计算省下的金额
    const savedAmount = selectedItems.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
    const productNames = selectedItems.map(item => item.name).join('、');
    
    const updatedItems = cartItems.filter(item => !item.selected);
    saveCart(updatedItems);
    
    // 跳转到断念后的余韵页面
    navigate('/afterglow', {
      state: {
        productName: productNames,
        savedAmount
      }
    });
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    saveCart(updatedItems);
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      toast.error('请先选择要结算的商品');
      return;
    }
    toast.error('冷静！你真的需要这些吗？');
  };

  const selectedCount = cartItems.filter(item => item.selected).length;
  const totalPrice = cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background pb-32">
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
          <h1 className="text-lg font-bold text-foreground">购物车</h1>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            删除
          </Button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <ShoppingBag className="w-20 h-20 text-muted-foreground" />
          <p className="text-muted-foreground">购物车是空的</p>
          <p className="text-sm text-merit-green">恭喜你，又省下一笔钱！</p>
          <Button onClick={() => navigate('/')}>去首页看看</Button>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {/* 必需品提醒 */}
          <Card className="p-4 bg-warning-yellow-light border-warning-yellow/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-warning-yellow flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-base text-foreground font-bold mb-2">
                  ⚠️ 请确认这些真的是必需品才购买！
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  • 必需品：生活必需、无法替代、马上要用
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  • 非必需品：想要但不需要、有替代品、可以延后
                </p>
                <p className="text-sm text-destructive font-medium mt-2">
                  冲动消费是贫穷的开始，三思而后买！
                </p>
              </div>
            </div>
          </Card>

          {/* 劝败提示 */}
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💸</div>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium mb-1">
                  冷静提示
                </p>
                <p className="text-sm text-muted-foreground">
                  这些钱够你买 {Math.floor(totalPrice / 30)} 顿外卖了，还要买这些？
                </p>
              </div>
            </div>
          </Card>

          {/* 购物车商品 */}
          {cartItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-3">
                <Checkbox
                  checked={item.selected}
                  onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                />
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                />
                <div className="flex-1">
                  <h3 className="text-sm text-foreground line-clamp-2 mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-secondary">
                      ¥{item.currentPrice}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        -
                      </Button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* 建议 */}
          <Card className="p-4 bg-merit-green-light border-merit-green/20">
            <h3 className="font-medium text-foreground mb-2">💡 建议</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 把这些商品加入黑名单，远离诱惑</li>
              <li>• 去"劝一刀"让价格涨到离谱</li>
              <li>• 去"百亿愧疚"看看能省多少钱</li>
            </ul>
          </Card>
        </div>
      )}

      {/* 底部结算栏 */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedCount === cartItems.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-foreground">全选</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                已选 {selectedCount} 件
              </p>
              <p className="text-lg font-bold text-secondary">
                ¥{totalPrice}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/guilt')}
            >
              查看愧疚值
            </Button>
            <div className="relative h-12">
              <RunawayButton
                className="pdd-button w-full"
                onClick={handleCheckout}
                disabled={selectedCount === 0}
              >
                结算
              </RunawayButton>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
