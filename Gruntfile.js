var sourceFiles = ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js'];

module.exports = function(grunt) {

    /**
     * initialize configuration
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            run: ['dist/**/*']
        },
        watch: {
            scripts: {
                files: ['lib/**/*.js', 'test/*.spec.js'],
                tasks: ['build']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            source: sourceFiles
        },
        uglify: {
            dist: {
                files: {
                'dist/confity.min.js': ['dist/confity.js'],
                'dist/confity.nopromises.min.js': ['dist/confity.nopromises.js']
                }
            }
        },
        concat: {
            options: {
            separator: '',
            },
            confity: {
                files: {
                    'dist/confity.js': [
                    'bower_components/es6-promise/promise.js',
                    'lib/confity.js'
                    ],
                    'dist/confity.nopromises.js': [
                    'lib/confity.js'
                    ]
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                reporter: 'spec'
                },
                src: ['test/*.spec.js']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    /**
     * register tasks.
     */
     grunt.registerTask('test', ['mochaTest']);
     grunt.registerTask('build', ['jshint', 'test']);
     grunt.registerTask('release', ['clean', 'build', 'concat', 'uglify']);
     grunt.registerTask('default', ['build', 'watch']);

 };