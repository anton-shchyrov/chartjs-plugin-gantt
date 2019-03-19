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
 * " + packageFile.homepage + "\n\
 * Version: " + packageFile.version +"\n\
 *\n\
 * Copyright 2019 Anton Shchyrov\n\
 * Released under the Apache 2.0 license\n\
 * " + git + "#LICENSE\n\
 */\n\n";

gulp.task("build-prod", buildProd);
gulp.task("build-dev", buildDev);

function prepare(debug) {
    const res = browserify(
        {
            entries: config.src,
            debug: debug
        })
        .plugin("esmify");
    if (!debug)
        res.external("chart.js");
    return res
        .bundle()
        .pipe(source(config.outName))
        .pipe(header(hdr))
        .pipe(gulp.dest(config.outDir));
}

function buildProd() {
return prepare(false)
        .pipe(streamify(uglify()))
        .pipe(streamify(concat(config.outNameMin)))
        .pipe(gulp.dest(config.outDir));
}

function buildDev() {
    return prepare(true);
}
