# 博客系统部署指南

## 服务器要求

- 操作系统：Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- 配置：1GB+ RAM, 10GB+ 硬盘
- Node.js 18+
- Nginx
- PM2 (进程管理器)

## 第一步：连接服务器

使用 SSH 连接到你的服务器：

```bash
ssh root@192.3.159.110
```

输入密码后登录。

## 第二步：安装必要软件

### Ubuntu/Debian:

```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 安装 Nginx
apt install -y nginx

# 安装 PM2
npm install -g pm2

# 验证安装
node -v
npm -v
nginx -v
pm2 -v
```

### CentOS:

```bash
# 更新系统
yum update -y

# 安装 Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# 安装 Nginx
yum install -y nginx

# 安装 PM2
npm install -g pm2

# 启动 Nginx
systemctl start nginx
systemctl enable nginx
```

## 第三步：创建网站目录

```bash
mkdir -p /var/www/blog
cd /var/www/blog
```

## 第四步：上传项目文件

在本地电脑（你的 Windows 机器）上，打开新的终端窗口，执行：

```bash
# 打包前端
cd e:\trae\blog
npm run build

# 打包后端代码（不包括 node_modules）
cd server
# 使用 scp 或你喜欢的工具上传
scp -r . root@192.3.159.110:/var/www/blog/server/
```

或者使用 SFTP 工具（如 FileZilla）：

1. 连接：`root@192.3.159.110:22`
2. 上传 `e:\trae\blog\dist` 到 `/var/www/blog/dist`
3. 上传 `e:\trae\blog\server` 到 `/var/www/blog/server`

## 第五步：配置后端

在服务器上执行：

```bash
cd /var/www/blog/server

# 安装依赖
npm install

# 创建环境变量配置
cp .env.example .env

# 编辑配置文件（重要！）
nano .env
```

修改以下配置：

```env
PORT=3001
JWT_SECRET=你的随机密钥（至少32位字符）
ALLOWED_ORIGIN=http://192.3.159.110
UPLOAD_DIR=./uploads
```

按 `Ctrl+O` 保存，`Ctrl+X` 退出。

## 第六步：启动后端服务

```bash
# 使用 PM2 启动
pm2 start npm --name "blog-api" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

## 第七步：配置 Nginx

创建 Nginx 配置文件：

```bash
nano /etc/nginx/sites-available/blog
```

粘贴以下内容（替换 `192.3.159.110` 为你的服务器 IP）：

```nginx
server {
    listen 80;
    server_name 192.3.159.110;

    # 前端静态文件
    root /var/www/blog/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/json;

    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理到后端
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }

    # 图片上传目录
    location /uploads/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

保存并退出。

启用配置：

```bash
# 创建软链接
ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

## 第八步：配置防火墙

```bash
# 允许 HTTP 和 HTTPS
ufw allow 'Nginx Full'

# 允许 SSH（重要！）
ufw allow 22/tcp

# 启用防火墙
ufw enable
```

## 第九步：验证部署

在浏览器中访问：

```
http://192.3.159.110
```

你应该能看到博客首页！

API 地址：
```
http://192.3.159.110/api/articles
```

## 第十步：配置 SSL（HTTPS）- 可选但推荐

安装 Certbot：

```bash
# Ubuntu/Debian
apt install -y certbot python3-certbot-nginx

# 申请证书（需要域名）
certbot --nginx -d your-domain.com
```

如果暂时没有域名，可以先生成自签名证书测试：

```bash
# 生成自签名证书
mkdir -p /etc/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt

# 修改 Nginx 配置启用 HTTPS
nano /etc/nginx/sites-available/blog
```

修改为：

```nginx
server {
    listen 443 ssl http2;
    server_name 192.3.159.110;

    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    # ... 其他配置同上 ...
}

server {
    listen 80;
    server_name 192.3.159.110;
    return 301 https://$server_name$request_uri;
}
```

```bash
# 重载 Nginx
nginx -t
systemctl reload nginx
```

## 常用管理命令

```bash
# 查看日志
pm2 logs blog-api

# 重启服务
pm2 restart blog-api

# 查看状态
pm2 status

# 查看 API 是否运行
curl http://localhost:3001/api/articles

# 查看 Nginx 状态
systemctl status nginx

# 重载 Nginx
systemctl reload nginx
```

## 故障排除

### 1. API 无法访问

```bash
# 检查 PM2 状态
pm2 status

# 查看日志
pm2 logs blog-api

# 检查端口
netstat -tlnp | grep 3001
```

### 2. Nginx 502 错误

```bash
# 检查后端是否运行
curl http://localhost:3001/api/articles

# 检查 Nginx 日志
tail -f /var/log/nginx/error.log
```

### 3. 前端样式丢失

```bash
# 检查静态文件路径
ls -la /var/www/blog/dist/

# 检查 Nginx 配置
nginx -t
```

## 更新部署

当需要更新代码时：

```bash
cd /var/www/blog

# 上传新代码
# scp -r ./dist ./server root@192.3.159.110:/var/www/blog/

# 重启服务
pm2 restart blog-api
```

## 备份数据

```bash
# 备份数据库
cp /var/www/blog/server/blog.db /var/www/blog/backups/blog_$(date +%Y%m%d).db

# 备份上传的文件
tar -czf /var/www/blog/backups/uploads_$(date +%Y%m%d).tar.gz /var/www/blog/server/uploads/
```

---

## 需要帮助？

如果遇到问题，请检查：

1. 所有服务是否运行：`pm2 status` 和 `systemctl status nginx`
2. 日志输出：`pm2 logs blog-api`
3. 端口占用：`netstat -tlnp | grep -E '80|443|3001'`

祝你部署成功！🎉
