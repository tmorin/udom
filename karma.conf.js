const webpackDev = require('./webpack.dev');

if (!process.env.CHROME_BIN) {
    process.env.CHROME_BIN = require('puppeteer').executablePath();
}

module.exports = (config) => {
    config.set({
        frameworks: ['mocha'],

        reporters: ['progress', 'junit'],

        files: [
            {pattern: 'test/**/*.spec.ts', watched: false}
        ],

        preprocessors: {
            'test/**/*.spec.ts': ['webpack']
        },

        webpack: {
            module: webpackDev.module,
            resolve: webpackDev.resolve,
            mode: webpackDev.mode,
            devtool: webpackDev.devtool
        },

        webpackMiddleware: {
            stats: 'errors-only'
        },

        client: {
            mocha: {
                reporter: 'html'
            }
        },

        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },

        junitReporter: {
            outputDir: '.tmp/junit'
        }
    });
};
