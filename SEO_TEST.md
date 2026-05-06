# SEO优化测试指南

## 重启服务

### 方式一：一键启动脚本
```bash
bash /var/www/blog_1/server/start-server.sh
```

### 方式二：手动启动
```bash
# 终端1：后端
cd /var/www/blog_1/server
PORT=3001 BASE_URL=http://192.3.159.110:3001 node index.js

# 终端2：前端
cd /var/www/blog_1
npm run dev
```

---

## 测试清单

### 1. Sitemap.xml 测试
访问：`http://192.3.159.110:3001/sitemap.xml`

预期结果：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://192.3.159.110:3001/</loc>
    <lastmod>2026-04-30T...</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>http://192.3.159.110:3001/search</loc>
    ...
  </url>
  <!-- 每篇文章的URL -->
  <url>
    <loc>http://192.3.159.110:3001/article/文章ID</loc>
    ...
  </url>
</urlset>
```

### 2. Robots.txt 测试
访问：`http://192.3.159.110:3001/robots.txt`

预期结果：
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /uploads/

Sitemap: http://192.3.159.110:3001/sitemap.xml
```

### 3. 首页SEO测试
访问：`http://192.3.159.110:3000`（或本地 `http://localhost:3000`）

按 F12 打开开发者工具，切换到 Elements 标签，检查 `<head>` 部分：

应该包含：
- [ ] `<title>` 标签
- [ ] `<meta name="description" content="...">`
- [ ] `<meta name="keywords" content="...">`
- [ ] Open Graph 标签（og:title, og:description, og:image, og:url）
- [ ] `<script type="application/ld+json">` 结构化数据

### 4. 文章详情页SEO测试
访问：`http://192.3.159.110:3000/article/文章ID`

检查 `<head>` 部分：
- [ ] `<title>` 包含文章标题
- [ ] `<meta name="description" content="...">` 包含文章摘要
- [ ] Open Graph 标签
- [ ] `<script type="application/ld+json">` 包含 Article 结构化数据
- [ ] BreadcrumbList 结构化数据（面包屑导航）

### 5. 图片Alt文本测试
在文章列表页面，检查文章卡片图片：
- [ ] `<img alt="文章标题 - 文章摘要...">`
- [ ] `decoding="async"` 属性

### 6. 搜索页SEO测试
访问：`http://192.3.159.110:3000/search`

检查：
- [ ] `<title>` 包含"搜索"
- [ ] `<meta name="description">`
- [ ] SearchAction 结构化数据

---

## 验证工具

### Google结构化数据测试
1. 访问：https://search.google.com/test/rich-results
2. 输入URL进行测试
3. 检查是否有错误

### SEO综合检查
1. 访问：https://sitechecker.pro/
2. 输入网站URL
3. 查看SEO评分和建议

---

## 已完成的SEO优化

### 1. Meta标签优化 ✅
- [x] 动态生成 title、description、keywords
- [x] Open Graph 标签（社交分享）
- [x] Twitter Card 标签
- [x] 规范URL（canonical URL）

### 2. 结构化数据 ✅
- [x] WebsiteSchema（网站信息）
- [x] OrganizationSchema（组织信息）
- [x] ArticleSchema（文章详情）
- [x] BreadcrumbSchema（面包屑导航）
- [x] ArticleListSchema（文章列表）
- [x] SearchActionSchema（搜索功能）

### 3. 图片优化 ✅
- [x] Alt文本优化（包含标题和摘要）
- [x] 异步加载（decoding="async"）

### 4. Sitemap ✅
- [x] 自动生成 sitemap.xml
- [x] 包含首页、搜索页、所有文章
- [x] 动态更新

### 5. Robots.txt ✅
- [x] 动态生成 robots.txt
- [x] 禁止爬虫访问管理后台
- [x] 指向 sitemap.xml

---

## 配置文件位置

| 文件 | 用途 |
|------|------|
| `server/index.js` | sitemap.xml、robots.txt 路由 |
| `src/components/SEO.tsx` | SEO组件 |
| `src/utils/structuredData.ts` | 结构化数据生成 |
| `src/pages/HomePage.tsx` | 首页SEO |
| `src/pages/ArticleDetailPage.tsx` | 文章页SEO |
| `src/pages/SearchPage.tsx` | 搜索页SEO |
| `src/components/ArticleCard.tsx` | 图片alt优化 |
| `server/.env` | BASE_URL配置 |

---

## 外部验证

在 Google Search Console 中提交：
- `http://192.3.159.110:3001/sitemap.xml`

步骤：
1. 访问 https://search.google.com/search-console
2. 添加您的网站
3. 提交 sitemap
4. 等待 Google 索引
