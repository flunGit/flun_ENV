const fs = require('fs'), path = require('path'), os = require('os'), { exampleLines } = require('./env');

class EnvLoader {
    constructor(options = {}) {
        this.options = { ...options }, this.variables = {}, this.loaded = false, this.load(); // 自动加载

        // 返回代理实例以实现 env.变量名 的访问方式
        return new Proxy(this, {
            get: (target, prop) => {
                if (prop in target) return target[prop];
                const variables = target.getAll();
                if (prop in variables) return variables[prop];
                return undefined;
            },
            set(target, prop, value) {
                console.warn('⚠️  警告: 环境变量应在 .env 文件中设置');
                return false;
            }
        });
    }

    // 解析 .env 文件内容
    #parse(content) {
        const lines = content.split('\n'), result = {};
        for (let line of lines) {
            line = line.trim();                          // 移除前后空白字符
            if (!line || line.startsWith('#')) continue; // 跳过空行和注释

            // 解析键值对
            const equalsIndex = line.indexOf('=');
            if (equalsIndex === -1) continue;             // 跳过无效行

            const key = line.slice(0, equalsIndex).trim();
            let value = line.slice(equalsIndex + 1).trim();

            // 移除值两端的引号（如果存在）
            const firstChar = value[0];
            if (firstChar === value.at(-1) && (firstChar === '"' || firstChar === "'"))
                value = value.slice(1, -1);

            if (key) {
                result[key] = value;
                if (this.options.debug) console.log(`✓ 加载变量: ${key} = ${value}`);
            }
        }

        return result;
    }

    // 查找文件
    #findFile(defaultFileName, customPath) {
        let createPath; // 首选创建路径

        // 1. 如果有传入自定义路径
        if (customPath && customPath !== '.env') {
            createPath = path.isAbsolute(customPath) ? customPath : path.resolve(process.cwd(), customPath);

            // 检查自定义路径的文件是否存在
            try {
                if (fs.statSync(createPath).isFile()) return { found: true, path: createPath, createPath };
            } catch (error) { }
            return { found: false, path: null, createPath }; // 自定义路径的文件不存在，返回创建路径为自定义路径
        }

        // 2. 没有自定义路径，检查默认路径(当前工作目录和系统用户主目录)
        const possiblePaths = [path.join(process.cwd(), defaultFileName), path.join(os.homedir(), defaultFileName)];

        // 检查每个路径是否存在
        for (const filePath of possiblePaths)
            try {
                if (fs.statSync(filePath).isFile()) return { found: true, path: filePath, createPath: filePath };
            } catch (error) { }

        // 3. 所有路径都不存在，返回创建路径为当前工作目录
        createPath = path.join(process.cwd(), defaultFileName);
        return { found: false, path: null, createPath };
    }

    // 创建示例文件
    #createExampleFile(filePath, exampleContent) {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // 确保目录存在

            fs.writeFileSync(filePath, exampleContent, 'utf8');
            console.log(`✓ 已创建示例文件:${filePath};请编辑环境变量后重新运行程序`), process.exit(1);
        } catch (error) {
            console.error('✗ 创建示例文件失败:', error.message);
        }
    }

    // 加载环境变量
    load() {
        if (this.loaded) return this.variables;

        const result = this.#findFile('.env', this.options.path);
        if (!result.found) {
            console.log('未找到 .env 文件!💡 正在为您创建...');
            this.#createExampleFile(result.createPath, exampleLines.join('\n')); // 创建示例文件
            return this.variables;
        }

        try {
            // 读取并解析文件
            const content = fs.readFileSync(result.path, this.options.encoding);
            this.variables = this.#parse(content), this.loaded = true;

            if (this.options.debug) console.log(`✓ 加载了 ${Object.keys(this.variables).length} 个变量`);
            for (const [key, value] of Object.entries(this.variables)) process.env[key] = value; // 将变量设置到 process.env
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

// 延迟创建默认实例
let defaultEnv = null;

// 获取默认实例的函数
function getDefaultEnv() {
    if (!defaultEnv) defaultEnv = new EnvLoader({ path: '.env', encoding: 'utf8', debug: false });
    return defaultEnv;
}

// 导出对象
module.exports = {
    // 默认的环境变量实例，通过 getter 延迟创建
    get env() {
        return getDefaultEnv();
    },

    // 配置加载器函数
    config: (options = {}) => {
        // 如果传入的是字符串，则视为路径
        if (typeof options === 'string') options = { path: options };
        const { path = '.env', encoding = 'utf8', debug = false } = options;
        return new EnvLoader({ path, encoding, debug });
    }
};