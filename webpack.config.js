var path = require("path");

// Return the configuration
module.exports = (env, argv) => {
    return {
        entry: [
            "./node_modules/gd-bs/dist/gd-bs.min.js",
            "./node_modules/gd-sprest/dist/gd-sprest.min.js",
            "./src/index.js"
        ],
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "gd-sprest-generator" + (argv.mode == "development" ? "" : ".min") + ".js"
        },
        externals: {
            "gd-bs": "GD",
            "gd-sprest": "$REST"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["@babel/preset-env"]
                            }
                        }
                    ]
                }
            ]
        }
    };
}