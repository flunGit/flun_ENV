# flun-env一个简单易用的 .env 环境变量文件读取工具

## 安装

```bash
npm i flun-env
```

## 特性

- ✅ 自动检查并创建 .env 示例文件
- ✅ 支持 `env.变量名` 的直接调用方式
- ✅ 支持自定义 .env 文件路径
- ✅ 自动将变量注入到 `process.env`
- ✅ 多路径自动查找 .env 文件
- ✅ 支持注释和空行
- ✅ 友好的错误提示

## .env 文件格式

在项目根目录或运行文件根目录创建 `.env` 文件：

```env
# 数据库配置
DATABASE_URL=mysql://user:password@localhost:3306/dbname
API_KEY=your_api_key_here

# 应用配置
DEBUG=false
PORT=3000
NODE_ENV=development
```

## API

### 属性访问
- `env.VARIABLE_NAME` - 直接访问变量

### 方法
- `env.get(key, defaultValue)` - 获取变量值
- `env.has(key)` - 检查变量是否存在
- `env.getAll()` - 获取所有变量
- `env.load()` - 重新加载变量

## 文件查找顺序
1. 自定义路径
2. 当前工作目录的 `.env` 文件
3. C盘用户主目录的 `.env` 文件

## 使用方法

### 默认配置(示例)

```javascript
const {env} = require('flun-env');

// 直接使用变量
console.log(env.DATABASE_URL);
console.log(env.API_KEY);
console.log('数据库地址:', env.DATABASE_URL);
console.log('API密钥:', env.API_KEY);

// 或者使用方法
console.log(env.get('DATABASE_URL'));
if (env.has('SECRET_KEY')) {
  console.log('密钥存在');
}

// 获取所有变量
const allVars = env.getAll();
console.log('所有变量:', allVars);
```

### 自定义配置(示例):

```javascript
const { config } = require('flun-env');
const env = config({
    path: './path/.env',  // 自定义路径 (自定义路径如果是相对路径,那么请以工作路径作为基准设置->向上或向下或同级)
    encoding: 'utf8',     // 字符集 (默认utf8)
    debug: true           // 调试模式 (默认false)
});

console.log(env.PORT); // 访问配置项
// 其它使用方式同默认配置(示例)...
```

## 错误处理
如果未找到 .env 文件，包会自动创建示例文件并退出进程。

这个包提供了完整的 .env 文件管理功能，包括自动创建示例文件、错误处理、多路径查找等特性，用户可以通过简单的 `env.变量名` 方式直接访问环境变量