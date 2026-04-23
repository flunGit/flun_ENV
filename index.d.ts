import { exampleLines } from './env.js';
import { checkAndCreateEnvFile } from './install.js';

// =================================== env.js ===================================
/**
 * ```js
 * // 文件导出内容
 * const exampleLines=[]; // 预设的 .env 示例文件内容(行数组),供模块生成;
 * ```
 * >查看定义:@see {@link exampleLines}
 */
declare module './env.js' {
    export * from './env.js';
}

// =================================== install.js ===================================
/**
 * ```js
 * // 文件导出内容
 * checkAndCreateEnvFile(); // 检查并创建 .env 示例文件
 * ```
 * >查看定义:@see {@link checkAndCreateEnvFile}
 */
declare module './install.js' {
    export * from './install.js';
}

// ================================ 导出入口 ================================
/**
 * 环境变量配置模块 主要功能:
 * ```js
 * const env;          // 环境变量代理实例
 * function config();  // 自定义配置(对象:路径,编码,是否打印调试信息)
 * ```
 * ---
 *    -
 * ```js
 *  // 默认使用示例
 *  import { env } from 'flun-env';
 *
 *  console.log(env.PORT); // 访问配置项
 * // ---------------------------------------------------------
 *  // 自定义配置示例
 *  import { config } from 'flun-env';
 *    const cEnv = config({
 *      path: './path/.env',  // 自定义路径(如果配置是相对路径,那么请以工作路径作为基准->向上或向下或同级)
 *      encoding: 'utf8',     // 字符集 (默认utf8)
 *      debug: true           // 调试模式 (默认false)
 *    });
 *
 *   console.log(cEnv.PORT); // 访问配置项
 * ```
 *   -
 * >查看定义:@see {@link env}、{@link config}
 */
declare module './index.js' {
    type BufferEncoding = 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';
    export interface EnvLoaderOptions {
        /** 环境变量文件路径,默认为 '.env' */
        path?: string;
        /** 文件编码，默认为 'utf8' */
        encoding?: BufferEncoding;
        /** 是否开启调试模式,默认为 false */
        debug?: boolean;
    }

    export interface EnvVariables {
        [key: string]: string;
    }

    // EnvLoader 类定义
    export class EnvLoader {
        constructor(options?: EnvLoaderOptions);

        /**
         * 加载环境变量
         * @returns 解析后的环境变量对象
         */
        load(): EnvVariables;

        /**
         * 获取所有环境变量
         * @returns 所有环境变量的副本
         */
        getAll(): EnvVariables;

        /**
         * 获取指定环境变量的值
         * @param key 环境变量键名
         * @param defaultValue 默认值（可选）
         * @returns 环境变量的值，如果不存在则返回默认值或 null
         */
        get(key: string, defaultValue?: string): string | null;

        /**
         * 检查环境变量是否存在
         * @param key 环境变量键名
         * @returns 是否存在
         */
        has(key: string): boolean;

        // 通过代理实现的环境变量访问器
        [key: string]: string | undefined | any;
    }

    // 导出类型别名，代表可以通过点语法访问的环境变量加载器
    export type EnvInstance = EnvLoader & {
        // 这里留空，因为具体的环境变量键名是动态的
        [key: string]: string | undefined;
    };

    /**
     * 默认的环境变量实例
     * 可以通过 `env.变量名` 直接访问环境变量
     * >例如：env.PORT, env.URL
     * - `env.get(key, defaultValue)` - 获取变量值
     * - `env.has(key)` - 检查变量是否存在
     * - `env.getAll()` - 获取所有变量
     * - `env.load()` - 重新加载变量
     */
    export const env: EnvInstance;

    /**
     * 配置环境变量加载器
     * @param options 配置选项或文件路径字符串
     * @returns 环境变量加载器实例
     *
     * @example
     * // 使用默认配置
     * const cEnv = config();
     *
     * @example
     * // 使用自定义路径
     * const cEnv = config('./config/.env');
     *
     * @example
     * // 使用选项对象(自定义路径和编码并启用调试)
     * const cEnv = config({ path: './config/.env',encoding = 'utf8', debug: true });
     */
    export function config(options?: EnvLoaderOptions | string): EnvInstance;
}
