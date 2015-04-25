var source = require('vinyl-source-stream');
var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var notify = require('gulp-notify');

var sourcesDir = './ui/jsx',
    appEntryPoint = "app.js",
    targetDir = './public/build';


gulp.task('default', function() {
  return browserify({entries: [sourcesDir + '/' + appEntryPoint], debug: true})
    .transform(reactify)
    .bundle()
    .pipe(source(appEntryPoint))
    .pipe(gulp.dest(targetDir))
    .pipe(notify("Bundling done."));
});

gulp.task('watch', function() {
  gulp.watch(sourcesDir + '/' + "*.js", ['default']);
});