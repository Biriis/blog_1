#!/bin/bash
# 快速部署脚本 - 用于已配置好基础环境的服务器

echo "========================================="
echo "   博客系统快速部署脚本"
echo "========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否以 root 权限运行
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 root 权限运行此脚本！${NC}"
    echo "使用: sudo bash quick-deploy.sh"
    exit 1
fi

# 1. 创建网站目录
echo -e "${YELLOW}[1/7]${NC} 创建网站目录..."
mkdir -p /var/www/blog/{dist,server,uploads,backups,logs}
cd /var/www/blog

# 2. 检查 Node.js
echo -e "${YELLOW}[2/7]${NC} 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js 未安装${NC}"
    echo "请先运行完整部署指南中的安装步骤"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node -v)"

# 3. 检查 PM2
echo -e "${YELLOW}[3/7]${NC} 检查 PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi
echo -e "${GREEN}✓${NC} PM2 $(pm2 -v)"

# 4. 检查 Nginx
echo -e "${YELLOW}[4/7]${NC} 检查 Nginx..."
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}Nginx 未安装${NC}"
    echo "请先运行完整部署指南中的安装步骤"
    exit 1
fi
echo -e "${GREEN}✓${NC} Nginx $(nginx -v 2>&1)"

# 5. 安装后端依赖
echo -e "${YELLOW}[5/7]${NC} 安装后端依赖..."
cd /var/www/blog/server
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗${NC} 依赖安装失败"
    exit 1
fi
echo -e "${GREEN}✓${NC} 依赖安装成功"

# 6. 配置环境变量
echo -e "${YELLOW}[6/7]${NC} 配置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠${NC} 已创建 .env 文件，请编辑设置 JWT_SECRET"
    echo "运行: nano .env"
else
    echo -e "${GREEN}✓${NC} 环境变量已配置"
fi

# 7. 启动服务
echo -e "${YELLOW}[7/7]${NC} 启动服务..."

# 停止旧进程
pm2 delete blog-api 2>/dev/null

# 启动新进程
pm2 start npm --name "blog-api" -- start
pm2 save

# 配置开机自启
pm2 startup > /dev/null 2>&1

echo ""
echo "========================================="
echo -e "${GREEN}✓${NC} 后端服务已启动"
echo "========================================="
echo ""

# 8. 配置 Nginx
echo "配置 Nginx..."
SERVER_IP=$(hostname -I | awk '{print $1}')

cat > /etc/nginx/sites-available/blog <<EOF
server {
    listen 80;
    server_name $SERVER_IP;

    root /var/www/blog/dist;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/json;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# 启用配置
ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试并重载 Nginx
nginx -t && systemctl reload nginx

echo ""
echo "========================================="
echo -e "${GREEN}✓${NC} Nginx 配置完成"
echo "========================================="
echo ""

# 显示信息
echo ""
echo "========================================="
echo "   部署完成！"
echo "========================================="
echo ""
echo -e "🌐 访问地址: ${GREEN}http://$SERVER_IP${NC}"
echo ""
echo "📊 服务状态:"
pm2 status
echo ""
echo "📝 后续步骤:"
echo "1. 编辑 .env 文件: nano /var/www/blog/server/.env"
echo "2. 设置 JWT_SECRET (至少32位字符)"
echo "3. 重启服务: pm2 restart blog-api"
echo ""
echo "🔧 常用命令:"
echo "  - pm2 logs blog-api      查看日志"
echo "  - pm2 restart blog-api   重启服务"
echo "  - pm2 status             查看状态"
echo "  - systemctl reload nginx 重载 Nginx"
echo ""
echo "========================================="
