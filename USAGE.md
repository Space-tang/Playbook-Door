# 使用说明：动态分类系统

## 📋 概述

Playbook Door 现在支持动态分类系统！系统会自动扫描项目目录中的 `__meta__.txt` 文件，根据 `class` 字段生成分类标签页。

## 🔄 数据流程

```
__meta__.txt (TOML格式) → GitHub Actions → directories.json → Vue.js 前端
```

### 1. 源数据：`__meta__.txt` 文件

每个项目目录下的元数据文件：

```toml
title = 'My First Post' # 必填
description = 'Docker 容器化配置、Kubernetes 部署文件、CI/CD 流水线脚本，实现应用的自动化部署和运维' # 必填
class = "分类1" # 如果未定义, 默认：未定义
tag = ["Docker","容器化"] # 如果未定义, 默认：空
draft = false # 如果未定义， false, 也就是可以发布,true 就忽略。
```

### 2. 中间数据：`directories.json` 文件

GitHub Actions 生成的 JSON 文件：

```json
{
  "lastUpdate": "2024-01-20T10:30:00Z",
  "totalCount": 1,
  "directories": [
    {
      "name": "My First Post",
      "description": "Docker 容器化配置...",
      "category": "分类1",  // 来自 __meta__.txt 的 class 字段
      "tags": ["Docker", "容器化"],
      "status": "active",
      "fileCount": 5,
      "icon": "Document",
      "color": "#409EFF"
    }
  ]
}
```

### 3. 前端展示：Vue.js 动态分类

前端读取 `directories.json` 并动态生成分类标签页：

- **全部** (1个项目)
- **分类1** (1个项目)

## 🚀 快速开始

### 步骤 1：创建项目目录

```bash
mkdir my-awesome-project
cd my-awesome-project
```

### 步骤 2：创建 `__meta__.txt` 文件

```bash
cat > __meta__.txt << 'EOF'
title = 'Awesome Project'
description = '这是一个很棒的项目，展示了某些功能'
class = "API"
tag = ["Node.js", "Express", "REST"]
draft = false
EOF
```

### 步骤 3：添加项目文件

```bash
echo "# Awesome Project" > README.md
echo "console.log('Hello World')" > index.js
```

### 步骤 4：提交到仓库

```bash
cd ..
git add my-awesome-project/
git commit -m "添加 Awesome Project"
git push origin main
```

### 步骤 5：等待自动部署

- GitHub Actions 会自动运行
- 扫描 `my-awesome-project/__meta__.txt` 文件
- 生成新的 `directories.json` 文件
- 部署到 GitHub Pages

### 步骤 6：查看结果

访问你的网站，现在应该看到：

- **全部** (2个项目)
- **API** (1个项目) ← 新增的分类
- **分类1** (1个项目)

## 📝 字段说明

| 字段 | 必填 | 类型 | 说明 | 示例 |
|------|------|------|------|------|
| `title` | ✅ | 字符串 | 项目标题 | `'My Project'` |
| `description` | ✅ | 字符串 | 项目描述 | `'这是一个很棒的项目'` |
| `class` | ❌ | 字符串 | 项目分类 | `"API"` |
| `tag` | ❌ | 数组 | 项目标签 | `["Node.js", "REST"]` |
| `draft` | ❌ | 布尔值 | 是否为草稿 | `false` |

## 🎯 分类规则

### 自动分类

- 如果 `class` 字段存在且不为空 → 使用该值作为分类
- 如果 `class` 字段不存在或为空 → 自动归类为"未定义"

### 分类合并

相同 `class` 值的项目会自动合并：

```toml
# 项目A
class = "API"

# 项目B  
class = "API"

# 项目C
class = "数据库"
```

**结果：**
- **全部** (3个项目)
- **API** (2个项目) ← 项目A和B合并
- **数据库** (1个项目)

### 排序规则

1. **全部** - 始终排在第一位
2. **其他分类** - 按字母顺序排序
3. **未定义** - 始终排在最后

## 🔧 高级用法

### 草稿功能

设置 `draft = true` 可以隐藏项目：

```toml
title = 'Work in Progress'
description = '正在开发中的项目'
class = "API"
draft = true  # 这个项目不会在网站上显示
```

### 多语言分类

支持中文分类名：

```toml
class = "前端模板"
class = "后端API"
class = "数据库设计"
class = "运维脚本"
```

### 特殊字符处理

分类名会自动处理空格和特殊字符：

```toml
class = "  API 项目  "  # 会被处理为 "API 项目"
class = ""              # 会被处理为 "未定义"
```

## 🐛 故障排除

### 问题 1：项目没有显示

**可能原因：**
- `draft = true`
- `__meta__.txt` 文件格式错误
- 目录名以 `.` 开头

**解决方案：**
```bash
# 检查 __meta__.txt 文件
cat your-project/__meta__.txt

# 确保 draft = false
# 确保文件格式正确
```

### 问题 2：分类没有生成

**可能原因：**
- `class` 字段为空或不存在
- TOML 格式错误

**解决方案：**
```toml
# 确保 class 字段格式正确
class = "你的分类名"  # 使用双引号
```

### 问题 3：GitHub Actions 失败

**可能原因：**
- TOML 解析错误
- 权限问题

**解决方案：**
```bash
# 检查 Actions 日志
仓库 → Actions → 查看最新运行的详细日志

# 检查文件格式
# 确保所有字符串都用引号包围
# 确保数组格式正确：["item1", "item2"]
```

## 📚 示例项目

### API 项目

```toml
title = 'User Management API'
description = '用户管理系统的 RESTful API，支持注册、登录、权限管理等功能'
class = "API"
tag = ["Node.js", "Express", "MongoDB", "JWT"]
draft = false
```

### 前端项目

```toml
title = 'Admin Dashboard'
description = '基于 Vue.js 的管理后台，包含用户管理、数据统计、系统设置等模块'
class = "前端"
tag = ["Vue.js", "Element Plus", "Dashboard"]
draft = false
```

### 数据库项目

```toml
title = 'E-commerce Database Schema'
description = '电商系统数据库设计，包含商品、订单、用户、支付等核心表结构'
class = "数据库"
tag = ["MySQL", "Schema", "E-commerce"]
draft = false
```

### 工具项目

```toml
title = 'Deployment Scripts'
description = '自动化部署脚本集合，支持 Docker、Kubernetes、CI/CD 等场景'
class = "DevOps"
tag = ["Docker", "Kubernetes", "Shell", "CI/CD"]
draft = false
```

## 🎉 完成！

现在你已经了解了如何使用动态分类系统。每次添加新项目时，只需要：

1. 创建项目目录
2. 添加 `__meta__.txt` 文件
3. 设置合适的 `class` 字段
4. 提交到仓库

系统会自动处理其余的工作！