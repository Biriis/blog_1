#!/bin/bash

# SSL 证书申请脚本（使用 Let's Encrypt）

echo "🔐 开始申请 SSL 证书..."

# 检查域名是否配置好 DNS
echo "请确保:"
echo "1. 域名 DNS 已正确配置 A 记录指向本服务器 IP"
echo "2. 80 端口未被占用（Certbot 需要）"
echo ""

read -p "确认继续？(y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "已取消"
    exit 0
fi

# 安装 Certbot
if ! command -v certbot &> /dev/null; then
    echo "📦 安装 Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# 读取域名
read -p "请输入你的域名（例如：blog.example.com）: " domain

if [ -z "$domain" ]; then
    echo "❌ 域名不能为空"
    exit 1
fi

# 申请证书
echo "🔒 申请证书..."
sudo certbot --nginx -d $domain

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════"
    echo "🎉 SSL 证书申请成功！"
    echo ""
    echo "✅ 证书位置:"
    echo "   /etc/letsencrypt/live/$domain/"
    echo ""
    echo "⚠️  证书有效期 90 天，Certbot 会自动续期"
    echo "   测试自动续期: sudo certbot renew --dry-run"
    echo "════════════════════════════════════════════════════"
else
    echo "❌ 证书申请失败"
    echo "请检查:"
    echo "1. 域名 DNS 是否正确配置"
    echo "2. 80 和 443 端口是否开放"
    echo "3. Nginx 是否正在运行"
fi
