			// gulp and plugins
const gulp = require('gulp'),
			sass = require('gulp-sass'),
			imagemin = require('gulp-imagemin'),
			prefix = require('gulp-autoprefixer'),
			// metalsmith and plugins
			metalsmith = require('gulp-metalsmith'),
			markdown = require('metalsmith-markdown'),
			layouts = require('metalsmith-layouts'),
			collections = require('metalsmith-collections'),
			permalinks = require('metalsmith-permalinks'),
			browserSync = require('browser-sync').create() //create method gives unique browsersync instance and allows multiple servers

//stuff for date
var d = new Date()
var year = d.getFullYear()

function errorLog(error){
	console.error(error.message)
}

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

gulp.task('buildStyles', function(){
	return gulp.src('sass/**/*')
		.pipe(sass({
			outputStyle: 'compressed',
			sourceMaps: false,
		}))
		.on('error', errorLog)
		.pipe(prefix({
			browsers: ['last 2 versions'],
		}))
		.pipe(gulp.dest('src/styles'))
})

gulp.task('minifyImages', function(){
	return gulp.src('images/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('src/images'))
})

gulp.task('serve', function(){
	browserSync.init({
		server: {
			baseDir: 'build',
		}
	})
})

gulp.task('refresh', ['metalsmith'], function(){
	setTimeout(() => {
		return browserSync.reload()
	}, 1500)
})

gulp.task('watch', function(){
	gulp.watch('images/**/*', ['minifyImages', 'refresh'])
	gulp.watch('layouts/**/*', ['refresh'])
	gulp.watch('src/**/*', ['refresh'])
	gulp.watch('sass/**/*', ['buildStyles', 'refresh'])
})

gulp.task('default', ['buildStyles', 'minifyImages', 'metalsmith', 'serve', 'watch'])
