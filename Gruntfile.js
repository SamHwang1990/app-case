module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            options: {
                configFile: 'karma.conf.js'
            }
        },
        jshint: {
            options: {
                globals: {
                    exports: true
                },
                ignore:['node_modules/']
            },
            files: ['Gruntfile.js','app.js','*/*.js']
        },
        watch: {
            files: ['<%= jshint.files %>','public/stylesheets/stylus/*.styl'],
            tasks: ['jshint', 'karma'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        connect: {
            server: {
                options: {
                    hostname:"localhost",
                    middleware: function (connect) {
                        return [
                            require('./app') // your server packaged as a nodejs module
                        ];
                    },
                    keepalive:true
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout:5000,
                    require:"should"
                },
                src: ['test/**/*.js']
            }
        }
    });

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Default task(s).
    grunt.registerTask('default', ['jshint','connect:server:keepAlive']);
};