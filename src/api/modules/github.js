// GitHub API 相关接口
export const githubApi = {
  // 获取仓库目录列表
  async getRepositoryDirectories(owner = 'Space-tang', repo = 'Playbook-Door') {
    try {
      // 方案1: 直接调用 GitHub API
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`)
      const data = await response.json()
      
      // 过滤出目录
      const directories = data.filter(item => item.type === 'dir')
      
      // 为每个目录获取详细信息
      const directoriesWithDetails = await Promise.all(
        directories.map(async (dir) => {
          const details = await this.getDirectoryDetails(owner, repo, dir.name)
          return {
            name: dir.name,
            path: dir.path,
            sha: dir.sha,
            url: dir.html_url,
            ...details
          }
        })
      )
      
      return directoriesWithDetails
    } catch (error) {
      console.error('获取目录列表失败:', error)
      // 如果 GitHub API 失败，尝试读取本地生成的 JSON 文件
      return await this.getDirectoriesFromLocal()
    }
  },

  // 获取目录详细信息
  async getDirectoryDetails(owner, repo, dirName) {
    try {
      // 获取目录内容
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${dirName}`)
      const contents = await response.json()
      
      // 尝试读取目录中的 README.md 或 package.json 获取描述
      let description = '暂无描述'
      let tags = []
      let category = 'other'
      
      // 查找 README 文件
      const readmeFile = contents.find(file => 
        file.name.toLowerCase().includes('readme')
      )
      
      if (readmeFile) {
        const readmeResponse = await fetch(readmeFile.download_url)
        const readmeContent = await readmeResponse.text()
        // 提取第一行作为描述（简单处理）
        const firstLine = readmeContent.split('\n').find(line => line.trim() && !line.startsWith('#'))
        if (firstLine) {
          description = firstLine.trim().substring(0, 100)
        }
      }
      
      // 查找 package.json 文件
      const packageFile = contents.find(file => file.name === 'package.json')
      if (packageFile) {
        try {
          const packageResponse = await fetch(packageFile.download_url)
          const packageData = await packageResponse.json()
          if (packageData.description) {
            description = packageData.description
          }
          if (packageData.keywords) {
            tags = packageData.keywords.slice(0, 4) // 最多取4个标签
          }
          category = 'frontend' // 有 package.json 的通常是前端项目
        } catch (e) {
          console.warn('解析 package.json 失败:', e)
        }
      }
      
      // 根据目录名推断分类和标签
      const dirNameLower = dirName.toLowerCase()
      if (dirNameLower.includes('template') || dirNameLower.includes('starter')) {
        category = 'template'
        tags.push('模板')
      } else if (dirNameLower.includes('api') || dirNameLower.includes('backend')) {
        category = 'api'
        tags.push('API')
      } else if (dirNameLower.includes('database') || dirNameLower.includes('db')) {
        category = 'database'
        tags.push('数据库')
      } else if (dirNameLower.includes('deploy') || dirNameLower.includes('docker') || dirNameLower.includes('k8s')) {
        category = 'devops'
        tags.push('部署')
      }
      
      return {
        description,
        tags: [...new Set(tags)], // 去重
        category,
        fileCount: contents.length,
        createdAt: new Date().toISOString(), // GitHub API 不直接提供创建时间
        updatedAt: new Date().toISOString(),
        status: 'active',
        icon: this.getCategoryIcon(category),
        color: this.getCategoryColor(category)
      }
    } catch (error) {
      console.error(`获取目录 ${dirName} 详情失败:`, error)
      return {
        description: '暂无描述',
        tags: [],
        category: 'other',
        fileCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'static',
        icon: 'Folder',
        color: '#95a5a6'
      }
    }
  },

  // 从本地 JSON 文件获取目录信息（GitHub Actions 生成）
  async getDirectoriesFromLocal() {
    try {
      // 这个文件会由 GitHub Actions 生成
      const response = await fetch('/directories.json')
      const data = await response.json()
      return data.directories || []
    } catch (error) {
      console.error('读取本地目录数据失败:', error)
      return []
    }
  },

  // 根据分类获取图标
  getCategoryIcon(category) {
    const iconMap = {
      template: 'Document',
      api: 'Setting',
      database: 'DataBoard',
      devops: 'Folder',
      frontend: 'Document',
      backend: 'Setting',
      other: 'Folder'
    }
    return iconMap[category] || 'Folder'
  },

  // 根据分类获取颜色
  getCategoryColor(category) {
    const colorMap = {
      template: '#409EFF',
      api: '#67C23A',
      database: '#E6A23C',
      devops: '#F56C6C',
      frontend: '#409EFF',
      backend: '#67C23A',
      other: '#95a5a6'
    }
    return colorMap[category] || '#95a5a6'
  },

  // 获取仓库最后更新时间
  async getRepositoryLastUpdate(owner = 'Space-tang', repo = 'Playbook-Door') {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      const data = await response.json()
      return data.updated_at
    } catch (error) {
      console.error('获取仓库更新时间失败:', error)
      return new Date().toISOString()
    }
  }
}

export default githubApi