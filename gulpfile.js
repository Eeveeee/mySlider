let projectFolder = 'dist'
let srcFolder = 'src'
let path = {
  build: {
    html: projectFolder + '/',
    css: projectFolder + '/css/',
    js: projectFolder + '/js/',
    fonts: projectFolder + '/fonts/',
    img: projectFolder + '/src/images/',
    documents: projectFolder + '/src/documents/',
  },
  src: {
    html: srcFolder + '/html/pages/*.html',
    css: srcFolder + '/scss/**/index.*.scss',
    js: srcFolder + '/js/*.js',
    img: srcFolder + '/images/**/*.{jpg,png,svg,gif,ico,webp,sprite}',
    fonts: srcFolder + '/fonts/*.ttf',
    documents: srcFolder + '/documents/*.{pdf,xlsx}',
  },
  watch: {
    html: srcFolder + '/**/*.html',
    css: srcFolder + '/scss/**/*.scss',
    js: srcFolder + '/js/**/*.js',
    img: srcFolder + '/images/**/*.{jpg,png,svg,gif,ico,webp,sprite}',
    documents: srcFolder + '/documents/*.{pdf,xlsx}',
  },
  clean: './' + projectFolder + '/',
}

let { src, dest } = require('gulp'),
  gulp = require('gulp'),
  fileinclude = require('gulp-file-include'),
  browsersync = require('browser-sync').create(),
  del = require('del'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  clean_css = require('gulp-clean-css')
clean_css = require('gulp-clean-css')
function browserSync() {
  browsersync.init({
    server: {
      baseDir: './' + projectFolder + '/',
    },
    port: 3000,
    notify: false,
  })
}
function clearDist() {
  return del(path.clean)
}
function trackChanges() {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.img], images)
  gulp.watch([path.watch.js], js)
}
function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img).pipe(dest(path.build.img)).pipe(browsersync.stream())
}
function documents() {
  return src(path.src.documents)
    .pipe(dest(path.build.documents))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded',
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'not dead', '> 0.2%'],
        cascade: false,
      })
    )
    .pipe(group_media())
    .pipe(clean_css())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}
let build = gulp.series(
  clearDist,
  gulp.parallel(js, images, documents, css, html)
)
let watch = gulp.parallel(build, trackChanges, browserSync)

exports.js = js
exports.documents = documents
exports.css = css
exports.images = images
exports.html = html
exports.watch = watch
exports.build = build
exports.default = watch
