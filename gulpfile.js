import path from 'path' //Dependencia para el deescalado
import fs from 'fs' //Dependencia para el deescalado
import {glob} from 'glob' //Dependencia para generar archivos webp
import {src,dest, watch, series} from 'gulp'    //Importando funciones propias de Gulp (src permite acceder a archivos) (dest permite almacenar archivos)
import * as dartSass from 'sass' //SASS esta escrito en dart, esto es solo para importar todas las funciones de SASS en general (tinta)
import gulpSass from 'gulp-sass' //Dependencia para usar SASS en un archivo de GULP (lapicero)
import cleanCSS from 'gulp-clean-css' //Dependencia para compactar un archivo CSS

const sass = gulpSass(dartSass) //Haciendole saber a gulpSass que tiene que usar las funciones de dartSass



//Esta funcion va a compilar sass en un css
//Usamos export para poder mandarla a llamar fuera de este archivo en el package.json
export function css(done){
    src('src/scss/app.scss', {sourcemaps: 'true'}) //Funcion que ubica el archivo
        .pipe(sass().on('error',sass.logError)) //Funcion que compila sass a css y .on escucha por lo que sea que le pidas dentro de la funcion
        //sass tiene un listener de error, y si escucha el error, devuelve el reporte del error en la consola
        .pipe(cleanCSS({compatibility:'ie8'}))
        .pipe(dest('build/css', {sourcemaps: '.'})) //Funcion que guarda el archivo en el destinatario

    done()
//Los pipes son como funciones en orden, adentro de un pipe pones una tarea y una vez empieze y finalize se ejecuta el siguiente pipe.
}

//Funcion para observar por cambios en cualquier archivo o carpeta, desde la carpeta de imagenes hasta todos los archivos de scss
export function dev(){
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', js)
    watch('src/img/**/*.png,jpg}', imagenes)
     //observa por cambios en la carpeta y luego ejecuta la funcion previamente definida (css, js)
}

import terser from 'gulp-terser' //Dependencia para compactar el app.js
import sharp from 'sharp' //Dependencia para el deescalado

export function js(done){
    src('src/js/app.js')//Busca el archivo js
        .pipe(terser())//Compacta el archivo
        .pipe(dest('build/js'))//Lo guarda en la build
    done();
}


//Codigo de node sacado de internet para deescalar las imagenes de la galeria para bajar su peso y mejorar el performance de la web en la galeria (Honestamente no se como funciona porque esta escrito en node)
export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'
    const outputFolder = 'src/img/gallery/thumb';
    const width = 250;
    const height = 180;
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file)
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile) 
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile)
        });

        done()
    } catch (error) {
        console.log(error)
    }
}
//Misma historia pero para generar archivos webp

export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './build/img';
    const images =  await glob('./src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}

export default series(imagenes,crop,css,js,dev) //Con la funcion "default" ya no es necesario exportar las funciones del archivo gulp individualmente, puesto a que cuando llamamos el archivo exporta y ejecuta en orden las funciones declaradas dentro de la funcion "series"
//"parallel" hace lo mismo que "series" pero arranca todas las tareas al mismo tiempo, no una por una