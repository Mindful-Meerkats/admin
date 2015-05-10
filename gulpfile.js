var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var less = require('gulp-less');
var notify = require('gulp-notify');
var nodemon = require('gulp-nodemon');
var source = require('vinyl-source-stream');
var taskListing = require('gulp-task-listing');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('shelljs');
var reactTools = require('react-tools');
var htmlreplace = require('gulp-html-replace');

// Add a task to render the output
gulp.task('help', taskListing);

// Compile less
gulp.task('less', function() {
  return gulp.src('./less/index.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/css'));
});

// Prefix
gulp.task('prefix', function () {
    return gulp.src('./public/css/index.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/css'));
});

// Start and watch server.js
gulp.task('server', function(){
	nodemon({
		script: 'server.js',
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
	});
});

// Compress die shizzle
gulp.task('compress:css', function(){
  return gulp.src('./public/css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./public/dist'));
});

// Concat all the components
gulp.task('concat:scripts', function() {
  return gulp.src('./public/js/*')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./build/'));
});

// Transform jsx to js
gulp.task('react', function(){
  shell.mkdir('-p', './build');
  shell.ls('./public/jsx').forEach(function( file ){
    var rC = fs.readFileSync( './public/jsx/' + file, 'utf-8' );
    var js = reactTools.transform( rC );
    // Lefthand file name
    var lhfn = file.split('.')[0];
    fs.writeFile( './public/js/__' + lhfn + '.js', js  );
  });
});

// Compress all them scripts
gulp.task('compress:scripts', function(){
  return gulp.src('./build/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('replaceHtml', function(){
  return gulp.src('./views/index.ejs')
    .pipe(htmlreplace({js: ['/dist/index.js'], css: ['/dist/index.css']} ))
    .pipe(gulp.dest('./public/'));
});

// Sequece die shit
gulp.task('compile:production', function(){
  runSequence('less','prefix', 'compress:css');
  runSequence('react', 'concat:scripts', 'compress:scripts', function(){
    shell.rm('-r', './build');
    shell.rm('./public/js/__*.js');
  });
  runSequence('replaceHtml', function(){
    shell.rm('./public/index.html');
    shell.mv('./public/index.ejs', './public/index.html');
  });
});

// Watch die shizzle
gulp.task('watch', function(){
  gulp.watch('./less/*.less', ['less', 'prefix']);
});

gulp.task('default', ['server', 'less', 'prefix', 'watch']);






