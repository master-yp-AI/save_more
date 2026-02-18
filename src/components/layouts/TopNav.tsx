import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Camera, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/mockData';

interface TopNavProps {
  cartCount?: number;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  onSearch?: (keyword: string) => void;
}

export default function TopNav({ 
  cartCount = 0, 
  selectedCategory = '精选',
  onCategoryChange,
  onSearch 
}: TopNavProps) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const allCategories = [
    { id: 'featured', name: '精选', icon: '⭐' },
    ...categories
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    // 实时搜索
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryName);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
      {/* 搜索栏 */}
      <div className="flex items-center gap-2 p-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="搜索商品，理性消费"
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10 pr-4 bg-background/90 text-foreground placeholder:text-muted-foreground border-none rounded-full h-10"
          />
        </form>
        <Button
          size="icon"
          variant="ghost"
          className="text-secondary-foreground"
          onClick={() => navigate('/camera')}
        >
          <Camera className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-secondary-foreground relative"
          onClick={() => navigate('/cart')}
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
              {cartCount}
            </Badge>
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-secondary-foreground"
          onClick={() => navigate('/profile')}
        >
          <User className="w-5 h-5" />
        </Button>
      </div>

      {/* 分类标签 */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex-shrink-0 px-4 py-1.5 text-sm font-medium transition-colors rounded-full ${
              selectedCategory === category.name
                ? 'bg-secondary-foreground text-secondary'
                : 'text-secondary-foreground hover:bg-secondary-foreground/10'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
