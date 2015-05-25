module.exports = function (grunt) {
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'js/**/*.js']
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'js/settings.js',
                    'js/views/map.js',
                    'js/views/authenticate.js',
                    'js/views/working.js',
                    'js/views/venue-info.js',
                    'js/Foursquare.js',
                    'js/app.js'
                ],
                dest: 'dist/build.js'
            },
        },

        uglify: {
            my_target: {
                files: {
                    'dist/build.min.js': ['dist/build.js']
                }
            }
        }
    });

    grunt.registerTask('jshint', 'jshint');
    grunt.registerTask('build', ['concat', 'uglify']);
};
