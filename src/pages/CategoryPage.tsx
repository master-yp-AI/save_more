import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProductCard from '@/components/product/ProductCard';
import BottomNav from '@/components/layouts/BottomNav';
import { mockProducts } from '@/data/mockData';

export default function CategoryPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const categories = [
    { id: 'all', name: '全部', count: mockProducts.length },
    { id: 'electronics', name: '电器', count: mockProducts.filter(p => p.category === '电器').length },
    { id: 'general', name: '百货', count: mockProducts.filter(p => p.category === '百货').length },
    { id: 'phone', name: '手机', count: mockProducts.filter(p => p.category === '手机').length },
    { id: 'shoes', name: '鞋包', count: mockProducts.filter(p => p.category === '鞋包').length },
    { id: 'baby', name: '母婴', count: mockProducts.filter(p => p.category === '母婴').length }
  ];

  const filteredProducts = selectedCategory === '全部'
    ? mockProducts
    : mockProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0 lg:pl-56">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Button
            size="icon"
            variant="ghost"
            className="text-primary-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">商品分类</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* 左侧分类列表 */}
        <div className="w-24 lg:w-40 bg-muted border-r border-border overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`w-full p-4 text-sm border-b border-border transition-colors ${
                selectedCategory === category.name
                  ? 'bg-background text-secondary font-medium border-l-4 border-l-secondary'
                  : 'text-muted-foreground hover:bg-background'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{category.name}</span>
                <span className="text-xs opacity-70">({category.count})</span>
              </div>
            </button>
          ))}
        </div>

        {/* 右侧商品列表 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* 分类标题 */}
            <Card className="p-4 mb-4 bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">{selectedCategory}</h2>
                  <p className="text-sm text-muted-foreground">
                    共 {filteredProducts.length} 件商品等你来劝败
                  </p>
                </div>
                <div className="text-4xl">🛍️</div>
              </div>
            </Card>

            {/* 商品网格 */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <div className="text-6xl mb-4">📦</div>
                <p>该分类暂无商品</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
