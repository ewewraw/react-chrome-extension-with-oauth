const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")
const Dotenv = require('dotenv-webpack');   

module.exports = {
    entry: {
        index: "./src/index.tsx"
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        }
                    }],
                exclude: /node_modules/,
            },
            {
                exclude: /node_modules/,
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ]

            },
        ],
    },
    plugins: [
        new Dotenv(),
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "manifest.json" }, // Copy manifest.json to dist/
                { from: "src/**/*.js", to: "[name][ext]" },     // Copy all .js scripts from src/ to dist/
                { from: "img", to: "img" },                    // Copy the img folder to dist/img
            ],
        }),
        ...getHtmlPlugins(["index"]),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}