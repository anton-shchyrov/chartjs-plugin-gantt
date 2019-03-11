const path = require("path");
module.exports = {
    mode: "development",
    entry: {
        index: "./src/ts/index.ts",
    },
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    devtool: "source-map",
};
//# sourceMappingURL=webpack.config.js.map