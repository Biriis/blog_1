#!/bin/bash

echo "🚀 开始更新博客系统..."

# 1. 进入项目目录
cd /var/www/blog

# 2. 显示当前版本
echo "📦 当前代码版本:"
git log -1 --oneline

# 3. 拉取最新代码
echo "📥 正在拉取最新代码..."
git pull

# 4. 显示新版本
echo "✨ 更新后代码版本:"
git log -1 --oneline

# 5. 更新前端依赖
echo "📦 更新前端依赖..."
cd ..
npm install

# 6. 重新构建前端
echo "🏗️  重新构建前端..."
npm run build

# 7. 更新后端依赖
echo "📦 更新后端依赖..."
cd server
npm install

# 8. 重启后端服务
echo "🔄 重启后端服务..."
pm2 restart blog-api

# 9. 显示服务状态
echo "📊 服务状态:"
pm2 status

echo ""
echo "════════════════════════════════════════════════════"
echo "🎉 更新完成！"
echo ""
echo "✨ 新版本: $(git log -1 --oneline)"
echo "🌐 访问地址: http://你的域名或IP"
echo "📝 管理后台: http://你的域名或IP/admin"
echo ""
echo "如果有问题，查看日志: pm2 logs blog-api"
echo "════════════════════════════════════════════════════"
