var path = require("path");

// Return the configuration
module.exports = (env, argv) => {
    return {
        entry: [
            "./node_modules/gd-bs/dist/gd-bs.min.js",
            "./src/index.ts"
        ],
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "gd-sprest-generator" + (argv.mode == "development" ? "" : ".min") + ".js"
        },
        externals: {
            "gd-bs": "GD"
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["@babel/preset-env"]
                            }
                        },
                        { loader: "ts-loader" }
                    ]
                }
            ]
        }
    };
}