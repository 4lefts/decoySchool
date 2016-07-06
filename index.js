/*
- sass workflow -> sass --watch sass/style.scss:src/styles/style.css from project folder
*/

//if argument to script is not production this variable = false
var devBuild = (process.argv[2] || '').trim().toLowerCase() !== 'production'

//metalsmith plugin variables
var Metalsmith = require('metalsmith'),
	permalinks = require('metalsmith-permalinks'),
	markdown = require('metalsmith-markdown'),
	layouts = require('metalsmith-layouts'),
	//if we are not in production, require browsersync
	browserSync = devBuild ? require('metalsmith-browser-sync') : null,
	collections = require('metalsmith-collections')
	// toc = require('metalsmith-autotoc')

//stuff for date
var d = new Date()
var year = d.getFullYear()

//-------------------------
//metalsmith build pipeline
//-------------------------
var ms = Metalsmith(__dirname)
	.metadata({
		site: {
			title: "Decoy School",
			bannerImage: "learning"
		},
		thisYear: year
	})
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
		}
	))
	// .use(toc({
	// 	selector: 'h2'
	// }))
	.use(layouts({'engine': 'jade'}))
	.destination('./build')

if (browserSync) {
	ms.use(browserSync({
		server: "build",
		files: ["src/**/*.md", "src/**/*.css", "layouts/**/*.jade"]
	}))
}

ms.build( function (err){
	if(err){
		console.log(err)
	}
});