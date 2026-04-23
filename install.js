import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exampleLines } from './env.js';

// 获取当前文件所在目录（相当于 __dirname）
const __filename = fileURLToPath(import.meta.url), __dirname = path.dirname(__filename),
    // 检查项目根目录(向上两级)
    projectRoot = path.resolve(__dirname, '../..'), projectEnvPath = path.join(projectRoot, '.env');
/**
 * 检查并创建示例文件
 */
const checkAndCreateEnvFile = () => {
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
if (process.argv[1] === __filename) checkAndCreateEnvFile();
export { checkAndCreateEnvFile };