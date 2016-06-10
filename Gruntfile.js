module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copyrightBanner: grunt.file.read('COPYRIGHT'),

		opts: {
			scss: 'src/scss',
			js: 'src/js',
			examples: 'examples',

			dist: {
				parent: 'dist',
				min: 'dist/min',
				dev: 'dist/dev',
			},

			archive: {
				zip: 'jquery.sweet-modal-<%= pkg.version %>.zip'
			}
		},

		clean: {
			dist: ['<%= opts.dist.parent %>/*'],
			examples: [
				'<%= opts.examples %>/css',
				'<%= opts.examples %>/js',
			]
		},

		copy: {
			'examples-deps-js': {
				expand: true,
				flatten: true,
				src: ['node_modules/jquery/dist/jquery.min.js', '<%= opts.dist.min %>/jquery.sweet-modal.min.js'],
				dest: '<%= opts.examples %>/js/'
			},

			'examples-deps-css': {
				expand: true,
				flatten: true,
				src: ['<%= opts.dist.min %>/jquery.sweet-modal.min.css'],
				dest: '<%= opts.examples %>/css/'
			}
		},

		sass: {
			options: {
				trace: true,
				sourcemap: 'none',
				style: 'compressed'
			},

			'sweet-modal': {
				options: {
					style: 'nested',
					sourcemap: 'auto'
				},

				files: {
					'<%= opts.dist.dev %>/jquery.sweet-modal.css': ['<%= opts.scss %>/sweet-modal.scss']
				}
			},

			'sweet-modal-min': {
				files: {
					'<%= opts.dist.min %>/jquery.sweet-modal.min.css': ['<%= opts.scss %>/sweet-modal.scss']
				}
			},

			examples: {
				files: {
					'<%= opts.examples %>/css/examples.css': ['<%= opts.scss %>/examples.scss']
				}
			}
		},

		browserify: {
			'sweet-modal': {
				options: {
					transform: ['coffeeify'],
					banner: '<%= copyrightBanner %>'
				},

				files: {
					'<%= opts.dist.dev %>/jquery.sweet-modal.js': ['<%= opts.js %>/sweet-modal.coffee']
				}
			}
		},

		uglify: {
			options: {
				screwIE8: true,
				mangle: {
					except: ['jQuery', '$', 'module']
				},
				banner: '<%= copyrightBanner %>',
				mangle: false,
				sourceMap: false
			},

			'sweet-modal-min': {
				files: {
					'<%= opts.dist.min %>/jquery.sweet-modal.min.js': ['<%= opts.dist.dev %>/jquery.sweet-modal.js']
				}
			}
		},

		watch: {
			scss: {
				files: ['<%= opts.scss %>/**/*.scss'],
				tasks: ['compile:scss', 'copy:examples-deps-css']
			},

			js: {
				files: ['<%= opts.js %>/**/*.coffee'],
				tasks: ['compile:js', 'copy:examples-deps-js']
			}
		},

		compress: {
			'sweet-modal': {
				options: {
					archive: '<%= opts.dist.parent %>/<%= opts.archive.zip %>'
				},

				files: [
					{
						expand: true,
						cwd: '<%= opts.dist.parent %>',
						src: ['*', '**/*', '!*.zip', '../LICENSE-GPL', '../LICENSE-MIT', '../README.md'],
						dest: '/'
					}
				]
			}
		}
	});

	grunt.registerTask('copy:examples-deps', ['copy:examples-deps-js', 'copy:examples-deps-css']);

	grunt.registerTask('compile:js', ['browserify:sweet-modal', 'uglify:sweet-modal-min']);

	grunt.registerTask('compile:scss', ['sass']);
	grunt.registerTask('compile:scss:sweet-modal', ['sass:sweet-modal', 'sass:sweet-modal-min']);
	grunt.registerTask('compile:scss:examples', ['sass:examples']);

	grunt.registerTask('compile:examples', ['clean:examples', 'compile:scss:examples', 'copy:examples-deps']);

	grunt.registerTask('compile', ['clean', 'compile:js', 'compile:scss:sweet-modal', 'compile:examples']);

	grunt.registerTask('default', ['compile']);
};