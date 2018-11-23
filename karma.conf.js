const webpackDev = require('./webpack.dev');

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

        junitReporter: {
            outputDir: '.tmp/junit'
        },

        customLaunchers: {
            sl_firefox: {
                base: 'SauceLabs',
                browserName: 'firefox'
            },
            sl_chrome: {
                base: 'SauceLabs',
                browserName: 'chrome'
            }
        },

        sauceLabs: {
            testName: 'udom - unit testing',
            recordVideo: false,
            recordScreenshots: false
        }
    });
};
