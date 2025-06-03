// Initialize modules
//in this section we are importing all the npm packages that we installed from terminal as modules into the file so that
//we can access them and any functions that these packages contain
const { src, dest, watch, series } = require('gulp');//importing gulp functions src:tells gulp where to look for the files, dest:tells gulp where to put the output, watch:tells gulp to watch for changes ,series:runs tasks one after another
const sass = require('gulp-sass')(require('sass'));//tells gulp to use sass to convert .scss to .css
const postcss = require('gulp-postcss');//allows you to run the plugins autoprefixer and cssnano
const autoprefixer = require('autoprefixer');//adds extra css to work in all browsers like old and new browsers
const cssnano = require('cssnano');//makes the css files smaller minifies the files
const babel = require('gulp-babel');//converts modern js to old so it works in all browsers old and new
const terser = require('gulp-terser');//makes the js code smaller
const browsersync = require('browser-sync').create();// thi sets up browsersync so your site reloads when you change the file

// Use dart-sass for @use
// in this section we set the sass compiler to use dart sass so that we can use key words use and forwards syntax in sass code
//sass.compiler = require('dart-sass');//tells the gulp to use dart sass which is a newer version of sass
//we commented the dart sass beacuse now in this new version normal sass contains dart sass

// Sass Task
//in this section here we need to compile our sass and javascript files
function scssTask() {//in this line we are using a funciton called scssTask() it is running multiple different things using pipe function which is a gulp function
  return src('app/scss/style.scss', { sourcemaps: true })//here we are accesing the style.scss file,sass source maps are an extra file that is generated it is used when you are testing your website and looking at the developer tools when you inspect a certain set of styles it will actually tell you the original sass file and the line number where it came from,so source map just makes things easier when you're trying to debug and see where some style rule is coming from so we are setting source maps to true
    //
    .pipe(sass().on('error', sass.logError))//here we are piping the next thing we want to run which is the sass function this is from the gulp sass module it runs sass to compile sass to css it conversts scss to css if there is an error while compiling scss to css logs what the error is instead of crashing
    .pipe(postcss([autoprefixer(), cssnano()]))//here we run postcss plugins autiprefixer() and cssnano(),autoprefixer adds browser prefixes to support old browsers for new css properties and cssnano will minify the css file
    .pipe(dest('dist', { sourcemaps: '.' }));//this is going to set the final destination of compiled css file into a folder called dist
}

// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))//babel is going to make the new javascript run on old browsers
    .pipe(terser())//to minify our javascriptfile
    .pipe(dest('dist', { sourcemaps: '.' }));//setting destination of js file to dist
}

// Browsersync
function browserSyncServe(cb) {//creates a funciton named browsersyncserve and cb is called when the task is finished
  browsersync.init({//this starts a small local server so you can see your website in the browser
    server: {
      baseDir: '.',//this says to show the files from the current project folder
    },
    notify: {
      styles: {//this calls a little popup at he bottom of the screen to say browser reloaded
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();//this says the task is finished so gulp can go to the next task
}
function browserSyncReload(cb) {
  browsersync.reload();//this is a helper function which tells the browser to reload the page when something changes 
  cb();//c says the task is finished move to other function
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);//this line says watch all the html files in the in the project and reload the browser when a html file changes
  watch(
    ['app/scss/**/*.scss', 'app/**/*.js'],//watches for any .scss files or .js files in app/scss/ folder or app/ folder
    series(scssTask, jsTask, browserSyncReload)//if it finds any changes in .scss or .js files it runs the scssTask funciton which does task like compiling scss into css and jsTask funciton which performs task like building js code and then reloads the browser
  );
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);//when gulp is run in the terminal it performs these tasks in order first it runs scssTask then jsTask then start a server with browsersyncserve then watch for changes with browser syncserve
//so what it actually does is it builds code, gives a preview in the browser and autorefresh when the file changes

// Build Gulp Task
exports.build = series(scssTask, jsTask);//this is a shortcut when you just want to build scss and js code and dont want live server and autorefersh
