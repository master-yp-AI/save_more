# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供该代码仓库的操作指南。

## 项目概述

**省点吧 (Save More)** - 一款讽刺性的反电商 Web 应用，通过鼓励用户省钱而非消费来戏仿拼多多。使用 React + TypeScript + Vite 构建。

核心理念：反向购物逻辑 - "与其拼单，不如从源头切断消费欲"。

## 开发命令

### 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（不要使用 npm run dev）
npx vite

# 生产构建（不要使用 npm run build）
npx vite build

# 运行所有检查（提交前必需）
npm run lint
```

### lint 命令详解

`npm run lint` 命令运行完整的检查套件：

1. **TypeScript 类型检查**：`tscgo -p tsconfig.check.json`
2. **Biome 代码检查**：`npx biome lint` - 检查未声明的依赖、重复声明、CommonJS 用法
3. **自定义 ast-grep 规则**：`.rules/check.sh` - 强制执行认证模式、无障碍访问、Supabase SSO
4. **Tailwind CSS 验证**：检查 CSS 语法错误
5. **构建测试**：`.rules/testBuild.sh` - 验证构建是否成功

**注意**：`npm run dev` 和 `npm run build` 脚本被故意禁用，会输出提示信息引导用户使用 `npx vite` 或 `npm run lint`。

## 架构

### 技术栈

- **框架**：React 18 + TypeScript 5.9
- **构建工具**：Vite 5
- **样式**：Tailwind CSS 3.4 + shadcn/ui 组件
- **路由**：React Router v7
- **动画**：Motion (Framer Motion)
- **后端**：Supabase Edge Functions
- **包管理器**：pnpm

### 项目结构

```
src/
├── components/
│   ├── layouts/          # 布局组件（顶部导航、底部导航）
│   ├── product/          # 商品卡片
│   ├── banner/           # 轮播广告
│   ├── activity/         # 活动入口
│   ├── festival/         # 春节特辑组件
│   └── ui/               # shadcn/ui 基础组件
├── pages/                # 页面组件
│   ├── HomePage.tsx      # 首页
│   ├── ProductDetailPage.tsx  # 商品详情
│   ├── SlashPage.tsx     # "劝一刀" 反向砍价
│   ├── GuiltPage.tsx     # "百亿愧疚" AI 愧疚分析
│   ├── DesertPage.tsx    # "荒漠求生" 拔草游戏
│   ├── DissuasionPage.tsx # "去劝退" 社交劝退
│   ├── AfterglowPage.tsx # "断念后的余韵" 灵魂记录
│   ├── SpringFestivalPage.tsx # 春节特辑
│   └── ...
├── data/                 # 模拟数据（mockData.ts、philosophyData.ts）
├── hooks/                # 自定义 Hooks
├── types/                # TypeScript 类型定义
├── routes.tsx            # 路由配置
└── index.css             # 全局样式（CSS 变量）
```

### 关键配置文件

- `vite.config.ts` - 生产环境 Vite 配置
- `vite.config.dev.ts` - 开发环境配置，包含 HMR 切换端点和监控插件
- `tailwind.config.js` - Tailwind 配置，自定义颜色（拼多多橙、功德绿等）
- `biome.json` - 代码检查配置（格式化功能已禁用）
- `components.json` - shadcn/ui 配置
- `.rules/*.yml` - ast-grep 自定义检查规则

### 数据持久化

所有用户数据存储在 localStorage 中：
- `shopping_cart` - 购物车商品
- `favorites` - 收藏列表
- `blacklist` - 黑名单商品
- `afterglow_data` - 断念记录
- `slash_sessions` - 劝一刀会话数据

数据通过 `storage` 事件 + 1 秒轮询实现跨标签页同步。

### 自定义检查规则（ast-grep）

位于 `.rules/` 目录：

- **check.sh**: 编排所有 ast-grep 扫描；强制要求使用 `useAuth` Hook 时必须包裹 `AuthProvider`
- **SelectItem.yml**: 强制 SelectItem 必须包含文本子元素（无障碍访问）
- **contrast.yml**: 强制符合 WCAG 对比度标准
- **supabase-google-sso.yml**: 强制配置 Supabase Google SSO 提供者

### AI 功能（Supabase Edge Functions）

位于 `supabase/functions/` 目录：

- `image-recognition` - 百度 AI 图像识别，用于拍照识物
- `analyze-cart` - 文心大模型，用于幽默的购物车愧疚分析
- `soul-echo` - 文心大模型，根据用户感受推荐哲学名言

### 设计系统

颜色在 `src/index.css` 中定义为 HSL CSS 变量：

- **主色**：莫兰迪蓝灰（`215 20% 45%`）- 禁欲系冷色调
- **辅助色**：拼多多橙（`4 85% 52%`）- 用于价格/激励元素
- **警示色**：劝败红（`0 72% 51%`）- 用于"立即购买"警告
- **功德绿**：`142 71% 45%` - 用于省钱/成就展示
- **警告黄**：`45 93% 58%` - 用于提醒

所有组件使用 shadcn/ui "New York" 风格，配合 Tailwind CSS 变量。

### 重要模式

1. **路由守卫**：App.tsx 中目前被注释掉（AuthProvider/RouteGuard）
2. **HMR 切换**：开发服务器提供 `/innerapi/v1/sourcecode/__hmr_off`、`__hmr_on`、`__hmr_reload` 端点
3. **图像识别**：CameraPage 同时使用 `getUserMedia`（桌面端）和文件输入 capture（移动端）
4. **数字格式化**：ProductCard 使用 `formatSoldCount()` 函数显示（如 "1.2万+"）
