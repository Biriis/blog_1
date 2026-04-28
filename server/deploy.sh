#!/bin/bash

echo "🚀 开始部署博客系统..."

# 1. 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo "请运行: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 2. 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

echo "✅ npm 版本: $(npm -v)"

# 3. 创建必要目录
echo "📁 创建必要目录..."
mkdir -p data backups uploads logs

# 4. 安装依赖
echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装成功"

# 5. 复制环境变量配置
if [ ! -f .env ]; then
    echo "📝 创建环境变量配置文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件修改默认密码和 JWT 密钥！"
else
    echo "✅ 环境变量配置文件已存在"
fi

# 6. 初始化数据库
echo "🗄️  初始化数据库..."
npm start &
SERVER_PID=$!
sleep 3
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

echo "✅ 数据库初始化完成"

# 7. 构建前端（如果需要）
if [ -d "../dist" ]; then
    echo "📱 前端已构建"
else
    echo "⚠️  前端未构建，请运行: cd .. && npm run build"
fi

# 8. 配置 PM2
echo "🔄 配置 PM2 进程管理器..."
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装 PM2..."
    sudo npm install -g pm2
fi

pm2 delete blog-api 2>/dev/null
pm2 start npm --name "blog-api" -- start
pm2 save

echo "✅ PM2 配置完成"

# 9. 显示状态
echo ""
echo "════════════════════════════════════════════════════"
echo ""
echo "🎉 部署完成！"
echo ""
echo "📊 服务状态:"
pm2 status
echo ""
echo "🌐 访问地址:"
echo "   后端 API: http://localhost:3001"
if [ -d "../dist" ]; then
    echo "   前端: 请配置 Nginx 后访问"
fi
echo ""
echo "📝 下一步:"
echo "   1. 编辑 .env 文件修改密码和密钥"
echo "   2. 配置 Nginx（参考 deploy/nginx.conf）"
echo "   3. 申请 SSL 证书（参考 deploy/ssl.sh）"
echo "   4. 重启服务: pm2 restart blog-api"
echo ""
echo "════════════════════════════════════════════════════"
