const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const version = require("./package.json").version;
// 编译并压缩js
gulp.task("default", function() {
    return gulp
        .src("src/*.js")
        .pipe(
            babel({
                presets: ["es2015"]
            })
        )
        .pipe(uglify())
        .pipe(
            rename(function(path) {
                path.basename += `-${version}`;
            })
        )
        .pipe(gulp.dest("dist/"));
});
