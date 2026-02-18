import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/app';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  // 格式化已售数量
  const formatSoldCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万+`;
    }
    return `${count}+`;
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow rounded-lg border-border"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* 省点吧标签 - 直角 */}
        <Badge className="absolute top-1 left-1 bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded-none font-medium">
          省点吧
        </Badge>
        {product.slashCount > 0 && (
          <Badge className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-none">
            已被劝{product.slashCount}刀
          </Badge>
        )}
      </div>
      <div className="p-2 space-y-1">
        <h3 className="text-sm line-clamp-2 text-foreground leading-tight min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-muted-foreground">券后</span>
          <span className="text-xs text-secondary">¥</span>
          <span className="text-xl font-bold text-secondary leading-none">
            {product.currentPrice}
          </span>
          {product.currentPrice > product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through ml-1">
              ¥{product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {product.currentPrice > product.originalPrice ? (
            <Badge className="bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded-none font-medium">
              返{product.currentPrice - product.originalPrice}元
            </Badge>
          ) : (
            <Badge className="bg-secondary text-secondary-foreground text-xs px-1.5 py-0.5 rounded-none font-medium">
              {product.couponCount || 0}券
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            已售{formatSoldCount(product.soldCount)}
          </span>
        </div>
      </div>
    </Card>
  );
}
