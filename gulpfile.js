var source = require('vinyl-source-stream');
var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var notify = require('gulp-notify');
var taskListing = require('gulp-task-listing');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var path = require('path');

var sourcesDir = './react',
    appEntryPoint = "main.js",
    targetDir = './public/build';


// Add a task to render the output 
gulp.task('help', taskListing);

gulp.task('less', function() {
  return gulp.src('./less/index.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('server', function(){
	nodemon({
		script: 'server.js', 
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
	});
});	

gulp.task('browserify', function() {
  return browserify({entries: [sourcesDir + '/' + appEntryPoint], debug: true})
    .transform(reactify)
    .bundle()
    .pipe(source(appEntryPoint))
    .pipe(gulp.dest(targetDir))
    .pipe(notify("Bundling done."));
});

gulp.task('default', ['server', 'less', 'watch']);

gulp.task('watch', function() {
  gulp.watch('./less/*.less', ['less']);
  //gulp.watch(sourcesDir + '/' + "*.js", ['browserify']);
});