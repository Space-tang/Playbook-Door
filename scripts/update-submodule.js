#!/usr/bin/env node

/**
 * 更新 submodule 脚本
 * 用于自动更新 playbook submodule 到最新版本
 */

const { execSync } = require('child_process')
const fs = require('fs')

function updateSubmodule() {
    try {
        console.log('🔄 开始更新 submodule...')
        
        // 检查 playbook 目录是否存在
        if (!fs.existsSync('playbook')) {
            console.log('❌ playbook 目录不存在')
            return false
        }
        
        // 更新 submodule
        console.log('📥 拉取 submodule 最新代码...')
        execSync('git submodule update --remote --merge', { stdio: 'inherit' })
        
        // 检查是否有更新
        const status = execSync('git status --porcelain', { encoding: 'utf8' })
        
        if (status.includes('playbook')) {
            console.log('✅ Submodule 已更新')
            
            // 提交 submodule 更新
            execSync('git add playbook', { stdio: 'inherit' })
            execSync('git commit -m "更新 playbook submodule"', { stdio: 'inherit' })
            
            console.log('📤 已提交 submodule 更新')
            return true
        } else {
            console.log('ℹ️  Submodule 已是最新版本')
            return false
        }
        
    } catch (error) {
        console.error('❌ 更新 submodule 失败:', error.message)
        return false
    }
}

// 主函数
function main() {
    console.log('🚀 Submodule 更新脚本启动')
    
    const updated = updateSubmodule()
    
    if (updated) {
        console.log('🎉 Submodule 更新完成！')
    } else {
        console.log('✨ 无需更新')
    }
}

// 运行脚本
if (require.main === module) {
    main()
}

module.exports = { updateSubmodule }