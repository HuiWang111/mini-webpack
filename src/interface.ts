export interface Output {
    filename: string;
    path?: string;
}

export interface WebpackConfig {
    entry: string;
    output: string | Output;
}

export interface WebpackCommandOption extends Partial<WebpackConfig> {
    config?: string;
}

export interface WebpackBoundleModule {
    dependencies: Record<string, string>;
    code: string;
}