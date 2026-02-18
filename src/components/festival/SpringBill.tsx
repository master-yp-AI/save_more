import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, TrendingUp, Gift, ShoppingBag, Utensils, Zap } from 'lucide-react';

interface BillItem {
  category: string;
  icon: any;
  amount: number;
  count: number;
  color: string;
}

export default function SpringBill() {
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  useEffect(() => {
    // 从localStorage加载数据
    const afterglowData = localStorage.getItem('afterglow_data');
    const cartData = localStorage.getItem('shopping_cart');
    
    let saved = 0;
    if (afterglowData) {
      const data = JSON.parse(afterglowData);
      saved = data.totalSaved || 0;
    }
    
    let spent = 0;
    if (cartData) {
      const cart = JSON.parse(cartData);
      spent = cart.reduce((sum: number, item: any) => 
        sum + (item.product.currentPrice * item.quantity), 0
      );
    }
    
    setTotalSaved(saved);
    setTotalSpent(spent);
    
    // 模拟春节消费分类数据
    const mockBillItems: BillItem[] = [
      {
        category: '红包支出',
        icon: Gift,
        amount: Math.floor(Math.random() * 2000) + 500,
        count: Math.floor(Math.random() * 10) + 5,
        color: 'text-destructive'
      },
      {
        category: '购物消费',
        icon: ShoppingBag,
        amount: spent,
        count: cartData ? JSON.parse(cartData).length : 0,
        color: 'text-secondary'
      },
      {
        category: '餐饮聚会',
        icon: Utensils,
        amount: Math.floor(Math.random() * 1500) + 300,
        count: Math.floor(Math.random() * 8) + 3,
        color: 'text-warning-yellow'
      },
      {
        category: '娱乐活动',
        icon: Zap,
        amount: Math.floor(Math.random() * 800) + 200,
        count: Math.floor(Math.random() * 5) + 2,
        color: 'text-primary'
      }
    ];
    
    setBillItems(mockBillItems);
  }, []);

  const totalAmount = billItems.reduce((sum, item) => sum + item.amount, 0);
  const netAmount = totalSaved - totalAmount;

  return (
    <div className="space-y-4">
      {/* 说明卡片 */}
      <Card className="p-4 bg-gradient-to-r from-warning-yellow-light to-secondary/10 border-warning-yellow/20">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🎊</div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-1">春节消费账单</h3>
            <p className="text-sm text-muted-foreground">
              统计你在春节期间的消费和省下的钱，看看今年是赚了还是亏了。
            </p>
          </div>
        </div>
      </Card>

      {/* 总览卡片 */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">春节净收支</p>
            <div className="flex items-center justify-center gap-2">
              {netAmount >= 0 ? (
                <TrendingUp className="w-6 h-6 text-merit-green" />
              ) : (
                <TrendingDown className="w-6 h-6 text-destructive" />
              )}
              <p className={`text-4xl font-bold ${
                netAmount >= 0 ? 'text-merit-green' : 'text-destructive'
              }`}>
                {netAmount >= 0 ? '+' : ''}¥{netAmount.toFixed(0)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">省下的钱</p>
              <p className="text-xl font-bold text-merit-green">
                ¥{totalSaved.toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">花掉的钱</p>
              <p className="text-xl font-bold text-destructive">
                ¥{totalAmount.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 消费明细 */}
      <Card className="p-4">
        <h3 className="font-medium text-foreground mb-4">消费明细</h3>
        <div className="space-y-4">
          {billItems.map((item, index) => {
            const Icon = item.icon;
            const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.category}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} 笔消费
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      ¥{item.amount.toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* 省钱建议 */}
      <Card className="p-4 bg-merit-green-light border-merit-green/20">
        <h3 className="font-medium text-foreground mb-3">💡 省钱建议</h3>
        <div className="space-y-2">
          {netAmount >= 0 ? (
            <>
              <div className="flex items-start gap-2">
                <Badge className="bg-merit-green text-merit-green-foreground mt-0.5">优秀</Badge>
                <p className="text-sm text-muted-foreground flex-1">
                  春节期间你成功控制了消费，继续保持理性消费的好习惯！
                </p>
              </div>
              <p className="text-sm text-muted-foreground pl-14">
                建议：把省下的钱存起来，为未来的目标努力。
              </p>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2">
                <Badge className="bg-warning-yellow text-warning-yellow-foreground mt-0.5">提醒</Badge>
                <p className="text-sm text-muted-foreground flex-1">
                  春节消费超支了，接下来要注意控制开销哦。
                </p>
              </div>
              <p className="text-sm text-muted-foreground pl-14">
                建议：使用"省点吧"的劝一刀功能，让朋友帮你劝退不必要的消费。
              </p>
            </>
          )}
        </div>
      </Card>

      {/* 春节消费排行 */}
      <Card className="p-4 bg-gradient-to-r from-secondary/10 to-primary/10">
        <h3 className="font-medium text-foreground mb-3">🏆 你的春节消费排名</h3>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">
            在所有省点吧用户中
          </p>
          <p className="text-3xl font-bold text-secondary mb-2">
            前 {Math.floor(Math.random() * 30) + 10}%
          </p>
          <p className="text-xs text-muted-foreground">
            {netAmount >= 0 
              ? '你比大多数人更会省钱！' 
              : '还有很大的省钱空间哦'}
          </p>
        </div>
      </Card>
    </div>
  );
}
