/* GLOBAL: console */

require('./handlebars-helpers')();

var webpack = require('webpack-stream'),
    gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    handlebars = require('handlebars'),
    gulpHandlebars = require('gulp-handlebars-html')(handlebars),
    rename = require('gulp-rename'),
    yaml = require('js-yaml'),
    fs   = require('fs'),
    inject = require('gulp-inject'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    cleanCSS = require('gulp-clean-css'),
    favicons = require('gulp-favicons');

/* pathConfig*/
var entryPoint = './src/scripts/index.js',
    browserDir = './build',
    sassWatchPath = './src/styles/**/*.scss',
    jsWatchPath = './src/scripts/**/*.js',
    htmlWatchPath = './**/*.html',
    hbsWatchPath = './src/templates/**/*.hbs',
    yamlWatchPath = './src/data/**/*.yaml',
    staticPath = './src/static';
/**/
// First of all delete any old build directory
del.sync(browserDir);

gulp.task('browser-sync', function () {
    const config = {
        server: {baseDir: browserDir}
    };

    return browserSync(config);
});

gulp.task('favicons', function () {
    return gulp.src('./favicon.png').pipe(favicons({
        appName: 'Gulp Boilerplate',
        developerName: 'Timo Zoeller',
        background: '#020307',
        path: 'favicons/',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/?homescreen=1',
        version: 1.0,
        logging: false,
        online: false,
        html: '../favicons.html',
        pipeHTML: true,
        replace: true
    }))
    .pipe(gulp.dest(`${browserDir}/favicons`));
});

gulp.task('inject-favicon', ['favicons', 'hbs'], function() {
  gulp.src(`${browserDir}/index.html`)
  .pipe(inject(gulp.src([`${browserDir}/favicons.html`]), {
    starttag: '<!-- inject:head:html -->',
    transform: function(filePath, file) {
      return file.contents.toString('utf8'); // return file contents as string
    }
  }))
  .pipe(gulp.dest(browserDir));
});

gulp.task('hbs', () => {
  let data = Object.create(null);
  let stream;
  try {
      data = yaml.safeLoad(fs.readFileSync('./src/data/data.yaml', 'utf8'));
      console.log('SUCCESS: data loaded');
  } catch (e) {
      console.log('ERROR');
      console.log(e);
  }

  const options = {
      partialsDirectory : ['./src/templates/partials']
  };
    
  stream = gulp.src('./src/templates/index.hbs')
               .pipe(gulpHandlebars(data, options))
               .pipe(rename('index.html'))
               .pipe(gulp.dest(browserDir));
  return stream;
});

gulp.task('js', function () {
    return gulp.src(entryPoint)
               .pipe(webpack({
                    watch: false,
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
               .on('data', () => browserSync.reload());
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

gulp.task('copyStatic', function() {
    return gulp.src(staticPath + '/**/*')
               .pipe(gulp.dest('./build/static'));
});

gulp.task('watch', function () {
    gulp.watch(jsWatchPath, ['js']);
    gulp.watch(sassWatchPath, ['sass']);
    gulp.watch([yamlWatchPath, hbsWatchPath], ['hbs']);
    gulp.watch(staticPath + '/**/*', ['copyStatic']);
    gulp.watch(htmlWatchPath, function () {
        return gulp.src('')
            .pipe(browserSync.reload({stream: true}));
    });
});

gulp.task('compress-js', ['js'], function () {
  fs.rename(`${browserDir}/scripts/bundle.js`, `${browserDir}/scripts/bundle.tmp.js`, err => err && console.log(err));
  return gulp.src(`${browserDir}/scripts/bundle.tmp.js`)
             .pipe(uglify())
             .pipe(rename('bundle.js'))
             .pipe(gulp.dest(`${browserDir}/scripts`));
});

gulp.task('compress-css', ['sass'], function () {
  fs.rename(`${browserDir}/styles/style.css`, `${browserDir}/styles/style.tmp.css`, err => err && console.log(err));
  return gulp.src(`${browserDir}/styles/style.tmp.css`)
             .pipe(cleanCSS())
             .pipe(rename('style.css'))
             .pipe(gulp.dest(`${browserDir}/styles`));
});

gulp.task('cleanup', ['compress-js', 'inject-favicon'], () => 
    del([`${browserDir}/scripts/bundle.tmp.js`, `${browserDir}/scripts/bundle.js.map`, `${browserDir}/favicons.html`, `${browserDir}/styles/style.tmp.css`])
);

gulp.task('run', ['hbs', 'js', 'sass', 'copyStatic', 'watch', 'browser-sync']);
gulp.task('build', ['hbs', 'favicons', 'inject-favicon', 'js', 'compress-js', 'sass', 'compress-css', 'copyStatic', 'cleanup']);