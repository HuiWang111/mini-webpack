import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import { transformFromAstAsync } from '@babel/core'
import fs from 'fs/promises'
import { dirname, join } from 'path'
import { webpackUtils } from './utils'
import { Module } from './module'
import { WebpackCommandOption, WebpackConfig, WebpackBoundleModule } from './interface'

export class Webpack {
    private _options: WebpackCommandOption
    private _modules: Module[]

    constructor(options: WebpackCommandOption) {
        this._options = options
        this._modules = []
    }

    public run = async(): Promise<void> => {
        try {
            const config = await this._parseConfig()
            const entry = webpackUtils.getEntry(config.entry)
            const entryModule = await this._createModule(entry)
            this._modules.push(entryModule)
            
            await this._recursiveParse(entryModule)
            const output = webpackUtils.getOutput(config.output)
            
            const moduleMap = this._modules.reduce((map: Record<string, WebpackBoundleModule>, module: Module): Record<string, WebpackBoundleModule> => {
                map[module.getFile()] = {
                    dependencies: module.getDependencies(),
                    code: module.getCode()
                }
                return map
            }, {})
            
            this._bundle(moduleMap, output, entry)
        } catch (e) {
            console.error(e)
        }
    }

    private _parseConfig = async (): Promise<WebpackConfig> => {
        return new Promise((resolve, reject) => {
            if (this._options.config) {
                const configFile = webpackUtils.getConfigFile(this._options.config)
                import(configFile)
                    .then((config: WebpackConfig) => {
                        if (!config.entry) {
                            reject(new Error('entry is required!'))
                        }
                        if (!config.output) {
                            reject(new Error('output is required!'))
                        }
            
                        resolve(config)
                    })
                    .catch(e => {
                        reject(e)
                    })
                return
            }


            if (!this._options.entry) {
                reject(new Error('entry is required!'))
            }
            if (!this._options.output) {
                reject(new Error('output is required!'))
            }
    
            resolve(this._options as WebpackConfig)
        })
    }

    private _createModule = async (file: string): Promise<Module> => {
        const source = await fs.readFile(file, { encoding: 'utf-8' })
        const ast = parse(source, { sourceType: 'module' })
        const path = dirname(file)

        const dependencies: Record<string, string> = {}

        traverse(ast, {
            ImportDeclaration({ node }) {
                dependencies[node.source.value] = join(path, node.source.value)
            }
        })
        
        const res = await transformFromAstAsync(ast, undefined, { presets: ['@babel/preset-env'] })
        return new Module(dependencies, res?.code || '', file, path)
    }

    private _recursiveParse = async (mod: Module): Promise<void> => {
        if (!mod.hasDependencies()) {
            return
        }

        const deps = mod.getDependencies()
        for (const file in deps) {
            const module = await this._createModule(this._autoSuffix(deps[file]))
            this._modules.push(module)
            this._recursiveParse(module)
        }
    }

    private _autoSuffix = (file: string): string => {
        return /\.js$/.test(file)
            ? file
            : file + '.js'
    }

    private _createIIFE = (modules: string, entry: string): string => {
        return `(function(modules) {
    function require(moduleName) {
        var module = modules[moduleName];
        var fixPath = function(relativePath) {
            return require(module.dependencies[relativePath])
        }
        var exports = {}
        
        (function(require, code) {
            eval(code)
        })(fixPath, module.code)

        return exports
    }

    require('${entry}');
})(${modules})`
    }

    private _bundle = async (
        modules: Record<string, WebpackBoundleModule>,
        output: string,
        entry: string
    ): Promise<void> => {
        const content = this._createIIFE(JSON.stringify(modules, null, 4), entry)
        await fs.writeFile(output, content)
    }
}