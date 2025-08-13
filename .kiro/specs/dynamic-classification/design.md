# 设计文档

## 概述

动态分类系统将通过解析 `__meta__.txt` 文件中的 `class` 字段来自动生成分类标签页。系统将替换当前硬编码的分类逻辑，实现基于实际数据的动态分类展示。

## 架构

### 数据流程
1. 系统从 `directories.json` 或 GitHub API 获取目录数据
2. 对每个目录项，提取其 `category` 字段（对应 `__meta__.txt` 中的 `class` 字段）
3. 动态生成分类列表和计数
4. 渲染分类标签页和筛选逻辑

### 组件结构
- **Home.vue**: 主组件，包含分类逻辑
- **categories computed**: 动态计算分类列表
- **filteredDirectories computed**: 基于选中分类筛选目录

## 组件和接口

### 数据模型更新

#### Directory 对象结构
```javascript
{
  name: string,           // 项目名称
  description: string,    // 项目描述
  category: string,       // 分类（来自 __meta__.txt 的 class 字段）
  tags: string[],        // 标签数组
  // ... 其他现有字段
}
```

#### 分类对象结构
```javascript
{
  key: string,      // 分类的唯一标识
  label: string,    // 显示名称
  count: number     // 该分类下的项目数量
}
```

### 核心方法

#### `generateDynamicCategories(directories)`
- **输入**: 目录数组
- **输出**: 分类对象数组
- **功能**: 
  - 提取所有唯一的 category 值
  - 为空或未定义的 category 设置为 "未定义"
  - 计算每个分类的项目数量
  - 按指定顺序排序（全部 → 字母顺序 → 未定义）

#### `normalizeCategory(category)`
- **输入**: 原始分类字符串
- **输出**: 标准化的分类字符串
- **功能**: 处理空值、null、undefined，统一转换为 "未定义"

## 数据模型

### 分类生成逻辑
```javascript
const generateDynamicCategories = (directories) => {
  // 1. 提取所有分类
  const categorySet = new Set()
  directories.forEach(dir => {
    const category = normalizeCategory(dir.category)
    categorySet.add(category)
  })
  
  // 2. 生成分类对象
  const dynamicCategories = Array.from(categorySet).map(category => ({
    key: category,
    label: category,
    count: directories.filter(d => normalizeCategory(d.category) === category).length
  }))
  
  // 3. 排序：字母顺序，未定义放最后
  dynamicCategories.sort((a, b) => {
    if (a.key === '未定义') return 1
    if (b.key === '未定义') return -1
    return a.key.localeCompare(b.key, 'zh-CN')
  })
  
  // 4. 添加"全部"选项
  return [
    { key: 'all', label: '全部', count: directories.length },
    ...dynamicCategories
  ]
}
```

### 筛选逻辑更新
```javascript
const filteredDirectories = computed(() => {
  let result = directories.value

  // 按分类过滤 - 使用动态分类
  if (activeCategory.value !== 'all') {
    result = result.filter(d => {
      const normalizedCategory = normalizeCategory(d.category)
      return normalizedCategory === activeCategory.value
    })
  }

  // 搜索筛选保持不变
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(d =>
      d.name.toLowerCase().includes(keyword) ||
      d.description.toLowerCase().includes(keyword) ||
      d.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  return result
})
```

## 错误处理

### 数据异常处理
1. **空数据**: 当 `directories` 为空时，只显示"全部"标签页
2. **无效分类**: 将 null、undefined、空字符串统一处理为"未定义"
3. **数据格式错误**: 提供默认值，确保系统正常运行

### 用户体验优化
1. **加载状态**: 在数据加载期间显示加载指示器
2. **空状态**: 当筛选结果为空时显示友好的空状态提示
3. **错误反馈**: 数据加载失败时提供重试选项

## 测试策略

### 单元测试
1. `generateDynamicCategories` 函数测试
   - 正常分类数据
   - 包含"未定义"分类的数据
   - 空数据数组
   - 重复分类数据

2. `normalizeCategory` 函数测试
   - null/undefined 输入
   - 空字符串输入
   - 正常字符串输入

### 集成测试
1. 分类标签页渲染测试
2. 分类筛选功能测试
3. 搜索与分类组合筛选测试

### 用户界面测试
1. 分类标签页交互测试
2. 响应式布局测试
3. 数据刷新后的分类更新测试

## 实现注意事项

### 性能考虑
1. 使用 `computed` 属性缓存分类计算结果
2. 避免在模板中进行复杂计算
3. 合理使用 `v-memo` 优化列表渲染

### 兼容性
1. 保持与现有数据结构的兼容性
2. 渐进式升级，不影响现有功能
3. 支持旧版本数据格式的回退处理

### 国际化支持
1. 分类名称支持中文排序
2. "未定义"标签支持多语言
3. 预留国际化扩展接口