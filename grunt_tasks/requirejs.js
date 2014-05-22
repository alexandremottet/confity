module.exports = {
    compile: {
        options: {
            almond: true,
            name: 'confiny',
            baseUrl: "lib/",
            mainConfigFile: "lib/build-config.js",
            out: 'dist/confiny.js',
            preserveLicenseComments: false
        }
    }
};