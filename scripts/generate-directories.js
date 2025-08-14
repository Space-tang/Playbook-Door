#!/usr/bin/env node

/**
 * 生成目录数据脚本
 * 扫描项目目录中的 __meta__.txt 文件，生成 directories.json
 */

const fs = require('fs')
const path = require('path')

// 简单的 TOML 解析器（针对我们的格式）
function parseToml(content) {
    const result = {}
    const lines = content.split('\n')

    for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue

        const match = trimmed.match(/^(\w+)\s*=\s*(.+)$/)
        if (match) {
            const [, key, value] = match

            // 先去掉注释
            const cleanValue = value.split('#')[0].trim()

            // 处理不同类型的值
            if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
                // 数组格式: ["item1", "item2"]
                try {
                    result[key] = JSON.parse(cleanValue)
                } catch {
                    result[key] = []
                }
            } else if (cleanValue.startsWith("'") && cleanValue.endsWith("'")) {
                // 字符串格式: 'value'
                result[key] = cleanValue.slice(1, -1)
            } else if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
                // 字符串格式: "value"
                result[key] = cleanValue.slice(1, -1)
            } else if (cleanValue === 'true' || cleanValue === 'false') {
                // 布尔值
                result[key] = cleanValue === 'true'
            } else {
                // 其他情况
                result[key] = cleanValue
            }
        }
    }

    return result
}

// 扫描目录获取所有项目
function scanDirectories(rootPath) {
    const directories = []
    const playbookPath = path.join(rootPath, 'playbook')

    // 检查 playbook 目录是否存在
    if (!fs.existsSync(playbookPath)) {
        console.log('playbook 目录不存在，跳过扫描')
        return directories
    }

    try {
        const items = fs.readdirSync(playbookPath, { withFileTypes: true })

        for (const item of items) {
            if (item.isDirectory() && !item.name.startsWith('.')) {
                const dirPath = path.join(playbookPath, item.name)
                const metaPath = path.join(dirPath, '__meta__.txt')

                if (fs.existsSync(metaPath)) {
                    try {
                        const metaContent = fs.readFileSync(metaPath, 'utf-8')
                        const meta = parseToml(metaContent)

                        // 跳过草稿项目
                        if (meta.draft === true) {
                            console.log(`跳过草稿项目: ${item.name}`)
                            continue
                        }

                        // 计算文件数量
                        const fileCount = countFiles(dirPath)

                        // 获取目录统计信息
                        const stats = fs.statSync(dirPath)

                        const directory = {
                            name: meta.title || item.name,
                            directoryName: item.name, // 保存实际的目录名用于跳转
                            description: meta.description || '暂无描述',
                            createdAt: stats.birthtime.toISOString(),
                            updatedAt: stats.mtime.toISOString(),
                            fileCount: fileCount,
                            tags: meta.tag || [],
                            status: 'active',
                            category: meta.class || '未定义',
                            icon: 'Document',
                            color: getColorByCategory(meta.class || '未定义')
                        }

                        directories.push(directory)
                        console.log(`处理项目: ${directory.name} (分类: ${directory.category})`)

                    } catch (error) {
                        console.error(`解析 ${metaPath} 失败:`, error.message)
                    }
                }
            }
        }
    } catch (error) {
        console.error('扫描目录失败:', error.message)
    }

    return directories
}

// 计算目录中的文件数量
function countFiles(dirPath) {
    let count = 0
    try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true })
        for (const item of items) {
            if (item.isFile()) {
                count++
            } else if (item.isDirectory() && !item.name.startsWith('.')) {
                count += countFiles(path.join(dirPath, item.name))
            }
        }
    } catch (error) {
        // 忽略权限错误等
    }
    return count
}

// 根据分类获取颜色
function getColorByCategory(category) {
    const colors = {
        'API': '#67C23A',
        '数据库': '#E6A23C',
        'DevOps': '#F56C6C',
        '模板': '#409EFF',
        '分类1': '#409EFF',
        '未定义': '#909399'
    }
    return colors[category] || '#409EFF'
}

// 主函数
function main() {
    console.log('开始生成目录数据...')

    const rootPath = process.cwd()
    const directories = scanDirectories(rootPath)

    const data = {
        lastUpdate: new Date().toISOString(),
        totalCount: directories.length,
        directories: directories
    }

    const outputPath = path.join(rootPath, 'public', 'directories.json')

    // 确保 public 目录存在
    const publicDir = path.dirname(outputPath)
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')

    console.log(`\n生成完成！`)
    console.log(`- 总项目数: ${directories.length}`)
    console.log(`- 输出文件: ${outputPath}`)

    // 显示分类统计
    const categoryStats = {}
    directories.forEach(dir => {
        categoryStats[dir.category] = (categoryStats[dir.category] || 0) + 1
    })

    console.log('\n分类统计:')
    Object.entries(categoryStats).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} 个项目`)
    })
}

// 运行脚本
if (require.main === module) {
    main()
}

module.exports = { parseToml, scanDirectories }