# 实现一个简单版的webpack

## 思路整理
1. 获取文件内容
    - `readFile`
2. 分析依赖关系
    - 利用抽语法树
    - 工具
        - `@babel/parser` 将代码解析成AST树
        - `@babel/traverse` 用于遍历AST树
        - `babel-core`
            - `transformFromAst`
        - `babel-preset-env`
3. 最终生成一个iife
```js
(function(modules) {
    function require(moduleName) {
        const fn = modules[moduleName];
        const module = { exports: {} };
        fn(require, module, module.exports);
        return module.exports;
    }

    require('./main.js');
})({
    './main.js': function (require, module, exports) {
        const { foo } = require('./foo.js');
        console.log('main.js');
        foo();
    },
    './foo.js': function(require, module, exports) {
        exports.foo = funtion() {
            console.log('foo.js');
        }
    }
})
```

## TODOS
- [ ] 移除注释
- [ ] 支持多入口

## run example
```bash
npm run build -- --config .\example\webpack.config.js
```
