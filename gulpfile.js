// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var concatCss = require('gulp-concat-css');
var minifyCSS = require('gulp-minify-css');

var concat = require('gulp-concat');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');

var browserSync = require('browser-sync').create();

var notify = require('gulp-notify');

var fontmin = require('gulp-fontmin');

var bowerDirectory = function (filejs) {
    return "bower_components/" + filejs;
};

/*
 Definición de Tareas
 Lint Task
 Nuestra tarea lint comprueba cualquier archivo JavaScript en nuestro directorio js/
 y se asegura de que no haya errores en nuestro código.
 */
gulp.task('lint', function () {
    return gulp.src('src/assets/js/**/*.js')
        .pipe(concat('todo.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify('Ha finalizado la task lint'));
});

/*
 Compile Our Sass
 La tarea Sass compila cualquiera de nuestros archivos Sass en nuestra directorio scss/ en el CSS
 y guarda el archivo CSS compilado en nuestro directorio app/css.
 */
gulp.task('sass', function () {
    return gulp.src([
        'src/assets/scss/*.scss',
        'src/assets/css/*.css',
        bowerDirectory('materialize/dist/css/materialize.min.css')
    ]).pipe(sass())
        .pipe(cssnano())
        .pipe(concatCss('style.min.css'))
        .pipe(minifyCSS({keepBreaks: false}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        })).pipe(notify("Ha finalizado la task css!"));
});

/*
 Concatenate & Minify JS
 La tarea scripts concatena todos los archivos JavaScript en nuestro js/
 y ahorra que la salida de nuestro directorio app/js.
 Entonces gulp detiene archivo concatenado, minifica el js, lo renombra y lo guarda en el directorio app/js
 junto con el archivo concatenado.
 */
gulp.task('scripts', function () {
    return gulp.src([
        bowerDirectory('jquery/dist/jquery.min.js'),
        'src/assets/js/*.js',
    ]).pipe(concat('javascript.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(notify("Ha finalizado la task js!"));
});

/*
 Minify Task
 Minifica el html dejandolo en el directorio app del proyecto
 */
gulp.task('minify', function () {
    return gulp.src('src/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        })).pipe(notify("Ha finalizado la task html!"));
});

/*
Minify Font
Minifica el fuente en la carpeta font y la deja en dist/font
*/
gulp.task('minifyFont', function () {
    return gulp.src('src/fonts/*.ttf')
        .pipe(fontmin())
        .pipe(gulp.dest('dist/fonts'));
});

/*
 Watch Files For Changes
 La tarea watch se utiliza para ejecutar tareas como hacemos cambios en nuestros archivos.
 Como se escribe código y modificar sus archivos, el método gulp.watch () va a escuchar los cambios
 y ejecutar automáticamente las tareas de nuevo, así que no tenemos que saltar continuamente de nuevo a nuestra
 línea de comandos y ejecute el comando gulp cada vez.
 */
gulp.task('watch', ['browserSync', 'sass', 'lint', 'scripts', 'minify'], function () {
    gulp.watch('src/assets/js/*.js', ['lint', 'scripts']);
    gulp.watch(['src/assets/css/*.css', 'src/assets/scss/*.scss'], ['sass']);
    gulp.watch('src/*.html', ['minify']);
});

/*
 browserSync Task
 Permite que el proyecto se actualice en el navegador
 */
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    })
});

/*
 Default Task
 Finalmente, tenemos nuestro tarea por defecto que se utiliza como una referencia agrupados a las otras tareas.
 Esta será la tarea que se corrió al entrar de golpe en la línea de comando sin ningún parámetro adicional.
 */
gulp.task('default', ['lint', 'sass', 'scripts', 'minify', 'watch']);