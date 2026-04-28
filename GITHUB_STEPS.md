# 手动上传到 GitHub（推荐）

由于脚本遇到问题，这里是手动执行的步骤：

## 步骤 1：创建 GitHub 仓库

1. 打开浏览器访问：https://github.com/new
2. Repository name: `blog`
3. Description: `个人博客系统 - React + Express + SQLite`
4. 选择 Public 或 Private
5. **不要勾选** "Add a README file"
6. **不要勾选** "Add .gitignore"
7. 点击 "Create repository"

## 步骤 2：在 PowerShell 中执行以下命令

打开 PowerShell，进入项目目录：

```powershell
cd e:\trae\blog
```

然后依次执行：

```powershell
# 添加远程仓库（把 YOUR_TOKEN_HERE 替换成你的 token）
git remote add origin https://YOUR_TOKEN_HERE@github.com/Biriis/blog.git

# 重命名分支
git branch -M main

# 推送代码
git push -u origin main
```

## 示例（假设你的 token 是 abc123）

```powershell
git remote add origin https://abc123@github.com/Biriis/blog.git
git branch -M main
git push -u origin main
```

## 获取 Token 的步骤

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 填写：
   - Note: `blog-upload`
   - Expiration: `30 days`
   - Scopes: 勾选 `repo` (全部)
4. 点击 "Generate token"
5. **复制 token**（只显示一次！）

## 验证成功

上传成功后，访问：https://github.com/Biriis/blog

应该能看到所有文件！
