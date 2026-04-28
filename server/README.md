# 博客系统部署指南

## 📋 目录

1. [服务器准备](#1-服务器准备)
2. [基础环境安装](#2-基础环境安装)
3. [代码部署](#3-代码部署)
4. [Nginx 配置](#4-nginx-配置)
5. [SSL 证书](#5-ssl-证书)
6. [启动服务](#6-启动服务)
7. [自动备份](#7-自动备份)
8. [故障排查](#8-故障排查)

---

## 1. 服务器准备

### 服务器要求
- CPU: 1-2 核
- 内存: 2GB 以上
- 硬盘: 20GB 以上
- 系统: Ubuntu 22.04 LTS / Debian 12

### 连接服务器
```bash
ssh root@你的服务器IP
```

---

## 2. 基础环境安装

### 2.1 更新系统
```bash
apt update && apt upgrade -y
```

### 2.2 安装 Node.js 18
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# 验证安装
node -v  # 应该显示 v18.x.x
npm -v   # 应该显示 9.x.x
```

### 2.3 安装 Nginx
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 2.4 安装 SQLite
```bash
apt install -y sqlite3
sqlite3 --version
```

### 2.5 安装 PM2（进程管理器）
```bash
npm install -g pm2
pm2 startup
```

---

## 3. 代码部署

### 3.1 创建网站目录
```bash
mkdir -p /var/www/blog
cd /var/www/blog
```

### 3.2 上传代码

**方式1：使用 Git（推荐）**
```bash
git clone https://github.com/你的用户名/blog.git .
```

**方式2：使用 SCP 上传**
```bash
# 在本地电脑执行
scp -r ./blog/* root@你的服务器IP:/var/www/blog/
```

### 3.3 配置环境变量
```bash
cd /var/www/blog/server
cp .env.example .env
nano .env
```

修改以下配置：
```env
PORT=3001
ADMIN_USERNAME=admin
ADMIN_PASSWORD=你的新密码        # ⚠️ 必须修改！
JWT_SECRET=一个至少32位的随机字符串  # ⚠️ 必须修改！
ALLOWED_ORIGIN=https://你的域名.com
```

### 3.4 安装依赖
```bash
cd /var/www/blog/server
npm install

# 构建前端（返回上级目录）
cd ..
npm install
npm run build
```

### 3.5 初始化数据库
```bash
cd /var/www/blog/server
npm start &
sleep 3
kill %1
```

看到 `✅ SQLite 数据库初始化成功` 表示成功

---

## 4. Nginx 配置

### 4.1 复制配置
```bash
cp /var/www/blog/server/deploy/nginx.conf /etc/nginx/sites-available/blog
```

### 4.2 修改配置
```bash
nano /etc/nginx/sites-available/blog
```

修改以下内容：
```nginx
server_name your-domain.com;  # 替换为你的域名
root /var/www/blog/dist;      # 前端构建目录
```

### 4.3 启用站点
```bash
ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/blog
nginx -t  # 测试配置
systemctl reload nginx
```

---

## 5. SSL 证书

### 5.1 申请 Let's Encrypt 证书
```bash
cd /var/www/blog/server/deploy
chmod +x ssl.sh
./ssl.sh
```

按提示输入你的域名，证书会自动申请并配置。

### 5.2 证书续期测试
```bash
certbot renew --dry-run
```

---

## 6. 启动服务

### 6.1 使用 PM2 启动后端
```bash
cd /var/www/blog/server
pm2 start npm --name "blog-api" -- start
pm2 save
pm2 status  # 查看状态
```

### 6.2 设置开机自启
```bash
pm2 startup
pm2 save
```

### 6.3 常用 PM2 命令
```bash
pm2 status           # 查看状态
pm2 logs blog-api    # 查看日志
pm2 restart blog-api # 重启服务
pm2 stop blog-api   # 停止服务
```

---

## 7. 自动备份

### 7.1 配置自动备份
```bash
cd /var/www/blog/server
chmod +x backup.sh

# 添加到 crontab（每天凌晨2点自动备份）
crontab -e
# 添加这行：
0 2 * * * cd /var/www/blog/server && ./backup.sh >> ./logs/backup.log 2>&1
```

### 7.2 手动备份
```bash
./backup.sh
```

### 7.3 恢复备份
```bash
# 停止服务
pm2 stop blog-api

# 恢复数据库
gunzip -k backups/blog-backup-日期.db.gz
cp backups/blog-backup-日期.db data/blog.db

# 恢复图片
tar -xzf backups/uploads-日期.tar.gz

# 重启服务
pm2 restart blog-api
```

---

## 8. 故障排查

### 8.1 查看日志
```bash
# PM2 日志
pm2 logs blog-api

# Nginx 日志
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### 8.2 常见问题

#### 问题1：端口被占用
```bash
# 查找占用端口的进程
lsof -i :3001
# 或
netstat -tlnp | grep 3001

# 杀掉进程
kill -9 <PID>
```

#### 问题2：权限错误
```bash
# 修复目录权限
chown -R www-data:www-data /var/www/blog
chmod -R 755 /var/www/blog
```

#### 问题3：数据库锁定
```bash
cd /var/www/blog/server/data
rm -f blog.db-journal
```

#### 问题4：PM2 无法启动
```bash
pm2 delete all
cd /var/www/blog/server
pm2 start npm --name "blog-api" -- start
```

### 8.3 完全重装
```bash
# 1. 停止服务
pm2 delete all
systemctl stop nginx

# 2. 删除文件
rm -rf /var/www/blog

# 3. 重新克隆代码
git clone https://github.com/你的用户名/blog.git /var/www/blog

# 4. 重新配置
cd /var/www/blog/server
npm install
cp .env.example .env
# 编辑 .env

# 5. 重启服务
pm2 start npm --name "blog-api" -- start
systemctl start nginx
```

---

## 🎉 部署完成

访问你的域名应该能看到博客首页！

默认管理员账号：
- 用户名：`admin`（或你在 .env 中设置的用户名）
- 密码：`admin123`（或你在 .env 中设置的密码）

管理后台地址：`https://你的域名.com/admin`

---

## 📞 获取帮助

如有问题，请检查：
1. PM2 状态：`pm2 status`
2. PM2 日志：`pm2 logs blog-api`
3. Nginx 状态：`systemctl status nginx`
4. Nginx 错误日志：`tail -f /var/log/nginx/error.log`

---

## 🔒 安全建议

1. ⚠️ **修改默认密码**（必须）
2. ⚠️ **设置强 JWT 密钥**（必须）
3. ⚠️ **配置防火墙**
   ```bash
   ufw allow 22    # SSH
   ufw allow 80    # HTTP
   ufw allow 443   # HTTPS
   ufw enable
   ```
4. ✅ **定期备份数据**
5. ✅ **保持系统更新**
   ```bash
   apt update && apt upgrade -y
   ```

---

## 📊 性能监控

### 查看资源使用
```bash
htop          # 查看 CPU 和内存
pm2 monit     # PM2 实时监控
```

### 查看访问统计
```bash
tail -f /var/log/nginx/access.log | goaccess -o report.html --
```

---

**祝你部署顺利！🚀**
