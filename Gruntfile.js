module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            options: {
                configFile: 'karma.conf.js'
            }
        },
        jshint: {
            files: ['Gruntfile.js', '**/*.js'],
            ignore:['node_modules/'],
            options: {
                globals: {
                    exports: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'karma'],
            options: {
                spawn: false,
                livereload: true
            }
        },
        connect: {
            server: {
                options: {
                    port: 3000,
                    open:{
                        target: 'http://localhost:3000', // target url to open
                        appName: 'open', // name of the app that opens, ie: open, start, xdg-open
                        callback: function() {} // called when the app has opened
                    },
                    middleware: function (connect) {
                        return [
                            require('./app') // your server packaged as a nodejs module
                        ];
                    }
                }
            }
        }
    })

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // Default task(s).
    grunt.registerTask('default', ['connect','jshint']);
}