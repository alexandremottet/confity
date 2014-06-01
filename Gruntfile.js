var sourceFiles = ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js'];

module.exports = function(grunt) {

    /**
     * tasks configurations.
     */
     var requirejs = require('./grunt_tasks/requirejs');
     var clean = require('./grunt_tasks/clean');
     var watch = require('./grunt_tasks/watch');
     var uglify = require('./grunt_tasks/uglify');

    /**
     * initialize configuration
     */
     grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: requirejs,
        clean: clean,
        watch: watch,
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            source: sourceFiles
        },
        uglify: uglify
    });

    require('load-grunt-tasks')(grunt);

    /**
     * register tasks.
     */
    grunt.registerTask('test', []);
    grunt.registerTask('build', ['clean', 'jshint', 'test']);

    grunt.registerTask('build:dev', ['build', 'watch']);
    grunt.registerTask('build:release', ['build', 'requirejs', 'uglify:js']);

    // Public task
    grunt.registerTask('dev', ['build:dev']);
    grunt.registerTask('release', ['build:release']);

 };