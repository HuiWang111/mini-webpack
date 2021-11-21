(function(modules) {
    function require(moduleName) {
        var module = modules[moduleName];
        var fixPath = function(relativePath) {
            return require(module.dependencies[relativePath])
        }
        var exports = {}
        var run = function(require, code) {
            eval(code)
        }
        console.log(module, moduleName)
        run(fixPath, module.code)

        return exports
    }

    require('C:\\Users\\Administrator\\codes\\github\\my-repositories\\mini-webpack\\example\\src\\main.js');
})({
    "C:\\Users\\Administrator\\codes\\github\\my-repositories\\mini-webpack\\example\\src\\main.js": {
        "dependencies": {
            "./foo": "C:\\Users\\Administrator\\codes\\github\\my-repositories\\mini-webpack\\example\\src\\foo"
        },
        "code": "\"use strict\";\n\nvar _foo = require(\"./foo\");\n\n/* eslint-disable @typescript-eslint/explicit-function-return-type */\nfunction main() {\n  (0, _foo.foo)();\n}\n\nmain();"
    },
    "C:\\Users\\Administrator\\codes\\github\\my-repositories\\mini-webpack\\example\\src\\foo.js": {
        "dependencies": {},
        "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.foo = foo;\n\n/* eslint-disable @typescript-eslint/explicit-function-return-type */\nfunction foo() {\n  console.info('this is foo.js');\n}"
    }
})