module.exports = {
    compile: {
        options: {
            almond: true,
            name: 'confity',
            baseUrl: "lib/",
            mainConfigFile: "conf/build-config.js",
            out: 'dist/confity.js',
            preserveLicenseComments: false
        }
    }
};