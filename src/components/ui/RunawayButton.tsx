import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface RunawayButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function RunawayButton({ 
  onClick, 
  children, 
  className = '',
  disabled = false 
}: RunawayButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [attempts, setAttempts] = useState(0);

  // 计算新的随机位置
  const getRandomPosition = () => {
    if (!containerRef.current || !buttonRef.current) return { x: 0, y: 0 };

    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();

    // 获取可移动的范围
    const maxX = container.width - button.width - 20;
    const maxY = container.height - button.height - 20;

    // 生成随机位置，确保不会太靠近边缘
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    return { x, y };
  };

  // 处理鼠标进入或触摸事件
  const handleInteraction = (e?: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    
    // 阻止默认行为
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setAttempts(prev => prev + 1);
    
    // 按钮立即消失
    setIsVisible(false);
    
    // 短暂延迟后在新位置出现
    setTimeout(() => {
      const newPos = getRandomPosition();
      setPosition(newPos);
      setIsVisible(true);
    }, 200);
  };

  // 处理鼠标进入事件
  const handleMouseEnter = (e: React.MouseEvent) => {
    handleInteraction(e);
  };

  // 处理触摸事件（移动端）
  const handleTouchStart = (e: React.TouchEvent) => {
    handleInteraction(e);
  };

  // 处理点击事件（如果用户真的点到了）
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // 如果用户尝试了很多次，给予奖励
    if (attempts >= 15) {
      onClick?.();
    } else {
      // 否则继续逃跑
      handleInteraction(e);
    }
  };

  useEffect(() => {
    // 初始化容器引用
    if (buttonRef.current && !containerRef.current) {
      const parent = buttonRef.current.parentElement;
      if (parent) {
        containerRef.current = parent as HTMLDivElement;
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full"
      style={{ minHeight: '48px' }}
    >
      <Button
        ref={buttonRef}
        className={`${className} transition-all duration-200 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
        {attempts > 0 && attempts < 15 && (
          <span className="ml-2 text-xs">😏</span>
        )}
      </Button>
      
      {/* 提示文字 */}
      {attempts > 0 && attempts < 15 && (
        <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-muted-foreground animate-pulse">
          {attempts < 3 && '碰到我就消失哦！'}
          {attempts >= 3 && attempts < 6 && '哈哈，抓不到我吧？'}
          {attempts >= 6 && attempts < 10 && '理性消费，从放弃结算开始'}
          {attempts >= 10 && attempts < 15 && `再试${15 - attempts}次...也许会成功？`}
        </div>
      )}
      
      {attempts >= 15 && (
        <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-merit-green animate-pulse">
          好吧，你的毅力打动了我...但你确定要买吗？
        </div>
      )}
    </div>
  );
}
