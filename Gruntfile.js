module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			parsers: {
				src: ['src/*.ometajs'],
				dest: 'temp/parsers.ometajs'
			}
		},
		ometajs: {
			parsers: {
				options: {
					root: '../core'
				},
				src: 'temp/parsers.ometajs',
				dest: 'lib/ometajs/ometa/parsers.js'
			}
			
		},
		clean: {
			temp: ['temp']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadTasks('./tasks');
	grunt.registerTask('default', ['concat:parsers', 'ometajs:parsers', 'clean:temp']);
};