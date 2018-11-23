const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/index.ts'),
    module: {
        rules: [
            {test: /\.(ts|js)$/, exclude: /node_modules/, loader: 'ts-loader'}
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        library: 'udom',
        libraryTarget: 'umd',
        path: path.resolve(__dirname)
    }
};

