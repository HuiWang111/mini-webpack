export class Module {
    private _dependencies: Record<string, string>
    private _code: string
    private _file: string
    private _path: string

    constructor(
        dependencies: Record<string, string>,
        code: string,
        file: string,
        path: string
    ) {
        this._dependencies = { ...dependencies }
        this._code = code
        this._file = file
        this._path = path.replace(/\\/g, '/')
    }

    public hasDependencies = (): boolean => {
        return Object.keys(this._dependencies).length > 0
    }

    public getDependencies = (): Record<string, string> => {
        return { ...this._dependencies }
    }

    public getCode = (): string => {
        return this._code
    }

    public getPath = (): string => {
        return this._path
    }

    public getFile = (): string => {
        return this._file
    }
}
