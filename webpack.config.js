const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        index: "./src/ts/index.ts",
        // test: "./src/main/js/test-show.ts",
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    devtool: "source-map",
}