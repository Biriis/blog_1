# 一键启动博客（完全重启版）

Write-Host "=== 博客启动脚本 ===" -ForegroundColor Cyan

# 1. 停止所有 Node 进程
Write-Host "停止所有进程..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null | Out-Null
Start-Sleep 3

# 2. 安装后端依赖
Write-Host "安装后端依赖..." -ForegroundColor Yellow
cd e:\trae\blog\server
npm install 2>&1 | Out-Null

# 3. 重新构建前端
Write-Host "构建前端..." -ForegroundColor Yellow
cd e:\trae\blog
npm run build 2>&1 | Out-Null

# 4. 启动后端
Write-Host "启动后端 (端口 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd e:\trae\blog\server; npm start" -WindowStyle Normal
Start-Sleep 3

# 5. 启动前端
Write-Host "启动前端 (端口 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd e:\trae\blog; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "博客已启动！" -ForegroundColor Green
Write-Host "前端: http://localhost:3000" -ForegroundColor White
Write-Host "后端: http://localhost:3001" -ForegroundColor White
Write-Host "账号: admin / admin123" -ForegroundColor Yellow
