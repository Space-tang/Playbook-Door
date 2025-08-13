# 如何更新目录数据

## 🤖 自动更新

系统会在以下情况自动更新：

1. **推送代码到 main 分支**
2. **创建 Pull Request**
3. **每天凌晨 2 点自动检查**
4. **检测到 `__meta__.txt` 文件变化**

## 🔄 手动更新

如果自动更新没有生效，可以手动触发：

### 方法 1：通过 GitHub 网页界面

1. **进入你的 GitHub 仓库**
2. **点击 "Actions" 标签页**
3. **在左侧找到 "Manual Update Directories"**
4. **点击 "Run workflow" 按钮**
5. **点击绿色的 "Run workflow" 确认**

### 方法 2：通过 Git 命令

```bash
# 创建一个空提交来触发更新
git commit --allow-empty -m "触发目录更新"
git push origin main
```

### 方法 3：修改任意文件

```bash
# 修改 README.md 触发更新
echo "" >> README.md
git add README.md
git commit -m "触发目录更新"
git push origin main
```

## 📋 检查更新状态

### 查看 Actions 运行状态

1. **GitHub 仓库 → Actions**
2. **查看最新的 workflow 运行**
3. **点击运行记录查看详细日志**

### 查看生成的数据

访问以下链接查看生成的 JSON 数据：
```
https://你的用户名.github.io/Playbook-Door/directories.json
```

## 🐛 故障排除

### 问题 1：新项目没有显示

**可能原因：**
- `__meta__.txt` 文件格式错误
- `draft = true`（项目被标记为草稿）
- 目录名以 `.` 开头

**解决方案：**
1. 检查 `__meta__.txt` 文件格式
2. 确保 `draft = false`
3. 手动触发更新

### 问题 2：Actions 运行失败

**可能原因：**
- 权限问题
- Node.js 版本问题
- 依赖安装失败

**解决方案：**
1. 检查 Actions 日志
2. 确保仓库有正确的权限设置
3. 重新运行失败的 workflow

### 问题 3：分类没有生成

**可能原因：**
- `class` 字段为空
- TOML 格式错误

**解决方案：**
```toml
# 确保格式正确
class = "你的分类名"  # 使用双引号
```

## 📝 添加新项目的完整流程

### 1. 创建项目目录

```bash
mkdir my-new-project
cd my-new-project
```

### 2. 创建 __meta__.txt 文件

```bash
cat > __meta__.txt << 'EOF'
title = 'My New Project'
description = '这是一个新项目的描述'
class = "API"
tag = ["Node.js", "Express"]
draft = false
EOF
```

### 3. 添加项目文件

```bash
echo "# My New Project" > README.md
echo "console.log('Hello World')" > index.js
```

### 4. 提交到仓库

```bash
cd ..
git add my-new-project/
git commit -m "添加新项目: My New Project"
git push origin main
```

### 5. 等待自动更新

- GitHub Actions 会自动运行
- 大约 2-5 分钟后网站更新
- 新的分类标签页会自动出现

### 6. 如果没有自动更新

按照上面的"手动更新"方法触发更新。

## 🎯 最佳实践

### 1. 项目命名

- 使用有意义的目录名
- 避免使用特殊字符
- 不要以 `.` 开头

### 2. __meta__.txt 格式

```toml
title = '项目标题'                    # 必填
description = '项目描述'              # 必填  
class = "分类名"                     # 推荐填写
tag = ["标签1", "标签2"]             # 可选
draft = false                       # 确保不是草稿
```

### 3. 分类命名

- 使用简洁明了的分类名
- 支持中文分类
- 保持分类的一致性

### 4. 定期检查

- 定期查看 Actions 运行状态
- 确保网站数据是最新的
- 及时处理失败的 workflow

## 🚀 高级用法

### 批量添加项目

```bash
# 创建多个项目的脚本
for project in api-service web-frontend mobile-app; do
  mkdir $project
  cat > $project/__meta__.txt << EOF
title = '$project'
description = '这是 $project 项目'
class = "开发项目"
tag = ["项目"]
draft = false
EOF
done

git add .
git commit -m "批量添加项目"
git push origin main
```

### 使用不同的分类

```toml
# API 项目
class = "API"

# 前端项目  
class = "前端"

# 数据库项目
class = "数据库"

# 工具项目
class = "工具"

# 文档项目
class = "文档"
```

---

**💡 提示：如果遇到问题，可以随时通过 GitHub Issues 寻求帮助！**