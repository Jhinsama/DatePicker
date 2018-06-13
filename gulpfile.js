'use strict';

let gulp = require('gulp');
let babel = require('gulp-babel');
let cleanCss = require('gulp-clean-css');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let connect = require('gulp-connect');

gulp.task("localhost", function () {
    connect.server({
        livereload: true,
        port: 2017
    });
});

gulp.task("watch", function () {
    gulp.watch("*.html", function () {
        gulp
            .src("*.html")
            .pipe(connect.reload());
    });
    gulp.watch(["*.css", "!*.min.css"], function () {
        gulp
            .src(["*.css", "!*.min.css"])
            .pipe(cleanCss())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest("./"))
            .pipe(connect.reload());
    });
    gulp.watch(["*.js", "!*.min.js", "!gulpfile.js"], function () {
        gulp
            .src(["*.js", "!*.min.js", "!gulpfile.js"])
            .pipe(babel({presets: ['es2015']}))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest("./"))
            .pipe(connect.reload());
    });
});

gulp.task("watch2", function () {
    gulp.watch("dist/index.html", function () {
        gulp
            .src("dist/index.html")
            .pipe(connect.reload());
    });
    gulp.watch("dist/index.css", function () {
        gulp
            .src("dist/index.css")
            .pipe(cleanCss())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest("dist/"))
            .pipe(connect.reload());
    });
    gulp.watch("dist/picker.js", function () {
        gulp
            .src("dist/picker.js")
            .pipe(babel({presets: ['es2015']}))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest("dist/"))
            .pipe(connect.reload());
    });
});

gulp.task("default", ["watch", "localhost"]);
gulp.task("server", ["watch2", "localhost"]);