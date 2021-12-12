module.exports = {
    entry: "./src/index.ts",
    output: {
        path: __dirname,
        filename: "main.js",
        libraryTarget: "commonjs2",
    },
    // devtool: "none",
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    plugins: ["transform-react-jsx"],
                },
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                // loader: "babel-loader",
                // loader: 'ts-loader',s
            },

            // {
            //     test: /\.css$/,
            //     use: ["style-loader", "css-loader"],
            // },
        ],
    },

    externals: {
        uxp: "uxp",
        scenegraph: "scenegraph",
        commands: "commands"
    },
};
