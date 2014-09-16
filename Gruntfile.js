module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            options: {
                configFile: 'karma.conf.js'
            }
        },
        jshint: {
            files: ['Gruntfile.js','app.js','**/*.js'],
            ignore:['node_modules/'],
            options: {
                globals: {
                    exports: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['connect','jshint', 'karma'],
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
                    }
                },
                keepAlive:{
                    keepalive:true
                }
            }
        }
    });

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Default task(s).
    grunt.registerTask('default', ['connect:server:keepAlive','jshint']);
};