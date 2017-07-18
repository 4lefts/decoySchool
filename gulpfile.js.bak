
		// gulp and plugins
const gulp = require('gulp'),
			// sass = require('gulp-sass'),
			// prefix = require('gulp-autoprefixer'),
			// metalsmith and plugins
			metalsmith = require('metalsmith'),
			markdown = require('metalsmith-markdown'),
			layouts = require('metalsmith-layouts'),
			collections = require('metalsmith-collections'),
			permalinks = require('metalsmith-permalinks'),
			sass = require('metalsmith-sass'),
			prefixer = require('metalsmith-autoprefixer'),
			ignore = require('metalsmith-ignore'),
			browserSync = require('browser-sync').create() //create method gives unique browsersync instance and allows multiple servers

//stuff for date (used in templates)
var d = new Date()
var year = d.getFullYear()

function errorLog(error){
	console.error(error.message)
}

gulp.task('buildSite', () => {
	return metalsmith(__dirname)
		.metadata({
			site: {
				title: "Decoy School",
				bannerImage: "learning",
			},
			thisYear: year,
		})
		.source('./src')
		.destination('./build')
		.clean(true)
		.use(sass({
			outputDir: function(originalPath){
				return originalPath.replace('sass', 'styles')
			},
			outputStyle: 'expanded',
		}))
		.use(prefixer())
		.use(collections({
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
		}))
		.use(ignore(['sass/**']))
		.use(markdown({
			"smartypants": true,
			"gfm": true,
			"tables": true,
		}))
		.use(permalinks({
			pattern: ":title",
			relative: false
		}))
		.use(layouts({
			'engine': 'jade'
		}))
		.build((err) => {
			if(err) throw err
		})
})

gulp.task('serve', () => {
	browserSync.init({
		server: {
			baseDir: 'build',
		}
	})
})

gulp.task('refresh', ['buildSite'], () => {
	setTimeout(function(){
		return browserSync.reload()
	}, 1500)
})

gulp.task('watch', () => gulp.watch(['src/**', 'layouts/**'], ['refresh']))

gulp.task('default', ['buildSite', 'serve', 'watch'])
