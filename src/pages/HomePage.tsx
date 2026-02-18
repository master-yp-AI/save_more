import { useState, useEffect } from 'react';
import TopNav from '@/components/layouts/TopNav';
import BottomNav from '@/components/layouts/BottomNav';
import BannerCarousel from '@/components/banner/BannerCarousel';
import ActivityEntries from '@/components/activity/ActivityEntries';
import ProductCard from '@/components/product/ProductCard';
import { mockProducts } from '@/data/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('精选');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 加载购物车数量
  useEffect(() => {
    const loadCartCount = () => {
      const cartData = localStorage.getItem('shopping_cart');
      if (cartData) {
        const cart = JSON.parse(cartData);
        const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    };

    loadCartCount();

    // 监听storage事件
    const handleStorageChange = () => {
      loadCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadCartCount, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // 根据分类和搜索关键词筛选商品
  const filteredProducts = mockProducts.filter((product) => {
    // 如果有搜索关键词，优先按关键词筛选
    if (searchKeyword.trim()) {
      return product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
             product.description.toLowerCase().includes(searchKeyword.toLowerCase());
    }
    
    // 如果选择了"热门"，显示标记为 isHot 的商品（最不值得买）
    if (selectedCategory === '热门') {
      return product.isHot === true;
    }
    
    // 如果选择了具体分类（非"精选"和"热门"），按分类筛选
    if (selectedCategory !== '精选') {
      return product.category === selectedCategory;
    }
    
    // 精选显示所有商品
    return true;
  });

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchKeyword(''); // 切换分类时清空搜索
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav 
        cartCount={cartCount}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
      />

      <div className="space-y-4">
        {/* 横幅轮播 */}
        <BannerCarousel />

        {/* 拼小圈入口 */}
        <div className="px-4">
          <Card className="p-4 bg-gradient-to-r from-pdd-orange-light to-secondary/10 border-secondary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-muted border-2 border-background"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">拼小圈</p>
                  <p className="text-xs text-muted-foreground">申请加好友</p>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>3</span>
              </Badge>
            </div>
          </Card>
        </div>

        {/* 活动入口 */}
        <ActivityEntries />

        {/* 百亿补贴改为百亿愧疚 */}
        <div className="px-4">
          <Card className="p-4 bg-gradient-to-r from-warning-yellow-light to-destructive/10 border-warning-yellow/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">百亿愧疚</h3>
                <p className="text-sm text-muted-foreground">
                  今日已为您省下 ¥0，因为您刚才盯着那双运动鞋看了30秒
                </p>
              </div>
              <div className="text-3xl">💸</div>
            </div>
          </Card>
        </div>

        {/* 商品推荐区 */}
        <div className="px-2">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-lg font-bold text-foreground">
              {searchKeyword 
                ? `搜索"${searchKeyword}"` 
                : selectedCategory === '热门' 
                  ? '最不值得买' 
                  : selectedCategory === '精选' 
                    ? '为你推荐' 
                    : selectedCategory}
            </h2>
            <p className="text-xs text-muted-foreground">
              {filteredProducts.length > 0 
                ? selectedCategory === '热门' 
                  ? '最常被拒绝' 
                  : '这些都是你不需要的' 
                : ''}
            </p>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-muted-foreground mb-2">没有找到相关商品</p>
              <p className="text-sm text-muted-foreground">
                {searchKeyword ? '换个关键词试试' : '该分类暂无商品'}
              </p>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            与其拼单，不如从源头切断消费欲望
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2026 省点吧
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
