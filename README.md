# Playbook Door 🚪

一个动态目录展示平台，自动同步 GitHub 仓库中的目录结构并以精美的卡片形式展示。

![Playbook Door](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js)
![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-2088FF?style=flat-square&logo=github-actions)
![Element Plus](https://img.shields.io/badge/Element-Plus-409EFF?style=flat-square)

## 🌟 项目背景

这个项目的目的是为 GitHub 仓库创建一个美观的目录展示页面，类似于应用市场的卡片式布局。它会自动扫描仓库中的目录，提取项目信息，并生成一个响应式的展示网站。

**主要特性：**
- � 自动同步仓库目*录变化
- 🎨 现代化卡片设计界面  
- 🤖 智能分类和标签系统
- � 搜索零和筛选功能
- 📱 完美的响应式设计
- � 零配置 GitHub Pages 部署

## 📋 目录

- [快速开始](#-快速开始)
- [更换目标仓库](#-更换目标仓库)
- [项目配置](#-项目配置)
- [故障排除](#-故障排除)

## 🚀 快速开始

### 1. Fork 仓库
点击右上角的 "Fork" 按钮，将仓库 Fork 到你的 GitHub 账户。

### 2. 启用 GitHub Pages（重要！）
1. 进入你 Fork 的仓库
2. 点击 **Settings** → **Pages**
3. 在 "Source" 下拉菜单选择 **GitHub Actions**
4. 保存设置

> ⚠️ **注意**：如果你看到 "Pages site failed" 错误，说明还没有启用 Pages。请确保完成上述步骤后再运行 Actions。

### 3. 等待自动部署
- GitHub Actions 会自动构建和部署
- 在 **Actions** 标签页查看部署进度
- 通常需要 2-5 分钟完成

### 4. 访问你的网站
```
https://你的用户名.github.io/Playbook-Door/
```

## 🔄 更换目标仓库

如果你想让这个展示平台显示其他仓库的目录（而不是当前仓库），需要进行以下配置：

### 方法一：使用 Git Submodule（推荐）

1. **添加目标仓库作为 submodule**
   ```bash
   # 删除现有的 playbook submodule（如果存在）
   git submodule deinit playbook
   git rm playbook
   
   # 添加你的目标仓库
   git submodule add https://github.com/你的用户名/你的目标仓库.git playbook
   git commit -m "更换目标仓库为你的目标仓库"
   git push origin main
   ```

2. **更新 .gitmodules 文件**
   ```ini
   [submodule "playbook"]
       path = playbook
       url = https://github.com/你的用户名/你的目标仓库.git
   ```

### 方法二：修改扫描路径

如果你想直接扫描当前仓库的某个目录：

1. **修改 `scripts/generate-directories.js`**
   ```javascript
   // 找到这一行
   const baseDir = path.join(__dirname, '..', 'playbook')
   
   // 改为你想扫描的目录
   const baseDir = path.join(__dirname, '..', '你的目录名')
   // 或者扫描当前仓库根目录
   const baseDir = path.join(__dirname, '..')
   ```

2. **修改 GitHub Actions 工作流**
   
   编辑 `.github/workflows/deploy.yml`，找到 submodule 相关的步骤并删除或修改：
   ```yaml
   # 删除或注释掉这些 submodule 相关的步骤
   # - name: Update submodule to latest and generate directories data
   #   run: |
   #     git submodule update --init --recursive --remote
   #     # ... 其他 submodule 相关命令
   ```

### 方法三：修改仓库链接

如果你想修改卡片点击后跳转的仓库地址：

编辑 `src/view/Home.vue` 中的 `openDirectory` 方法：
```javascript
const openDirectory = (directory) => {
    // 修改这里的仓库地址
    const githubUrl = `https://github.com/你的用户名/你的目标仓库/tree/main/${directoryName}`
    window.open(githubUrl, '_blank')
}
```

### 配置说明

- **Submodule 方式**：适合展示其他仓库的内容，会自动同步目标仓库的更新
- **直接扫描方式**：适合展示当前仓库的内容，配置更简单
- **混合方式**：可以同时扫描多个目录或仓库

## ⚙️ 项目配置

### 自定义项目信息

在每个项目目录下创建 `__meta__.txt` 文件来定义项目的元数据：

```toml
title = 'My Project'                    # 项目标题
description = '项目描述信息'             # 项目描述  
class = "API"                          # 项目分类
tag = ["Node.js", "Express"]           # 项目标签
draft = false                          # 是否为草稿
```

### 修改网站信息

编辑 `src/view/Home.vue` 修改网站标题和描述：
```vue
<h1>你的网站标题</h1>
<p>你的网站描述</p>
```



## 🔍 故障排除

### 常见问题

1. **"Pages site failed" 错误**
   ```
   Error: Get Pages site failed. Please verify that the repository has Pages enabled
   ```
   **解决方案**：
   - 进入 `Settings` → `Pages`
   - 确保 Source 选择了 `GitHub Actions`
   - 如果是第一次设置，可能需要等待几分钟生效

2. **GitHub Actions 执行失败**
   - 检查仓库权限：`Settings` → `Actions` → `General` → `Read and write permissions`
   - 确保勾选了 `Allow GitHub Actions to create and approve pull requests`

3. **网站无法访问**
   - 确认 Pages 设置正确
   - 等待部署完成（通常需要 2-5 分钟）
   - 检查 Actions 是否成功运行

4. **新目录没有显示**
   - 手动触发：`Actions` → `Run workflow`
   - 检查目录是否包含有效文件

## 📄 许可证

MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**