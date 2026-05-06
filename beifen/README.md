# 个人博客网站

一个功能完整的个人博客系统，包含用户端和管理端。**纯前端版本，数据存储在浏览器本地（localStorage）**。

## 功能特性

### 用户端
- 📄 文章卡片式展示
- 🔍 全文搜索功能
- 📖 文章详情页
- 📱 响应式设计
- 🌐 中英文国际化切换
- 🔍 **SEO搜索引擎优化**
  - 动态Meta标签（标题、描述、关键词）
  - Open Graph社交分享优化
  - Twitter Card支持
  - 结构化数据（JSON-LD）
  - 文章Schema标记
  - 自动生成Sitemap
  - Canonical URL规范链接

### 管理端
- 🔐 管理员登录认证（JWT）
- ✏️ 文章CRUD操作
- 📝 富文本编辑器
- 💻 HTML代码编辑器
- 📝 草稿保存功能
- 🔎 多条件搜索

## 技术栈

- **前端**: React 18 + TypeScript + Vite 5
- **后端**: Express.js + SQLite (sql.js)
- **样式**: Tailwind CSS
- **编辑器**: React-Quill + CodeMirror
- **国际化**: React Context (中英文切换)
- **认证**: JWT (JSON Web Token)
- **路由**: React Router 6
- **SEO**: 动态Meta标签、结构化数据、Sitemap

## 快速开始

### 一键启动（推荐）

```bash
bash start.sh
```

脚本会自动：
1. 检查并解决端口冲突
2. 安装前后端依赖（如缺失）
3. 构建前端项目
4. 启动前后端服务
5. 配置PM2进程管理

### 手动部署

#### 1. 安装依赖

```bash
# 前端依赖
npm install

# 后端依赖
cd server && npm install && cd ..
```

#### 2. 配置环境变量

```bash
cp .env.example .env.production
# 编辑 .env.production，修改服务器IP和域名
```

#### 3. 构建前端

```bash
npm run build
```

#### 4. 启动服务

```bash
# 后端服务
cd server && npm start &

# PM2启动前端
pm2 serve dist --port 33334 --spa --name blog-frontend
```

### 服务地址

- **前端**: http://你的服务器IP:33334
- **后端**: http://你的服务器IP:3001
- **管理后台**: http://你的服务器IP:33334/admin

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
fly-blog/
├── src/                    # 前端源代码
│   ├── components/         # React组件
│   │   ├── ArticleCard.tsx
│   │   ├── CodeEditor.tsx
│   │   ├── Header.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── SearchBar.tsx
│   │   └── SEO.tsx         # SEO优化组件
│   ├── context/            # React Context
│   │   ├── AuthContext.tsx
│   │   └── LanguageContext.tsx
│   ├── i18n/              # 国际化
│   │   ├── translations.ts
│   │   └── LanguageContext.tsx
│   ├── pages/              # 页面组件
│   │   ├── AdminDashboard.tsx
│   │   ├── ArticleDetailPage.tsx
│   │   ├── ArticleEditor.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   └── SearchPage.tsx
│   ├── types/              # TypeScript类型定义
│   │   ├── index.ts
│   │   └── seo.ts
│   ├── utils/              # 工具函数
│   │   ├── api.ts          # API接口
│   │   └── structuredData.ts # SEO结构化数据
│   ├── App.tsx             # 应用主组件
│   └── main.tsx            # 应用入口
├── server/                 # 后端服务
│   ├── index.js            # Express服务器入口
│   ├── database.js         # SQLite数据库操作
│   ├── routes/             # API路由
│   └── uploads/            # 上传文件存储
├── beifen/                # 完整备份
├── start.sh               # 一键启动脚本
└── ecosystem.config.cjs    # PM2配置
```

## 数据模型

### Article
```typescript
{
  id: string;           // UUID
  title: string;        // 文章标题
  coverImage: string;   // 封面图片URL
  summary: string;       // 文章摘要
  content: string;      // 文章内容（HTML）
  publishDate: string;   // 发布日期
  tags: string[];       // 标签数组
  isDraft: boolean;     // 是否为草稿
  createdAt: string;    // 创建时间
  updatedAt: string;    // 更新时间
}
```

## SEO优化详情

### Meta标签优化
- 动态生成 `<title>` 标签
- 自动生成 `<meta name="description">`
- 关键词标签 `<meta name="keywords">`
- 作者信息

### 社交分享优化
- Open Graph标签（Facebook、LinkedIn）
- Twitter Card标签
- 分享图片支持

### 结构化数据
- **Article Schema**: 文章类型结构化数据
- **Website Schema**: 网站整体信息
- **Breadcrumb Schema**: 面包屑导航
- **Organization Schema**: 组织信息

### Sitemap
- 自动生成 `/sitemap.xml`
- 包含所有文章页面
- 支持changefreq和priority设置

### URL规范
- Canonical URL规范化
- 防止重复内容问题

## 特点

- 🚀 **一键部署**: 智能启动脚本，自动处理所有配置
- 🌐 **国际化**: 支持中英文切换，面向全球用户
- 🔍 **SEO友好**: 完整的搜索引擎优化支持
- 💾 **数据持久化**: SQLite数据库存储
- 🔐 **安全认证**: JWT令牌认证
- 📱 **响应式**: 完美适配各种设备
- ⚡ **高性能**: Vite快速构建
- 🎨 **现代化UI**: Tailwind CSS样式

## 限制

- 需要Node.js环境运行
- 需要配置服务器环境变量

## 开发说明

- 前端使用 Vite 进行构建和热更新
- 管理端需要登录认证（默认：admin/admin123）
- 支持响应式设计，适配手机和电脑
- SEO组件自动处理所有Meta标签

## 许可证

MIT License
