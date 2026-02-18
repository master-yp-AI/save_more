# 省点吧应用开发任务

## 任务概述
创建"省点吧"娱乐性应用 - 反向复刻拼多多的创意项目，传递理性消费理念

## 完成情况

### ✅ 已完成任务（Phase 1-24）

#### Phase 1-14: 基础功能（已完成）
- [x] 设计系统配置
- [x] 数据结构和类型定义
- [x] 布局组件
- [x] 业务组件
- [x] 核心页面（14个）
- [x] 路由配置
- [x] 核心功能实现
- [x] 页面跳转和交互
- [x] 代码质量检查

#### Phase 15-19: 功能增强（已完成）
- [x] 商品分类修正（鞋子归类到鞋包）
- [x] "热门"反逻辑分类（常被拒绝的非必需品）
- [x] 劝一刀裂变功能（分享链接、好友帮忙涨价）
- [x] HelpSlashPage实现（好友劝一刀页面）
- [x] 实时价格同步（localStorage + storage事件）

#### Phase 20: 真实购物车功能（已完成）
- [x] 真实购物车按钮（独立于黑名单）
- [x] 购物车localStorage持久化
- [x] CartPage联动显示
- [x] 必需品提醒
- [x] 加入黑名单icon改为Ban图标

#### Phase 21: 购物车反馈优化（已完成）
- [x] Toast通知（加入购物车成功）
- [x] 购物车数量Badge显示
- [x] 成功确认Dialog
- [x] 实时数量更新

#### Phase 22: 搜索和拍照功能（已完成）
- [x] 实时搜索功能（TopNav）
- [x] PC端摄像头调用（getUserMedia）
- [x] 移动端摄像头调用（file input capture）
- [x] 拍照预览（4:3比例）
- [x] CameraPage路由配置

#### Phase 23: AI图像识别（已完成）
- [x] 创建image-recognition Edge Function
- [x] 接入百度通用物体识别API
- [x] 关键词提取和商品匹配
- [x] 错误处理和降级方案
- [x] CameraPage集成识别功能

#### Phase 24: AI功能完善（已完成）
- [x] **百亿愧疚AI分析**
  - [x] 创建analyze-cart Edge Function
  - [x] 接入文心大模型API
  - [x] 从localStorage读取购物车数据
  - [x] 生成幽默劝败文案
  - [x] 计算等价物（外卖、退休、旅行）
  - [x] 错误处理和降级方案
  
- [x] **AI灵魂共鸣优化**
  - [x] 创建soul-echo Edge Function
  - [x] 接入文心大模型API
  - [x] 分析用户断念感受
  - [x] 智能推荐哲学名言
  - [x] 加载状态显示
  - [x] 错误处理和降级方案

- [x] **首页购物车数量同步**
  - [x] 从localStorage读取购物车数量
  - [x] 实时更新（storage事件 + 轮询）
  - [x] TopNav显示数量Badge

#### Phase 25: 数据管理优化（已完成）
- [x] **FavoritesPage优化**
  - [x] 从localStorage读取收藏数据
  - [x] 实时同步（storage事件 + 轮询）
  - [x] 删除收藏功能
  - [x] 移动到黑名单功能
  - [x] 空状态提示（Heart图标）
  
- [x] **BlacklistPage优化**
  - [x] 从localStorage读取黑名单数据
  - [x] 实时同步（storage事件 + 轮询）
  - [x] 移除黑名单功能
  - [x] 删除商品功能
  - [x] 空状态提示（Ban图标）

- [x] **ProfilePage优化**
  - [x] 收藏数量实时同步
  - [x] 黑名单数量实时同步
  - [x] 断念记录显示
  - [x] 功德值显示

### 📦 Edge Functions

#### 已创建
- [x] **image-recognition** - 图像识别
  - 调用百度通用物体识别API
  - 提取关键词（keyword, score, category）
  - 返回识别结果供商品搜索使用

- [x] **analyze-cart** - AI购物车分析
  - 调用文心大模型API
  - 分析购物车商品列表
  - 生成幽默劝败文案
  - 计算等价物（外卖、退休、旅行）

- [x] **soul-echo** - AI灵魂共鸣
  - 调用文心大模型API
  - 分析用户断念感受
  - 推荐哲学名言并注明出处
  - 解释共鸣点

#### 部署状态
- ⏳ 待部署（需要调用supabase_deploy_edge_function）

### 💾 数据持久化（localStorage）

#### 已实现
- [x] `shopping_cart` - 购物车数据（商品列表、数量）
- [x] `favorites` - 收藏列表
- [x] `blacklist` - 黑名单
- [x] `afterglow_data` - 断念记录（次数、金额、目标）
- [x] `slash_sessions` - 劝一刀会话
- [x] 实时同步机制（storage事件 + 1秒轮询）
- [x] 跨页面数据共享

## 功能特色

### 核心反向逻辑
1. **劝一刀**：好友帮忙涨价而非砍价，每次涨价50-150元
2. **百亿愧疚**：显示浪费金额统计，计算等价物（外卖、退休生活费、旅行）
3. **荒漠求生**：拔草大作战游戏，拔光欲望之草获得铁公鸡勋章
4. **去劝退**：劝退他人购物，获得功德值

### 春节特别版
1. **穷困潦倒海报生成器**：填写收入、负债、存款，生成海报分享朋友圈
2. **压岁钱防火墙**：守护压岁钱（功能入口已预留）
3. **亲戚互怼模式**：让亲戚不敢找你借钱

### 视觉设计
1. **禁欲系冷色调**：莫兰迪蓝灰主色调，传递理性消费理念
2. **春节元素**：橙红色辅助色，融入春节氛围
3. **拼多多风格**：像素级复刻UI元素，但传递相反理念

## 技术栈
- React + TypeScript
- Tailwind CSS
- shadcn/ui 组件库
- React Router
- Vite

## 项目结构
```
src/
├── components/
│   ├── layouts/          # 布局组件
│   │   ├── TopNav.tsx
│   │   └── BottomNav.tsx
│   ├── product/          # 商品组件
│   │   └── ProductCard.tsx
│   ├── activity/         # 活动组件
│   │   └── ActivityEntries.tsx
│   └── banner/           # 横幅组件
│       └── BannerCarousel.tsx
├── pages/                # 页面组件
│   ├── HomePage.tsx
│   ├── ProductDetailPage.tsx
│   ├── SlashPage.tsx
│   ├── GuiltPage.tsx
│   ├── DesertPage.tsx
│   ├── DissuasionPage.tsx
│   ├── ProfilePage.tsx
│   ├── CartPage.tsx
│   ├── FavoritesPage.tsx
│   ├── BlacklistPage.tsx
│   ├── MySlashPage.tsx
│   ├── AchievementsPage.tsx
│   ├── SettingsPage.tsx
│   └── SpringFestivalPage.tsx
├── types/                # 类型定义
│   └── app.ts
├── data/                 # 模拟数据
│   └── mockData.ts
├── index.css             # 全局样式
└── routes.tsx            # 路由配置
```

## 使用说明

### 启动应用
```bash
npm run dev
```

### 构建应用
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 核心理念
**"与其拼单，不如从源头切断消费欲望"**

通过反向购物逻辑，帮助用户认清消费欲望，培养理性消费习惯。
