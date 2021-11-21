import argsParser from 'yargs-parser'
import { Webpack } from './webpack'
import { WebpackCommandOption } from './interface'

async function main(): Promise<void> {
    const options = argsParser(process.argv.slice(2))
    const webpack = new Webpack(options as WebpackCommandOption)
    await webpack.run()
}

main()