const webpack = require("webpack");
const webpackConfig = require("./karma-webpack.config");
const path = require("path");

module.exports = function(config) {
    if (config.codeCoverage) {
        Object.assign(webpackConfig, {
            module: Object.assign(webpackConfig.module, {
                rules: webpackConfig.module.rules.concat([ {
                    test: /\.ts$/,
                    enforce: "post",
                    loader: "istanbul-instrumenter-loader",
                    include: path.resolve(__dirname, "src"),
                    exclude: /\.(spec)\.ts$/
                } ])
            })
        });
    }

    config.set({
        basePath: "",
        frameworks: [ "jasmine" ],
        files: [
            { pattern: "src/**/*.ts", watched: true },
            { pattern: "tests/**/*.ts", watched: true },
            "tests/test-index.js"
        ],
        exclude: [],
        preprocessors: { "tests/test-index.js": [ "webpack", "sourcemap" ] },
        webpack: webpackConfig,
        webpackServer: { noInfo: true },
        reporters: [ "progress", config.codeCoverage ? "coverage" : "kjhtml" ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [ "ChromeHeadless" ],
        singleRun: false,
        concurrency: Infinity,
        coverageReporter: {
            dir: "./dist/testresults",
            reporters: [
                { type: "json", subdir: ".", file: "coverage.json" },
                { type: "text" }
            ]
        }
    });
};
