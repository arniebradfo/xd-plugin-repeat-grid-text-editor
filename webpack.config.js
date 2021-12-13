module.exports = {
    entry: ["./src/index.ts"],
    output: {
        path: __dirname,
        filename: 'main.js',
        libraryTarget: 'commonjs2'
    },
    devtool: 'none',
    externals: {
        application: 'application',
        uxp: 'uxp',
        scenegraph: 'scenegraph'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.png$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}