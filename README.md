# 个人博客网站

一个功能完整的个人博客系统，包含用户端和管理端。**纯前端版本，数据存储在浏览器本地（localStorage）**。

## 功能特性

### 用户端
- 文章卡片式展示
- 全文搜索功能
- 文章详情页
- 响应式设计

### 管理端
- 管理员登录认证
- 文章CRUD操作
- 富文本编辑器
- HTML代码编辑器
- 草稿保存功能
- 多条件搜索

## 技术栈

- **前端**: React + TypeScript + Vite
- **样式**: Tailwind CSS
- **编辑器**: React-Quill + CodeMirror
- **数据存储**: 浏览器 localStorage（无需后端服务器）
- **路由**: React Router

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

前端将在 http://localhost:3000 启动

### 3. 开始使用

直接在浏览器打开 http://localhost:3000

## 💡 使用说明

### 管理员登录
- 用户名: admin
- 密码: admin123

### 管理功能
1. 登录后进入管理后台
2. 创建新文章：点击"创建新文章"
3. 编辑文章：在文章列表点击"编辑"
4. 删除文章：在文章列表点击"删除"
5. 搜索文章：使用搜索框进行搜索

### 文章编辑器
- 支持两种编辑模式：富文本编辑器和HTML代码编辑器
- 可以添加多个标签
- 可以设置发布日期
- 支持保存为草稿或直接发布

### 数据存储
- 所有数据存储在浏览器的 localStorage 中
- 刷新页面数据不会丢失
- 清除浏览器缓存会删除数据
- 同一浏览器可永久保存数据

## 项目结构

```
personal-blog/
├── src/                    # 前端源代码
│   ├── components/         # React组件
│   │   ├── ArticleCard.tsx
│   │   ├── CodeEditor.tsx
│   │   ├── Header.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── SearchBar.tsx
│   ├── context/            # React Context
│   │   └── AuthContext.tsx
│   ├── pages/              # 页面组件
│   │   ├── AdminDashboard.tsx
│   │   ├── ArticleDetailPage.tsx
│   │   ├── ArticleEditor.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   └── SearchPage.tsx
│   ├── types/              # TypeScript类型定义
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   └── storage.ts      # 本地存储接口
│   ├── App.tsx             # 应用主组件
│   ├── main.tsx            # 应用入口
│   └── index.css           # 全局样式
├── package.json
└── vite.config.ts
```

## 数据模型

### Article
```typescript
{
  id: string;
  title: string;
  coverImage: string;
  summary: string;
  content: string;
  publishDate: string;
  tags: string[];
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 特点

- **无需后端**: 完全前端实现，不需要安装任何服务器
- **即开即用**: 只需启动前端服务，所有功能即可使用
- **数据持久化**: 使用 localStorage 存储，刷新不丢失
- **易于部署**: 可以直接部署到静态托管服务（Vercel、Netlify等）

## 限制

- 数据仅存储在本地浏览器，换浏览器会看不到之前的数据
- 无法多设备同步数据
- 如需真实后端，可使用项目中 server 目录的 Express 版本

## 开发说明

- 前端使用 Vite 进行构建和热更新
- 管理端需要登录认证
- 支持响应式设计，适配手机和电脑

## 许可证

MIT License
