const gulp = require('gulp'), 
      autoprefixer = require('gulp-autoprefixer'), //prefixer css
      clean = require('gulp-clean'), //clean files and folders
      browserSync = require('browser-sync').create(), //monitoring code
      sourcemaps = require('gulp-sourcemaps'),
      sass = require('gulp-sass'), // sass
      imagemin = require('gulp-imagemin'), //сжатия изображений
      useref = require('gulp-useref'), //для сборки проекта в папке dist
      gulpif = require('gulp-if'),
      minifyCSS = require('gulp-clean-css'), //minify css
      uglify = require('gulp-uglify');// minify js

 

//читает htnl специальные коменты и конкатинирует файлы + минифицырует
gulp.task('listen_html', () => {
   return gulp.src('./src/*.html')
      .pipe(useref())
      .pipe(gulpif('*.css', autoprefixer({cascade: false})))
      .pipe(gulpif('*.css', minifyCSS({level: 2})))
      .pipe(gulpif('*.js', uglify({toplevel: true})))
      
      .pipe(gulp.dest('dist'));
});

//Удалить всё в указанной папке
gulp.task('cleans', () => {
   return gulp.src('./dist/*', {read: false})
      .pipe(clean());
});

//оптимизация (сжатия) изображении
gulp.task('img-compresed', () => {
   return gulp.src('./src/img/**')
      .pipe(imagemin({
         progressive: true
      }))
      .pipe(gulp.dest('./dist/img/'))
});

//компилирует sass в css
gulp.task('styleSCSS', () => {
   return gulp.src('./src/scss/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(gulp.dest('./src/css'))
});

//слежка за файлами
gulp.task('watch', () => {
   browserSync.init({
      server: {
          baseDir: "./src"
      }
   });

   //Следить за SCSS файлами
   gulp.watch('./src/scss/**/*.scss', gulp.series('styleSCSS'))
   gulp.watch('./src/js/**/*.js', browserSync.reload)
   gulp.watch('./src/css/**/*.css', browserSync.reload)
   
   
   //При изменении HTML запустить синхронизацию
   gulp.watch("./src/*.html").on('change', browserSync.reload);
});

// //Таск запускает таск build и watch последовательно
gulp.task('default', gulp.series( 'cleans', gulp.parallel('listen_html', 'img-compresed') ));
