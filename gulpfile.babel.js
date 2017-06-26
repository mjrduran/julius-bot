import _gulp from 'gulp';
import gulpHelp from 'gulp-help';
import del from 'del';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';

const gulp = gulpHelp(_gulp);

gulp.task('clean', 'remove generated files in dist directory', () => {
  return del([
    'dist/**/*'
  ]);
});

gulp.task('copy-config', ['clean'], () =>
  gulp.src('config/*.json', {base: '.'})
    .pipe(gulp.dest('./dist/')));

gulp.task('copy-modules', ['clean'], () =>
  gulp.src('node_modules/**/*.*', {base: '.'})
    .pipe(gulp.dest('./dist/')));

gulp.task('babel', 'generate es5 files in dist directory',['clean', 'copy-config', 'copy-modules'], () => {
  gulp.src(['src/**/*.js', 'config/**/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', 'watcher task to generate es5 files', () => {
  gulp.watch('src/**/*.js', ['babel']);
});

gulp.task('lint', 'run eslint on all the source files', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['babel']);
