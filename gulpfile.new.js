// const gulp = require('gulp')
// const browsersync = require('browser-sync').create()
//
// //metalsmith and plugins
// const metalsmith = require('metalsmith')
// const markdown = require('metalsmith-markdown')
// const layouts = require('metalsmith-layouts')
// const permalinks = require('metalsmith-permalinks')
// const collections = require('metalsmith-collections')
// const ignore = require('metalsmith-ignore')
// const dateFormatter = require('metalsmith-date-formatter')
// const sass = require('metalsmith-sass')
//
// //for building css
// // const sass = require('gulp-sass')
// // const prefix = require('gulp-autoprefixer')
//
// const d = new Date()
// const y = d.getFullYear()
//
// gulp.task('buildSite', () => {
//   return metalsmith(__dirname)
//     .metadata({
//       site: {
//         title: 'Not Operational',
//         url: 'notoperational.com',
//         author: 'Stephen Ball',
//         year: y,
//       },
//     })
//     .source('./src')
//     .destination('./build')
//     .clean(true)
//     .use(sass({
//       outputDir: function(originalPath){
//         return originalPath.replace('sass', 'css')
//       },
//       outputStyle: 'expanded',
//     }))
//     .use(collections({
//       cards: {
//         pattern: 'cards/*.md',
//         sortBy: 'title',
//       },
//       pages: {
//         pattern: 'pages/*.md',
//       },
//       posts: {
//         pattern: 'posts/*.md',
//         sortBy: 'publishDate',
//         reverse: true,
//       },
//     }))
//     .use(ignore(['cards/*', 'sass/*']))
//     .use(dateFormatter({
//       dates: [
//         {
//           key: 'publishDate',
//           format: 'DD MMMM YYYY',
//         },
//       ]
//     }))
//     .use(markdown({
//       gfm: true,
//       smartypants: true,
//       tables: true,
//     }))
//     .use(permalinks({
//       pattern: ':title',
//       relative: false,
//       linksets:[
//         {
//           match: { collection: 'posts'},
//           pattern: 'posts/:title',
//         },
//       ],
//     }))
//     .use(layouts({
//       engine: 'handlebars',
//       partials: 'partials',
//     }))
//     .build((err) => {
//       if(err) throw err
//     })
// })
//
// gulp.task('serve', () => {
//   browsersync.init({
//     server: {
//       baseDir: 'build',
//     },
//   })
// })
//
// gulp.task('refresh', ['buildSite'], () => {
//   return browsersync.reload()
// })
//
// gulp.task('watch', () => gulp.watch(['src/**', 'layouts/**', 'partials/**'], ['refresh']))
//
// gulp.task('default', ['buildSite', 'serve', 'watch'])

		// gulp and plugins
const gulp = require('gulp'),
			sass = require('gulp-sass'),
			prefix = require('gulp-autoprefixer'),
			// metalsmith and plugins
			metalsmith = require('metalsmith'),
			markdown = require('metalsmith-markdown'),
			layouts = require('metalsmith-layouts'),
			collections = require('metalsmith-collections'),
			permalinks = require('metalsmith-permalinks'),
			browserSync = require('browser-sync').create() //create method gives unique browsersync instance and allows multiple servers

//stuff for date (used in templates)
var d = new Date()
var year = d.getFullYear()

function errorLog(error){
	console.error(error.message)
}

gulp.task('metalsmith', () => {
	return metalsmith(__dirname)
		.metadata({
			site: {
				title: "Decoy School",
				bannerImage: "learning",
			},
			thisYear: year,
		})
		.clean(true)
		.source('./src')
		.destination('./build')
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

gulp.task('serve', () => {
	browserSync.init({
		server: {
			baseDir: 'build',
		}
	})
})

gulp.task('refresh', ['metalsmith'], () => {
	return browserSync.reload()
})

gulp.task('watch', () => {
	gulp.watch('layouts/**/*', ['buildStyles', 'refresh'])
	gulp.watch('src/**/*', ['buildStyles', 'refresh'])
	gulp.watch('sass/**/*', ['buildStyles', 'refresh'])
})

gulp.task('default', ['buildStyles', 'metalsmith', 'serve', 'watch'])
