var gulp = require('gulp');
var sass = require('gulp-sass'); // Permet de transformer les fichiers sass en fichiers css
var rename = require("gulp-rename"); // Permet de renommer les fichiers
var autoprefixer = require('gulp-autoprefixer'); //  Permet d'ajouter les autoprefixer aux instructions CSS3
var sourcemaps = require('gulp-sourcemaps'); // Permet de générer le sourcemap du fichier sass
var git = require('gulp-git'); // Permet de récupérer le git du projet
var stripCssComments = require('gulp-strip-css-comments'); // Permet de supprimer les commentaires du sass
var browserSync = require('browser-sync').create(); // Permet de créer la synchronisation du navigateur avec le code
var minify = require('gulp-minify'); // Permet de minimifier le Javascript
var concat = require('gulp-concat'); // Permet de concaténer les fichiers JS afin d'assembler plusieurs fichiers JS en un seul
var jshint = require('gulp-jshint'); // Permet de voir les erreurs dans le javascript
var ts = require('gulp-typescript');

// We need to set up an error handler (which gulp-plumber calls).
// Otherwise, Gulp will exit if an error occurs, which is what we don't want.
var onError = function( err ) {
  console.log( 'An error occured:', err );
  this.emit( 'end' );
}

// Tâches pour le CSS
gulp.task('sass', function() {
	gulp.src('assets/dev/scss/master.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({ env : true, cascade : true, add : true, remove : true, supports : true, flexbox : true, grid : true }))
		.pipe(stripCssComments())
		.pipe(sourcemaps.write('../css'))
		.pipe(gulp.dest('assets/css/'));

	// Pour minimifier css avec SASS
	gulp.src('assets/dev/scss/master.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			env : true, cascade : true, add : true, remove : true, supports : true, flexbox : true, grid : true
		  }))
		.pipe(stripCssComments())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('../css'))
		.pipe(gulp.dest('assets/css/'))
	.pipe(browserSync.stream());

});


// Tâche pour minimifier le JS. Possibilité de concaténer les fichiers avec gulp concat
//return gulp.src(['assets/dev/js/file3.js', 'assets/dev/js/file1.js', 'assets/dev/js/file2.js'])
//.pipe(concat('app.js'))
// gulp.task('js', function () {
//     return gulp.src('assets/dev/js/*js')
// 		.pipe(jshint())
// 	    .pipe(jshint.reporter()) // Dump results
// 		.pipe(minify({
// 	        ext:{ src:'.js', min:'.min.js' },
// 	        exclude: ['tasks'],
// 	        ignoreFiles: ['.jquery.min.js']
// 	    }))
//         .pipe(gulp.dest('assets/js'))
// 		.pipe(browserSync.stream());
// });

gulp.task('ts', function () {
    return gulp.src('assets/dev/ts/*ts')
		.pipe(sourcemaps.init()) // On créé le sourcemaps pour savoir d'ou vient la ligne
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'master.js'
        }))
		.pipe(minify({
			ext:{ src:'.js', min:'.min.js' },
			exclude: ['tasks'],
			ignoreFiles: ['.jquery.min.js']
		}))
		.pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
		.pipe(gulp.dest('assets/js'))
		.pipe(browserSync.stream());
});

// Pour récupérer la structure du projet
gulp.task('createProjet', function() {
	git.clone('https://github.com/rohenha/html-template', function (err) {
		if (err) throw err;
  	});
});

// Fonction principale à appeler pour lancer l'écoute
gulp.task( 'project', function() {
	browserSync.init({ server: "./" });
	gulp.watch('assets/dev/scss/partials/*.scss', ['sass']);
	gulp.watch("*.html").on('change', browserSync.reload);
	// gulp.watch("assets/dev/js/*.js", ['js']);
	gulp.watch("assets/dev/ts/*.ts", ['ts']);
});
