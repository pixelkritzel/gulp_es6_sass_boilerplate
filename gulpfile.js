/**
 * Created by Dmytro on 3/27/2016.
 */
var webpack = require('webpack-stream'),
    gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserSync = require('browser-sync');

/* pathConfig*/
var entryPoint = './src/scripts/index.js',
    browserDir = './',
    sassWatchPath = './src/styles/**/*.scss',
    jsWatchPath = './src/scripts/**/*.js',
    htmlWatchPath = './**/*.html';
/**/

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('browser-sync', function () {
    const config = {
        server: {baseDir: browserDir}
    };

    return browserSync(config);
});

gulp.task('js', function () {

    return gulp.src(entryPoint)
               .pipe(webpack({
                    watch: true,
                    devtool: 'source-map',
                    module: {
                        loaders: [
                            { test: /\.js$/, loader: 'babel' },
                        ],
                    },
                    output: {
                        filename: 'bundle.js'
                    }
               }))
               .pipe(gulp.dest('./build/scripts'))
               .on('data', e => browserSync.reload());
});

gulp.task('sass', function () {
  return gulp.src(sassWatchPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/styles'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function () {
    gulp.watch(jsWatchPath, ['js']);
    gulp.watch(sassWatchPath, ['sass']);
    gulp.watch(htmlWatchPath, function () {
        return gulp.src('')
            .pipe(browserSync.reload({stream: true}))
    });
});

gulp.task('run', ['js', 'sass', 'watch', 'browser-sync']);