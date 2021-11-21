import { DEFAULT_CONFIG_FILE, DEFAULT_OUTPUT_PATH } from './config';
import { Output } from './interface';
import { join } from 'path';

class WebpackUtils {
    getConfigFile = (configFile?: string): string => {
        if (configFile) {
            return join(process.cwd(), configFile);
        }

        return join(process.cwd(), DEFAULT_CONFIG_FILE);
    }

    getEntry = (entry: string): string => {
        return join(process.cwd(), entry);
    }

    getOutput = (output: string | Output): string => {
        if (typeof output === 'object') {
            const path = output.path || DEFAULT_OUTPUT_PATH;
            return join(process.cwd(), path, output.filename);
        }

        return join(process.cwd(), output);
    }
}

export const webpackUtils = new WebpackUtils()
