# Submodule 自动更新设置

## 📋 概述

现在 Playbook-Door 使用 Git Submodule 架构：

- **主仓库**: `Playbook-Door` - 展示平台代码
- **子模块**: `PlayBook` - 存放实际的项目目录
- **目录结构**: `playbook/项目名/__meta__.txt`

## 🔧 当前配置

### 1. Submodule 配置
```bash
# .gitmodules
[submodule "playbook"]
    path = playbook
    url = https://github.com/Space-tang/PlayBook.git
```

### 2. 目录扫描
- 只扫描 `playbook/` 目录下的项目
- 每个项目需要有 `__meta__.txt` 文件
- 点击卡片跳转到 `https://github.com/Space-tang/PlayBook/tree/main/项目名`

### 3. 自动更新触发
- 推送到 main 分支时
- 手动触发 workflow
- 每天凌晨 2 点自动检查
- PlayBook 仓库更新时（需要设置 webhook）

## 🚀 设置 PlayBook 仓库的自动触发

### 方法 1: GitHub Webhook（推荐）

1. **进入 PlayBook 仓库设置**
   ```
   https://github.com/Space-tang/PlayBook/settings/hooks
   ```

2. **添加 Webhook**
   - Payload URL: `https://api.github.com/repos/Space-tang/Playbook-Door/dispatches`
   - Content type: `application/json`
   - Secret: 留空或设置一个密钥
   - Events: 选择 "Just the push event"

3. **Webhook Payload**
   ```json
   {
     "event_type": "submodule-update",
     "client_payload": {
       "repository": "PlayBook",
       "ref": "main"
     }
   }
   ```

### 方法 2: GitHub Actions（在 PlayBook 仓库中）

在 PlayBook 仓库创建 `.github/workflows/notify-parent.yml`:

```yaml
name: Notify Parent Repository

on:
  push:
    branches: [ main ]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
    - name: Trigger parent repository update
      run: |
        curl -X POST \
          -H "Accept: application/vnd.github.v3+json" \
          -H "Authorization: token ${{ secrets.PARENT_REPO_TOKEN }}" \
          https://api.github.com/repos/Space-tang/Playbook-Door/dispatches \
          -d '{"event_type":"submodule-update"}'
```

**注意**: 需要在 PlayBook 仓库的 Secrets 中添加 `PARENT_REPO_TOKEN`

## 📝 使用流程

### 1. 在 PlayBook 仓库添加新项目

```bash
# 在 PlayBook 仓库中
mkdir my-new-project
cd my-new-project

# 创建 __meta__.txt
cat > __meta__.txt << 'EOF'
title = 'My New Project'
description = '这是一个新项目的描述'
class = "API"
tag = ["Node.js", "Express"]
draft = false
EOF

# 添加项目文件
echo "# My New Project" > README.md

# 提交
git add .
git commit -m "添加新项目: My New Project"
git push origin main
```

### 2. 自动更新流程

1. **PlayBook 仓库更新** → 触发 webhook
2. **Playbook-Door 仓库** → 接收 webhook，运行 GitHub Actions
3. **GitHub Actions** → 更新 submodule，扫描项目，生成数据，部署网站
4. **网站更新** → 新项目自动显示

### 3. 手动更新（如果自动更新失败）

```bash
# 在 Playbook-Door 仓库中
npm run update-submodule  # 更新 submodule
npm run generate          # 重新生成数据
```

或者在 GitHub 网页界面：
1. 进入 Actions 页面
2. 选择 "Build and Deploy to GitHub Pages"
3. 点击 "Run workflow"

## 🔍 验证设置

### 1. 检查 Submodule 状态
```bash
git submodule status
```

### 2. 检查生成的数据
```bash
npm run generate
cat public/directories.json
```

### 3. 检查网站
访问: `https://你的用户名.github.io/Playbook-Door/`

## 🐛 故障排除

### 问题 1: Submodule 没有更新

**解决方案**:
```bash
git submodule update --remote --merge
git add playbook
git commit -m "更新 submodule"
git push
```

### 问题 2: 新项目没有显示

**检查**:
1. `playbook/项目名/__meta__.txt` 文件是否存在
2. `draft = false` 是否设置正确
3. GitHub Actions 是否运行成功

### 问题 3: Webhook 没有触发

**检查**:
1. PlayBook 仓库的 webhook 设置是否正确
2. Payload URL 是否正确
3. GitHub Actions 日志中是否有错误

## 📊 当前项目结构

```
Playbook-Door/
├── playbook/              # Git Submodule
│   ├── test1/
│   │   └── __meta__.txt
│   ├── test2/
│   │   └── __meta__.txt
│   └── ...
├── src/
├── public/
│   └── directories.json   # 自动生成
├── scripts/
│   ├── generate-directories.js
│   └── update-submodule.js
└── .github/workflows/
    └── deploy.yml
```

## 🎯 最佳实践

1. **项目命名**: 使用有意义的目录名，避免特殊字符
2. **__meta__.txt 格式**: 确保格式正确，特别是 `draft = false`
3. **定期检查**: 定期查看 GitHub Actions 运行状态
4. **测试流程**: 添加新项目后，等待几分钟查看网站是否更新

---

**💡 提示**: 如果遇到问题，可以查看 GitHub Actions 的详细日志来诊断问题！