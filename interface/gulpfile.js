'use strict';

var gulp = require('gulp'),
    cssmin = require('gulp-cssnano'),
    connect = require('gulp-connect'),
    del = require('del'),
    less = require('gulp-less'),
    opn = require('opn'),
    prefixer = require('gulp-autoprefixer'),
    prefixerOptions = { browsers: ['last 4 versions'] },
    rigger = require('gulp-rigger'),
    rimraf = require('gulp-rimraf'),
    sourcemaps = require('gulp-sourcemaps'),
    sequence = require('run-sequence'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        icons: 'src/img/'
    },
    src: {
		html: 'src/*.html',
        js: 'src/js/main.js',
        css: 'src/css/main.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        icons: 'src/icons/*.png'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/css/**/*.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        icons: 'src/icons/*.*'
    },
    clean: './build'
};

var server = {
    host: 'localhost',
    port: '9000'
};
var icons_template = 'src/icons/sprite.css.handlebars';

gulp.task('html:build', function (cb) {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(connect.reload());
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload());
});

gulp.task('style:build', function () {
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefixer(prefixerOptions))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(connect.reload());
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(connect.reload());
});

gulp.task('sprite:build', function () {
    var spriteData = gulp.src(path.src.icons).pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '../css/sprite.less',
        padding: 5,
        cssTemplate: icons_template
    }));
    return spriteData.pipe(gulp.dest(path.build.icons));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'sprite:build',
    'image:build'
]);

gulp.task('watch', function(){
    gulp.watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    gulp.watch([path.watch.css], function(event, cb) {
        gulp.start('style:build');
    });
    gulp.watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    gulp.watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    gulp.watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    gulp.watch([path.watch.icons], function(event, cb) {
        gulp.start('sprite:build');
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('openbrowser', function() {
    opn( 'http://' + server.host + ':' + server.port + '/build');
});

gulp.task('webserver', function() {
    connect.server({
        host: server.host,
        port: server.port,
        livereload: true
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('open', ['build', 'webserver', 'watch', 'openbrowser']);