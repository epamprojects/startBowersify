
var gulp    = require('gulp'),
    connect = require('gulp-connect'),
    connectLivereload = require('connect-livereload'),
    concat = require('gulp-concat'),
    spritesmith = require('gulp.spritesmith'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    stringify = require('stringify'),
    source = require('vinyl-source-stream'),
    jasmine = require('gulp-jasmine');


/*vendors*/
var stylesVendor ='./src/styles/',
    jsVendor = './src/js/**/',
    testVendor = './spec/';

var path = {
    'indexHtml': './src/*.html',


    /*directives*/
    "js":  'src/js/script.js',

    /*styles*/
    'styles':{
        'main_cssPath'  : stylesVendor + '*_main.css',
        'media_cssPath' : stylesVendor + '*_media.css',
        'main_sassPath' : stylesVendor + '*_main.scss',
        'media_sassPath': stylesVendor + '*_media.scss'
    },

    'test': testVendor+"*.js"
};

var destVendor = './build/';

var compiledDist = {
    'css'              : destVendor +'styles',
    'js': destVendor + 'js'
};

/**
 * init gulp server
 * */
gulp.task('connect', function () {
    connect.server({
        root: '',
        port: 8000,
        livereload: true
    });
});

/**
 * livereload index*/
gulp.task('indexHtml', function(){
    gulp.src(path.indexHtml)
        .pipe(connect.reload())
});

/**
 * livereload js*/
gulp.task('build:main_js', function() {
    return browserify({entries: './src/js/script.js', debug: true})
        .bundle()
        .on('error', errorHandler)
        .pipe(source('findem.js'))
        .pipe(gulp.dest(compiledDist.js))
        .pipe(connect.reload());
});

/**
 * livereload and build  mainCss
 * */
gulp.task('build:main_css', function(){
    gulp.src(path.styles.main_cssPath)
        .pipe(concat('main.css'))
        .pipe(connect.reload())
        .pipe(gulp.dest(compiledDist.css))

});

/**
 * livereload and build mediaCss
 * */
gulp.task('build:media_css', function(){
    gulp.src(path.styles.media_cssPath)
        .pipe(concat('media.css'))
        .pipe(connect.reload())
        .pipe(gulp.dest(compiledDist.css))

});

/**
 * livereload and build mainScss
 * */
gulp.task('build:main_scss', function(){
    return gulp.src(path.styles.main_sassPath)
        .on('error', function(err){ console.log(err.message); })
        .pipe(sass())
        .on('error', function(err){ console.log(err.message); })
        .pipe(concat('mainSass.css'))
        .pipe(gulp.dest(compiledDist.css))
        .pipe(connect.reload())
});

/**
 * livereload and build mediaScss
 * */
gulp.task('build:media_scss', function(){
    return gulp.src(path.styles.media_sassPath)
        .on('error', function(err){ console.log(err.message); })
        .pipe(sass())
        .on('error', function(err){ console.log(err.message); })
        .pipe(concat('mediaSass.css'))
        .pipe(gulp.dest(compiledDist.css))
        .pipe(connect.reload())
});

/**
 * Testing*/
gulp.task('test:jasmine', function () {
    return gulp.src('./test/*.js')
        .pipe(jasmine());
});
gulp.task('watch', ['indexHtml',

                    'build:main_js',
                    'build:main_css',
                    'build:media_css',
                    'build:main_scss',
                    'build:media_scss'
                    ], function () {
    /*livereload*/
    gulp.watch(path.indexHtml,             ['indexHtml']);

    /*livereload and build*/
    gulp.watch('./src/js/script.js',   ['build:main_js']);

    gulp.watch(path.styles.main_cssPath,   ['build:main_css']);
    gulp.watch(path.styles.media_cssPath, ['build:media_css']);

    gulp.watch(path.styles.main_sassPath,  ['build:main_scss']);
    gulp.watch(path.styles.media_sassPath, ['build:media_scss']);



});
/*sprite*/
gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./src/img/*.*')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                /* cssTemplate: 'stylus.template.mustache',*/
                cssVarMap: function(sprite) {
                    sprite.name = 's' + sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest('./build/images/'));
    spriteData.css.pipe(gulp.dest('./build/styles/'));
});


gulp.task('default',['connect', 'watch']);

var errorHandler = function(err) {
    console.error('Error: ' + err.message);
    this.emit('end');
};


gulp.task('try', function() {
    return gulp.src('src/main.js', { read: false })
        .pipe(browserify({
            transform: stringify({
                extensions: ['.html'], minify: true
            })
        }))
        .pipe(gif(env !== 'dev', uglify()))
        .pipe(gulp.dest(paths.build));
});