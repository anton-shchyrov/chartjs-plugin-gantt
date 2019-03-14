const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        gantt: "./src/index.js",
        // test: "./src/main/js/test-show.ts",
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'chartjs-plugin-gantt.js'
    },
    devtool: "source-map",
}