import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: 'bill' | 'warning';
  text: string;
  emoji: string;
}

export default function MoneyFirewall() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const itemIdRef = useRef(0);

  const billTexts = [
    { text: '花呗账单', emoji: '💳' },
    { text: '信用卡账单', emoji: '💸' },
    { text: '房贷提醒', emoji: '🏠' },
    { text: '车贷提醒', emoji: '🚗' },
    { text: '网购订单', emoji: '📦' },
    { text: '外卖账单', emoji: '🍔' },
    { text: '游戏充值', emoji: '🎮' },
    { text: '直播打赏', emoji: '💝' }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    // 倒计时
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          toast.success(`游戏结束！你成功拦截了 ${score} 个账单提醒`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 生成掉落物
    const spawner = setInterval(() => {
      const randomBill = billTexts[Math.floor(Math.random() * billTexts.length)];
      const newItem: FallingItem = {
        id: itemIdRef.current++,
        x: Math.random() * 80 + 10, // 10% - 90%
        y: -10,
        type: Math.random() > 0.3 ? 'bill' : 'warning',
        text: randomBill.text,
        emoji: randomBill.emoji
      };
      setFallingItems((prev) => [...prev, newItem]);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
    };
  }, [isPlaying, score]);

  useEffect(() => {
    if (!isPlaying) return;

    const animation = setInterval(() => {
      setFallingItems((prev) => {
        return prev
          .map((item) => ({ ...item, y: item.y + 2 }))
          .filter((item) => item.y < 100); // 移除超出屏幕的
      });
    }, 50);

    return () => clearInterval(animation);
  }, [isPlaying]);

  const handleClickItem = (id: number) => {
    setFallingItems((prev) => prev.filter((item) => item.id !== id));
    setScore((prev) => prev + 1);
  };

  const handleStart = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setFallingItems([]);
    itemIdRef.current = 0;
  };

  return (
    <div className="space-y-4">
      {/* 游戏说明 */}
      <Card className="p-4 bg-gradient-to-r from-destructive/10 to-warning-yellow-light border-destructive/20">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🧨</div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-1">压岁钱防火墙</h3>
            <p className="text-sm text-muted-foreground">
              模拟拼多多的红包雨，但掉下来的不是红包，而是账单提醒！快速点击拦截它们，守护你的压岁钱！
            </p>
          </div>
        </div>
      </Card>

      {/* 游戏区域 */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-gradient-to-b from-secondary/10 to-background border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-secondary text-secondary-foreground px-3 py-1">
                拦截: {score}
              </Badge>
              <Badge className="bg-destructive text-destructive-foreground px-3 py-1">
                时间: {timeLeft}s
              </Badge>
            </div>
            {!isPlaying && (
              <Button
                className="pdd-button"
                onClick={handleStart}
              >
                {score > 0 ? '再玩一次' : '开始游戏'}
              </Button>
            )}
          </div>
        </div>

        <div
          ref={gameAreaRef}
          className="relative h-96 bg-gradient-to-b from-background to-muted overflow-hidden"
        >
          {!isPlaying && score === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">🧧</div>
              <p className="text-lg font-medium text-foreground mb-2">
                准备好了吗？
              </p>
              <p className="text-sm text-muted-foreground">
                点击"开始游戏"，拦截掉落的账单提醒
              </p>
            </div>
          )}

          {!isPlaying && score > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-2xl font-bold text-foreground mb-2">
                游戏结束！
              </p>
              <p className="text-lg text-secondary mb-4">
                成功拦截 {score} 个账单
              </p>
              <p className="text-sm text-muted-foreground">
                你的压岁钱保住了！
              </p>
            </div>
          )}

          {/* 掉落的账单 */}
          {fallingItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClickItem(item.id)}
              className="absolute transition-none cursor-pointer hover:scale-110 active:scale-95"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                item.type === 'bill' 
                  ? 'bg-destructive/90 text-destructive-foreground' 
                  : 'bg-warning-yellow text-warning-yellow-foreground'
              }`}>
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-medium whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* 游戏提示 */}
      <Card className="p-4 bg-merit-green-light border-merit-green/20">
        <h3 className="font-medium text-foreground mb-2">💡 游戏提示</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 快速点击掉落的账单提醒来拦截它们</li>
          <li>• 30秒内拦截越多，分数越高</li>
          <li>• 红色账单：花呗、信用卡等消费账单</li>
          <li>• 黄色警告：房贷、车贷等大额支出</li>
        </ul>
      </Card>
    </div>
  );
}
