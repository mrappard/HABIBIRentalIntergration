const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: {
        app: './client/components/app.js'
    },
    output: {
        filename: './build/bundle.js',
        sourceMapFilename: './build/bundle.map'
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            },
            type: "javascript/auto",
        },
        {
            test: /\.html$/,
            use: [
                {
                    loader: "html-loader",
                    options: { minimize: true }
                }
            ]
        }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./views/index.html",
            filename: "./views/index.html"
        })
    ]
};