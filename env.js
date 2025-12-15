// 导出示例文件供模块使用
const exampleLines = [
    '# .nev 环境变量配置文件示例:',
    '# 每行格式: 变量名 = 变量值',
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
    'APP_NAME = MyApp',
    '',
    'NODE_ENV = development',
    '',
    `# 调用包: const {env} = require('flun-env');`,
    '',
    '# 使用格式: env.变量名'
];
module.exports = { exampleLines };