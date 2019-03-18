"use strict";
const gulp = require("gulp"),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    uglify = require('gulp-uglify-es').default,
    streamify = require("gulp-streamify"),
    browserify = require("browserify"),
    packageFile = require('./package.json');

const config = {
    src: "./src/index.js",
    outDir: "./dist/",
    outName: "chartjs-plugin-gantt.js",
    outNameMin: "chartjs-plugin-gantt.min.js",
};

const git = packageFile.homepage.replace(/\#.*/, '');

const hdr = "/*!\n\
 * chartjs-plugin-gantt\n\
 * http://chartjs.org/\n\
 * Version: " + packageFile.version +"\n\
 *\n\
 * Copyright 2019 Anton Shchyrov\n\
 * Released under the Apache 2.0 license\n\
 * " + git + "#LICENSE\n\
 */\n\n";

gulp.task("build", buildProd);

function buildProd() {
    return browserify(config.src)
        .plugin("esmify")
        .ignore("chart.js")
        .bundle()
        .pipe(source(config.outName))
        .pipe(header(hdr))
        // .pipe(insert.prepend("header"))
        .pipe(gulp.dest(config.outDir))
        .pipe(streamify(uglify()))
        .pipe(streamify(concat(config.outNameMin)))
        .pipe(gulp.dest(config.outDir));

}