var path = require("path");

// Return the configuration
module.exports = (env, argv) => {
    let isDev = argv.mode == "development";

    let cfg = {
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "gd-sprest-generator" + (isDev ? "" : ".min") + ".js"
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

    // Set the entry
    cfg.entry = isDev ? [
        "./node_modules/gd-bs/dist/gd-bs.min.js",
        "./src/index.ts"
    ] : "./src/index.ts";

    // Return the configuration
    return cfg;
}