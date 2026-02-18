import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import SlashPage from './pages/SlashPage';
import HelpSlashPage from './pages/HelpSlashPage';
import GuiltPage from './pages/GuiltPage';
import DesertPage from './pages/DesertPage';
import DissuasionPage from './pages/DissuasionPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import BlacklistPage from './pages/BlacklistPage';
import MySlashPage from './pages/MySlashPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';
import SpringFestivalPage from './pages/SpringFestivalPage';
import AfterglowPage from './pages/AfterglowPage';
import CameraPage from './pages/CameraPage';
import CategoryPage from './pages/CategoryPage';
import NotFound from './pages/NotFound';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <HomePage />
  },
  {
    name: '商品详情',
    path: '/product/:id',
    element: <ProductDetailPage />
  },
  {
    name: '劝一刀',
    path: '/slash/:id',
    element: <SlashPage />
  },
  {
    name: '劝一刀',
    path: '/slash',
    element: <SlashPage />
  },
  {
    name: '帮忙劝一刀',
    path: '/help-slash',
    element: <HelpSlashPage />
  },
  {
    name: '百亿愧疚',
    path: '/guilt',
    element: <GuiltPage />
  },
  {
    name: '荒漠求生',
    path: '/desert',
    element: <DesertPage />
  },
  {
    name: '去劝退',
    path: '/dissuasion',
    element: <DissuasionPage />
  },
  {
    name: '断念后的余韵',
    path: '/afterglow',
    element: <AfterglowPage />
  },
  {
    name: '个人中心',
    path: '/profile',
    element: <ProfilePage />
  },
  {
    name: '购物车',
    path: '/cart',
    element: <CartPage />
  },
  {
    name: '拍照识物',
    path: '/camera',
    element: <CameraPage />
  },
  {
    name: '我的收藏',
    path: '/favorites',
    element: <FavoritesPage />
  },
  {
    name: '我的黑名单',
    path: '/blacklist',
    element: <BlacklistPage />
  },
  {
    name: '我的劝一刀',
    path: '/my-slash',
    element: <MySlashPage />
  },
  {
    name: '我的成就',
    path: '/achievements',
    element: <AchievementsPage />
  },
  {
    name: '设置',
    path: '/settings',
    element: <SettingsPage />
  },
  {
    name: '春节特辑',
    path: '/spring-festival',
    element: <SpringFestivalPage />
  },
  {
    name: '分类',
    path: '/category',
    element: <CategoryPage />
  },
  {
    name: '404',
    path: '*',
    element: <NotFound />
  }
];

export default routes;
