/**
 * 预设的 .env 示例文件内容(行数组),供模块生成示例文件
 * >查看定义:@see {@link exampleLines}
 */
const exampleLines = [
    '# .env 环境变量配置文件示例:',
    '# 每行标准格式: 变量名 = 变量值',
    '# 注意!!!,如果键值包含特殊字符或空格,请使用引号包裹,并正确转义引号内的特殊字符',
    '# 以 # 开头的行是注释',
    '',
    'DATABASE_URL = mysql://user:password@localhost:3306/dbname',
    '',
    'API_KEY = your_api_key_here',
    '',
    'SECRET_KEY = your_secret_key_here',
    '',
    'DEBUG = false',
    '',
    'PORT = 3000',
    '',
    '# 字符串值不需要引号',
    'MAIL_PWD = 123ABC',
    '',
    `# 调用包: import { env } from 'flun-env' ;`,
    '',
    '# 使用格式: env.变量名'
];
export { exampleLines };