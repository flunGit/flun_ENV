import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exampleLines } from './env.js';

// 获取当前文件所在目录（相当于 __dirname）
const __filename = fileURLToPath(import.meta.url), __dirname = path.dirname(__filename),
    // 检查项目根目录(向上两级)
    projectRoot = path.resolve(__dirname, '../..'), projectEnvPath = path.join(projectRoot, '.env');

/**
 * 检查并创建 .env 示例文件
 *
 * 若项目根目录不存在 .env 文件,则使用预定义的示例内容生成,并输出相应的提示信息;
 * >查看定义:@see {@link checkAndCreateEnvFile}
 * @returns {boolean} 在 .env 文件已存在或成功创建时返回 `true`,若发生错误则无返回值（`undefined`）
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