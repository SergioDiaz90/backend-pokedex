const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    name: 'backend-pokedex',
    entry: './src/scripts/index.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'scripts/index.js',
        assetModuleFilename: 'src/[path]/[name][contenthash].[ext]'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/data-session', to: 'src/data-session' },
                { from: 'src/environment', to: 'src/environment' },
            ],
        }),
    ],
    optimization: {
        minimize: true,
    },
}
