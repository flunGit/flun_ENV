const fs = require('fs');
const path = require('path');
const { exampleLines } = require('./env');

// 检查项目根目录
const packageDir = __dirname, projectRoot = path.resolve(packageDir, '../..'), // 向上两级到项目根目录
    projectEnvPath = path.join(projectRoot, '.env');
// 检查并创建示例文件
function checkAndCreateEnvFile() {
    console.log('🔍 检查 .env 环境变量文件...'), console.log(`📁 项目根目录: ${projectRoot}`);
    try {
        if (fs.existsSync(projectEnvPath)) return true;  // 检查项目根目录
        console.log('⚠️  在项目根目录未找到 .env 文件，正在创建...');

        const formattedContent = exampleLines.join('\n'); // 动态处理示例内容
        fs.writeFileSync(projectEnvPath, formattedContent, 'utf8');
        console.log(`✓ 已创建 .env 示例文件: ${projectEnvPath}`), console.log('📝 请在该文件中添加环境变量');
        return true;
    } catch (error) {
        console.error('✗ 创建 .env 文件失败:', error.message);
    }
}

// 执行脚本并导出函数
if (require.main === module) checkAndCreateEnvFile();
module.exports = { checkAndCreateEnvFile };