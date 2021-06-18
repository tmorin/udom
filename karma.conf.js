const webpackDev = require('./webpack.dev');

if (!process.env.CHROME_BIN) {
    process.env.CHROME_BIN = require('puppeteer').executablePath();
}

module.exports = (config) => {
    config.set({
        frameworks: ['mocha', 'webpack'],

        reporters: ['progress', 'junit'],

        files: [
            {pattern: 'src/**/*.spec.ts', watched: false},
            {pattern: 'src/**/*', watched: true, included: false, served: false}
        ],

        preprocessors: {
            'src/**/*.spec.ts': ['webpack']
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
