import fs from 'fs';
import path from 'path';
import { homedir } from 'os';
import { exampleLines } from './env.js';

class EnvLoader {
    constructor(options = {}) {
        this.options = { ...options }, this.variables = {}, this.loaded = false, this.load(); // 自动加载

        // 返回代理实例以实现 env.变量名 的访问方式
        return new Proxy(this, {
            get: (target, prop) => {
                const variables = target.getAll();
                if (prop in variables) return variables[prop];
                if (prop in target) return target[prop];
                return undefined;
            },
            set(target, prop, value) {
                console.warn('⚠️  警告: 环境变量应在 .env 文件中设置');
                return false;
            }
        });
    }

    // 转义字符处理
    #unescape(str) {
        return str.replace(/\\(.)/g, (_, char) => {
            if (char === 'n') return '\n';
            if (char === 't') return '\t';
            if (char === 'r') return '\r';
            return char;
        });
    }

    // 解析 .env 文件内容
    #parse(content) {
        const lines = content.split('\n'), result = {};
        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('#')) continue;

            const equalsIndex = line.indexOf('=');
            if (equalsIndex === -1) continue;

            const key = line.slice(0, equalsIndex).trim();
            let valuePart = line.slice(equalsIndex + 1).trimStart();

            if (valuePart === '') {
                result[key] = '';
                if (this.options.debug) console.log(`✓ 加载变量: ${key} = (空)`);
                continue;
            }

            const firstChar = valuePart[0];
            if (firstChar === '"' || firstChar === "'") {
                let endQuoteIndex = -1, inEscape = false;
                for (let i = 1; i < valuePart.length; i++) {
                    if (!inEscape && valuePart[i] === firstChar) {
                        endQuoteIndex = i;
                        break;
                    }
                    inEscape = valuePart[i] === '\\' && !inEscape;
                }
                if (endQuoteIndex !== -1) {
                    const quotedValue = valuePart.slice(1, endQuoteIndex), rest = valuePart.slice(endQuoteIndex + 1).trimStart();
                    if (rest && rest[0] === '#'); // 注释,忽略
                    else if (rest && this.options.debug) console.warn(`⚠️ 忽略值后的多余内容: ${rest}`);

                    result[key] = this.#unescape(quotedValue);
                }
                else result[key] = valuePart; // 未闭合引号，按原样处理
            } else {
                let value, rest;
                const commentIndex = valuePart.indexOf('#');
                if (commentIndex !== -1)
                    value = valuePart.slice(0, commentIndex).trimEnd(), rest = valuePart.slice(commentIndex).trimStart();
                else {
                    const firstWhitespace = valuePart.search(/\s/);
                    if (firstWhitespace === -1) value = valuePart, rest = '';
                    else value = valuePart.slice(0, firstWhitespace), rest = valuePart.slice(firstWhitespace).trimStart();
                }

                if (rest && rest[0] === '#'); // 注释,忽略
                else if (rest && this.options.debug) console.warn(`⚠️ 忽略值后的多余内容: ${rest}`);

                result[key] = value;
            }

            if (this.options.debug) console.log(`✓ 加载变量: ${key} = ${result[key]}`);
        }
        return result;
    }

    // 查找文件
    #findFile(customPath) {
        let createPath;

        if (customPath && customPath !== '.env') {
            createPath = path.isAbsolute(customPath) ? customPath : path.resolve(process.cwd(), customPath);
            try {
                const stat = fs.statSync(createPath);
                if (stat.isFile()) return { found: true, path: createPath, createPath };
                throw new Error(`指定路径存在但不是文件: ${createPath}`);
            } catch (error) {
                if (error.code === 'ENOENT') return { found: false, path: null, createPath };
                throw error;
            }
        }

        const fileName = '.env', possiblePaths = [path.join(process.cwd(), fileName), path.join(homedir(), fileName)];
        for (const filePath of possiblePaths) {
            try {
                if (fs.statSync(filePath).isFile()) return { found: true, path: filePath, createPath: filePath };
            } catch (error) { }
        }

        createPath = path.join(process.cwd(), fileName);
        return { found: false, path: null, createPath };
    }

    // 创建示例文件
    #createExampleFile(filePath, exampleContent) {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            fs.writeFileSync(filePath, exampleContent, 'utf8');
            console.log(`✓ 已创建示例文件:${filePath};请编辑环境变量后重新运行程序`), process.exit(1);
        } catch (error) {
            console.error('✗ 创建示例文件失败:', error.message);
            process.exit(1);
        }
    }

    // 加载环境变量
    load() {
        if (this.loaded) return this.variables;

        let result;
        try {
            result = this.#findFile(this.options.path);
        } catch (error) {
            console.error('❌ 环境变量文件路径无效:', error.message);
            process.exit(1);
        }

        if (!result.found) {
            console.log('未找到 .env 文件!💡 正在为您创建...');
            this.#createExampleFile(result.createPath, exampleLines.join('\n'));
            return this.variables;
        }

        try {
            const content = fs.readFileSync(result.path, this.options.encoding);
            this.variables = this.#parse(content), this.loaded = true;

            if (this.options.debug) console.log(`✓ 已加载 ${Object.keys(this.variables).length} 个环境变量`);
            for (const [key, value] of Object.entries(this.variables)) process.env[key] = value;
        } catch (error) {
            console.error('❌ 读取 .env 文件失败:', error.message), process.exit(1);
        }
        return this.variables;
    }

    // 获取所有变量
    getAll() {
        return { ...this.variables };
    }

    // 获取单个变量
    get(key, defaultValue = null) {
        return this.variables[key] || defaultValue;
    }

    // 检查变量是否存在
    has(key) {
        return key in this.variables;
    }
}

let defaultEnv = null; // 延迟创建默认实例
const env = (() => {
    if (!defaultEnv) defaultEnv = new EnvLoader({ path: '.env', encoding: 'utf8', debug: false });
    return defaultEnv;
})();

function config(options = {}) {
    if (typeof options === 'string') options = { path: options };
    const { path = '.env', encoding = 'utf8', debug = false } = options;
    return new EnvLoader({ path, encoding, debug });
}

export { env, config };