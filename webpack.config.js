var path = require("path");

// Return the configuration
module.exports = (env, argv) => {
    let isDev = argv.mode == "development";

    let cfg = {
        entry: "./src/index.ts",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "gd-sprest-generator" + (isDev ? "" : ".min") + ".js"
        },
        resolve: {
            extensions: [".ts", ".js", ".css"]
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" }
                    ]
                },
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

    // Return the configuration
    return cfg;
}