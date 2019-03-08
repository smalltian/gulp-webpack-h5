/* * 
* @Author: zhujuntian  
* @Date: 2018-10-22 14:59:24 
*/
var gulp = require('gulp')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var fileinclude = require('gulp-file-include')
var htmlmin = require('gulp-htmlmin')
var rev = require('gulp-rev-append')
var minifycss = require('gulp-minify-css')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var postcss = require('gulp-postcss')
var cssnext = require('cssnext')
var precss = require('precss')
var imagemin = require('gulp-imagemin')
var browserSync = require('browser-sync')

 //使用gulp-plumber来捕获处理任务中的错误
var plumber = require('gulp-plumber') 
var webpack = require('webpack-stream')
var webpackConfig = require("./webpack.config.js")

//输出路径
var outdir = "dist";

/**
 * 将es6编译为可执行的js
 */
gulp.task('js', function () {
    return gulp.src(['src/**/*.js', '!src/js/libs/*.js'])
        /**
         * 使用gulp-babel解决es6，但是只能转换语法，对新的api不能转换，故结合webpack解决
         */
        // gulp-babel
        .pipe(babel({
            presets: ['es2015', 'es2016']
        }))
        .pipe(uglify())

        //webpack
        // .pipe(plumber({
        //     errorHandler: function (error) {
        //         this.emit('end')
        //     }
        // }))
        // .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(outdir))
        .pipe(browserSync.stream());
});

/**
 * 编译html，引入js css img等 ，并加上版本号，防止浏览器缓存
 */
gulp.task('html', function (done) {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src(['src/views/**/*.html', '!src/views/tmpl/*.html'])
        .pipe(fileinclude())
        .pipe(htmlmin(options))
        .pipe(rev())
        .pipe(gulp.dest(outdir + '/views'))
        .pipe(browserSync.stream());
});

/**
 * 编译sass
 */
gulp.task('sass', function () {
    var options = [
        autoprefixer,
        cssnext,
        precss
    ];
    return gulp.src(['src/styles/*.scss'])
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(postcss(options))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(outdir + '/styles'))
        .pipe(browserSync.stream());
});

/**
 * 编译css
 */
gulp.task('css', function () {
    var options = [
        autoprefixer,
        cssnext,
        precss
    ];
    return gulp.src(['src/styles/*.css'])
        .pipe(postcss(options))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true
        }))
        .pipe(minifycss())
        .pipe(gulp.dest(outdir + '/styles'))
        .pipe(browserSync.stream());
});

/**
 * 处理图片资源
 */
gulp.task('img', function () {
    return gulp.src(["src/images/*.*", "src/images/**/*.*"])
        // .pipe(imagemin({
        //     progressive: true
        // }))
        .pipe(gulp.dest(outdir + "/images"))
        .pipe(browserSync.stream());
});

/**
 * 对公用库不编译，进行复制
 */
gulp.task('copyjs', function () {
    return gulp.src(['src/js/libs/*.js'])
        .pipe(gulp.dest(outdir + '/js/libs'))
        .pipe(browserSync.stream());
});


/**
 * 创建服务
 */
gulp.task('server', ['copyjs', 'css', 'sass', 'img', 'js', 'html'], function () {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch("src/js/**/*.js", ['js']);
    gulp.watch(["src/styles/**/*.scss", "src/styles/*.scss"], ['sass']);
    gulp.watch(["src/styles/**/*.css", "src/styles/*.css"], ['css']);
    gulp.watch(["src/images/*", "src/images/**/*"], ['img']);
    gulp.watch(["src/views/*.html", "src/views/**/*.html"], ['html']);
});

gulp.task('default', ['server'])