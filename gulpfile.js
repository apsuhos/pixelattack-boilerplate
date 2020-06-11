const gulp = require('gulp');
const yargs = require('yargs');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const purgecss = require('@fullhuman/postcss-purgecss');
const imagemin = require('gulp-imagemin');
const del = require('del');
const concat = require('gulp-concat');
const deporder = require('gulp-deporder');
const terser = require('gulp-terser');
const stripdebug = require('gulp-strip-debug');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');

const PRODUCTION = yargs.argv.prod;
/*
console.log(PRODUCTION);
gulp style --prod // true
gulp style // undefinded
*/

// Basic import/export directories
const dir = {
  src: 'src/',
  dist: 'dist/'
};

// Paths
const paths = {
  styles: {
    // is arr for extra css files
    // src:[`${dir.src}scss/main.scss`, `${dir.src}scss/another.scss`]
    src: [`${dir.src}scss/main.scss`],
    dist: `${dir.dist}css/`,
    watch: `${dir.src}scss/**/*`
  },
  scripts: {
    src: `${dir.src}js/**/*`,
    dist: `${dir.dist}js/`,
    watch: `${dir.src}js/**/*`
  },
  images: {
    src: `${dir.src}images/**/*`,
    dist: `${dir.dist}images/`,
    watch: `${dir.src}images/**/*`
  },
  other: {
    src: [
      `${dir.src}**/*`,
      `!${dir.src}{images,js,scss}`,
      `!${dir.src}{images,js,scss}/**/*`
    ],
    dist: dir.dist
  }
};

// Serve and reload tasks
const server = browserSync.create();

gulp.task('serve', (done) => {
  server.init({
    server: dir.dist
  });
  done();
});

gulp.task('reload', (done) => {
  server.reload();
  done();
});

// Clean task
gulp.task('clean', () => del(['dist']));

// Styles task
const cssConfig = {
  src: paths.styles.src,
  dist: paths.styles.dist,
  watch: paths.styles.watch,
  sassOptions: {
    outputStyle: 'expanded',
    precision: 2,
    includePaths: [
      'node_modules/sass-mq/',
      'node_modules/inuitcss/',
      'node_modules/inuit-flexgrid/'
    ]
  },
  postCSS: [
    autoprefixer()
  ]
};

if (PRODUCTION) {
  cssConfig.postCSS.push(
    purgecss({
      content: ['src/**/*.html']
    }),
    cssnano({
      preset: 'default'
    })
  );
}

function onError(err) {
  /* eslint-disable */
  console.log('Name:', err.name);
  console.log('File:', err.file);
  console.log('Line:', err.line);
  console.log('Column:', err.column);
  /* eslint-enable */
  return true;
}

gulp.task('styles', () => gulp.src(cssConfig.src)
  .pipe(plumber({
    errorHandler: onError
  }))
  .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
  .pipe(sass(cssConfig.sassOptions))
  .pipe(postcss(cssConfig.postCSS))
  .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
  .pipe(gulp.dest(cssConfig.dist))
  .pipe(server.stream()));

// Scripts task
const jsConfig = {
  src: paths.scripts.src,
  dist: paths.scripts.dist,
  watch: paths.scripts.watch
};

gulp.task('scripts', () => gulp.src(jsConfig.src)
  .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
  .pipe(deporder())
  .pipe(concat('main.js'))
  .pipe(gulpif(PRODUCTION, stripdebug()))
  .pipe(gulpif(PRODUCTION, terser()))
  .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
  .pipe(gulp.dest(jsConfig.dist)));

// Images task
const imagesConfig = {
  src: paths.images.src,
  dist: paths.images.dist,
  watch: paths.images.watch,

  minOptions: [
    // https://github.com/imagemin/imagemin-optipng#options
    imagemin.gifsicle({
      optimizationLevel: 5,
      interlaced: null
    }),
    // https://github.com/imagemin/imagemin-mozjpeg#options
    imagemin.mozjpeg({
      quality: 75,
      progressive: true
    }),
    // https://github.com/svg/svgo#what-it-can-do
    imagemin.svgo({
      plugins: [
        { removeViewBox: true },
        { sortAttrs: true }
      ]
    })
  ]
};

gulp.task('images', () => gulp.src(imagesConfig.src)
  .pipe(gulpif(PRODUCTION, imagemin(imagesConfig.minOptions)))
  .pipe(gulp.dest(imagesConfig.dist)));

// Copy task
gulp.task('copy', () => gulp.src(paths.other.src)
  .pipe(gulp.dest(paths.other.dist)));

// Watch task
gulp.task('watch', () => {
  gulp.watch(cssConfig.watch, gulp.series('styles'));
  gulp.watch(jsConfig.watch, gulp.series('scripts', 'reload'));
  gulp.watch(imagesConfig.watch, gulp.series('images', 'reload'));
  gulp.watch(paths.other.src, gulp.series('copy', 'reload'));
});

gulp.task('default',
  gulp.series('clean', gulp.parallel('styles', 'scripts', 'images', 'copy'), 'serve', 'watch'));

gulp.task('build',
  gulp.series('clean', gulp.parallel('styles', 'scripts', 'images', 'copy')));
