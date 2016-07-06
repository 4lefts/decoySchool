Code to build a static site for [Decoy Community Primary School](http://decoyschool.co.uk). Uses [Metalsmith](http://metalsmith.io).

To build:
* git clone this repo
* npm install
* npm run build-dev **OR** npm run build-production

This will build a folder called *build* which we can serve. 

N.B. at the moment the index.js build script uses Browsersync when run in development mode. Some build artifacts might be created by this, especially duplicates of links created by the Metalsmith Collections plugin - double check the build before deploying, or delete build folder and *npm run build-production*.