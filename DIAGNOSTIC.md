# 🔍 问题诊断指南

## 1. 启动前检查

### 检查1：后端API是否正常

```bash
# 启动后端
cd /var/www/blog_1/server
PORT=3001 node index.js

# 测试登录API（使用curl）
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**预期响应：**
```json
{"token":"xxx","user":{"username":"admin","role":"admin"}}
```

**如果收到HTML或404错误：** 后端路由有问题

---

### 检查2：前端代理是否正常

```bash
# 启动前端（新终端）
cd /var/www/blog_1
npm run dev
```

然后在浏览器中：
1. 打开 http://localhost:3000
2. 按 F12 打开开发者工具
3. 切换到 Network 标签
4. 尝试登录
5. 查看请求的 URL 和响应

**预期：**
- 请求 URL: `http://localhost:3000/api/auth/login`
- 响应类型: JSON
- 状态码: 200

**如果看到：**
- URL 变成了 `http://localhost:3001/api/auth/login` → 代理有问题
- 响应是 HTML → 代理没有工作，请求直接到了前端

---

### 检查3：环境变量是否正确加载

在浏览器控制台执行：
```javascript
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_UPLOAD_BASE_URL);
```

**预期输出：**
```javascript
'/api'
'http://localhost:3001'
```

---

## 2. 常见错误及解决方案

### 错误1: "Unexpected token '<', "<!DOCTYPE"... is not valid JSON"

**原因：** 前端收到的不是JSON，而是HTML页面

**解决方案：**
1. 检查浏览器Network中的请求URL
2. 如果URL是 `/api/...`，说明Vite代理正常工作
3. 如果URL是 `http://localhost:3001/api/...`，说明代理失效

**修复方法：**
```bash
# 确保 .env.development 文件存在且内容正确
cat > /var/www/blog_1/.env.development << 'EOF'
VITE_API_URL=/api
VITE_UPLOAD_BASE_URL=http://localhost:3001
EOF

# 重启 Vite 开发服务器
pkill -f vite
npm run dev
```

---

### 错误2: "Failed to fetch"

**原因：** 无法连接到后端API

**解决方案：**
1. 确认后端服务正在运行
2. 检查后端端口是否正确（应该是3001）
3. 检查防火墙设置

**诊断命令：**
```bash
# 检查端口
lsof -i :3001

# 测试后端连接
curl http://localhost:3001/api/articles
```

---

## 3. 完整启动流程

### 步骤1：启动后端（终端1）
```bash
cd /var/www/blog_1/server
PORT=3001 node index.js
```

### 步骤2：启动前端（终端2）
```bash
cd /var/www/blog_1
npm run dev
```

### 步骤3：测试
1. 访问 http://localhost:3000
2. 点击"登录"
3. 输入账密：admin / admin123
4. 观察浏览器控制台的Network请求

---

## 4. 如果仍然有问题

请提供以下信息：

1. **后端日志**（终端1的输出）
2. **浏览器控制台错误信息**
3. **Network请求截图或请求/响应内容**
4. **curl测试结果**

---

## 5. 当前配置状态

### 环境变量
```
.env.development:
  VITE_API_URL=/api
  VITE_UPLOAD_BASE_URL=http://localhost:3001

.env.production:
  VITE_API_URL=http://192.3.159.110:33333/api
  VITE_UPLOAD_BASE_URL=http://192.3.159.110:33333
```

### 后端配置
```
server/.env:
  PORT=3001
  ALLOWED_ORIGIN=http://localhost:3000
```

### Vite代理
```
vite.config.js:
  proxy:
    /api → http://localhost:3001
    /uploads → http://localhost:3001
```

---

## 6. 一键诊断脚本

```bash
cat <<'EOF'
echo "=== 1. 检查后端端口 ==="
lsof -i :3001

echo "=== 2. 检查前端端口 ==="
lsof -i :3000

echo "=== 3. 测试后端API ==="
curl -s http://localhost:3001/api/articles | head -20

echo "=== 4. 检查环境变量文件 ==="
ls -la /var/www/blog_1/.env*
EOF
```

请按照以上步骤进行测试，并告诉我具体的错误信息！
