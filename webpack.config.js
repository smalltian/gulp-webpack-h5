var path = require("path");

let files = {} // 想要编译的多个入口文件，这里省略
let utils = [""]

module.exports = {
    // cache: true,
    // devtool: "#source-map",
    entry: {
        message: ["babel-polyfill","./src/js/message.js"]
    },
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: "[name]/[name].js",
        chunkFilename: "[name].chunk.js"
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
};