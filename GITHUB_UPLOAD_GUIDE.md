# 上传项目到 GitHub 指南

## 前提条件

1. ✅ Git 已安装（已验证）
2. ✅ 项目已初始化 Git 仓库（已完成）
3. ✅ 有初始提交（已完成）

## 第一步：创建 GitHub 仓库

### 方法 A：通过 GitHub 网页（推荐新手）

1. 打开浏览器访问：https://github.com/new

2. 填写信息：
   - **Repository name**: `blog`
   - **Description**: `个人博客系统 - React + Express + SQLite`
   - **Public** 或 **Private**：选择 Public（公开）或 Private（私有）
   - ✅ 不要勾选 "Add a README file"（我们已有）
   - ✅ 不要勾选 "Add .gitignore"（我们已创建）
   
3. 点击 **"Create repository"**

4. **重要**：在下一页，你会看到 "…or push an existing repository from the command line" 部分，复制那两行命令（类似于）：
   ```
   git remote add origin https://github.com/Biriis/blog.git
   git branch -M main
   git push -u origin main
   ```

5. 在你的项目目录（`e:\trae\blog`）中打开终端，运行这些命令

---

### 方法 B：通过命令行创建（需要 GitHub Personal Access Token）

#### 1. 创建 Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 设置：
   - **Note**: "Git upload token"
   - **Expiration**: 30 天（建议）
   - **Select scopes**: ✅ 勾选 `repo` (全部)
4. 点击 **"Generate token"**
5. **⚠️ 重要**：立即复制并保存 token（只显示一次！）

#### 2. 创建仓库并推送

在 `e:\trae\blog` 目录打开终端，依次执行：

```bash
# 添加远程仓库（替换 YOUR_TOKEN 为你的 token）
git remote add origin https://YOUR_TOKEN@github.com/Biriis/blog.git

# 重命名分支为 main（GitHub 默认分支是 main）
git branch -M main

# 推送代码
git push -u origin main
```

---

## 第二步：验证上传成功

1. 打开浏览器访问：`https://github.com/Biriis/blog`
2. 应该能看到所有项目文件
3. 检查是否有 `.gitignore` 文件显示

## 第三步：设置仓库信息（可选但推荐）

在 GitHub 仓库页面点击 **"Settings"**：

1. **Description**: `个人博客系统 - React + Express + SQLite`
2. **Website**: 可以填写部署后的网站地址（如果有）
3. **Topics**: 添加标签，如 `blog`, `react`, `express`

## 常见问题

### 1. 推送被拒绝（non-fast-forward）

如果出现错误：
```
! [rejected]        main -> main (non-fast-forward)
```

解决方法：
```bash
# 先拉取远程更改（如果有）
git pull origin main --allow-unrelated-histories

# 然后再推送
git push -u origin main
```

### 2. 认证失败

如果提示认证失败：
- 确保使用了正确的 Personal Access Token
- Token 需要有 `repo` 权限

### 3. 仓库已存在

如果提示仓库已存在：
- 先删除 GitHub 上的仓库（Settings → Danger Zone → Delete this repository）
- 或者使用不同的仓库名

## 后续更新代码

以后更新代码时，只需要：

```bash
# 1. 添加修改的文件
git add .

# 2. 提交更改
git commit -m "描述你的更改"

# 3. 推送到 GitHub
git push
```

## 🎉 完成！

恭喜！你的博客项目已成功上传到 GitHub！

仓库地址：https://github.com/Biriis/blog

---

## 下一步建议

1. **📝 完善 README.md**：
   - 添加项目说明
   - 安装和运行步骤
   - 功能列表
   - 截图

2. **🌐 配置 GitHub Pages**（如果你想用 GitHub 托管前端）：
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: 选择 `gh-pages` 或 `main`

3. **🔒 保持仓库私有**：
   - 如果不想公开代码，改为 Private

4. **📦 添加徽章**：
   - 可以添加构建状态、许可证等徽章

5. **🤝 参与开源**：
   - 可以尝试给其他开源项目贡献代码
   - 学习 Git 协作流程
