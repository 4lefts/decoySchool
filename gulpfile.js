		// gulp and plugins
const 	gulp = require('gulp'),
		sass = require('gulp-sass'),
		prefix = require('gulp-autoprefixer'),
		//to delete build directory
		fs = require('fs'),
		del = require('del'), 
		// babel = require('gulp-babel'),
		// metalsmith and plugins
		metalsmith = require('gulp-metalsmith'),
		markdown = require('metalsmith-markdown'),
		layouts = require('metalsmith-layouts'),
		collections = require('metalsmith-collections'),
		permalinks = require('metalsmith-permalinks'),
		// excerpts = require('metalsmith-excerpts'),
		// handlebars = require('handlebars'),
		// dateFormatter = require('metalsmith-date-formatter')
		browserSync = require('browser-sync').create() //create method gives unique browsersync instance and allows multiple servers

//stuff for date (used in templates)
var d = new Date()
var year = d.getFullYear()

function errorLog(error){
	console.error(error.message)
}

//not using - i'm pretty sure metalsmith automatically
// gulp.task('clean', function(){
// 	fs.lstat('build', function(err, stats){
// 		if(err) throw err
// 	// return del('build/**')
// 		console.log('hello' + stats)
// 	})
// })

gulp.task('metalsmith', function(){
	return gulp.src('src/**')
		.pipe(metalsmith({
			metadata: {
				site: {
					title: "Decoy School",
					bannerImage: "learning",
				},
				thisYear: year,
			},
			use: [
				collections({
					pages: {
						pattern: 'pages/*.md',
						sortBy: 'order',
					},
					yearGroups: {
						pattern: 'yearGroups/*.md',
					},
					footerLogos: {
						pattern: 'images/footerLogos/*.png'
					},
					extra: {
						pattern: 'extra/*.md',
					},
				}),
				markdown({
					"smartypants": true,
					"gfm": true,
					"tables": true,
				}),
				permalinks({
	 				pattern: ":title",
	 				relative: false
				}),
				layouts({
					'engine': 'jade'
				}),
			]
		}))
		.on('error', errorLog)
		.pipe(gulp.dest('build'))
})

// gulp.task('transpileEs6', function(){
// 	gulp.src('src/scripts/**/*.js')
// 		.pipe(babel())
// 		.on('error', errorLog)
// 		.pipe(gulp.dest('dist/js'))
// })

gulp.task('buildStyles', function(){
	return gulp.src('sass/**/*')
		.pipe(sass({
			outputStyle: 'expanded',
		}))
		.on('error', errorLog)
		.pipe(prefix())
		.pipe(gulp.dest('src/styles'))
})

gulp.task('serve', function(){
	browserSync.init({
		server: {
			baseDir: 'build',
		}
	})
})

gulp.task('refresh', ['metalsmith'], function(){
	return browserSync.reload()
})

gulp.task('watch', function(){
	gulp.watch('src/**', ['buildStyles', 'refresh'])
	gulp.watch('sass/**/*', ['buildStyles', 'refresh'])
	// gulp.watch('es6/**/*.js', ['transpileEs6'])
})

gulp.task('default', ['buildStyles', 'metalsmith', 'serve', 'watch'])