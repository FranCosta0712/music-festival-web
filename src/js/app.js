//Creando Galeria con JS

document.addEventListener('DOMContentLoaded', function(){ 
    //addEventListener para escuchar a que este listo el html para mostrar
    //DOMContentLoaded es un parametro que dice, cuando cargue el archivo, se ejecuta la funcion que estamos abriendo
    navegacionFija()
    crearGaleria()
    resaltarEnlace()
    scrollNav()
})
function navegacionFija(){
    const header = document.querySelector('.header')
    const sobreFestival = document.querySelector('.sobre-festival')

    document.addEventListener('scroll', function(){ //Esta funcion se ejecuta siempre que demos scroll en nuestra web
        if(sobreFestival.getBoundingClientRect().bottom < 1){ //El metodo .getBoundingClientRect() devuelve coordenadas de un archivo en numeros positivos y negativos. En este caso, pasandole a ese metodo un .bottom devuelve un numero negativo cuando estemos debajo de la clase la seccion festival. Ponemos un condicional para ejecutar un codigo a penas detectemos que estamos debajo de la seccion festival.
        
            header.classList.add('fixed')
        }
        else{
           header.classList.remove('fixed') 
        }
    })
}

function crearGaleria(){ //funcion para crear galeria

    const CANTIDAD_IMAGENES = 16
    const galeria = document.querySelector('.galeria-imagenes')

    //Loop para iterar el codigo en las 16 imagenes
    for(let i = 1; i<=CANTIDAD_IMAGENES; i++){
        const imagen = document.createElement('PICTURE')
        imagen.innerHTML = `
            <source srcset="build/img/gallery/thumb/${i}.avif" type="image/avif">
            <source srcset="build/img/gallery/thumb/${i}.webp" type="image/webp">
            <img loading="lazy" width="200" height="300" src="build/img/gallery/thumb/${i}.jpg" alt="imagen galeria">
        `;
        
        
        //Event Handler (proceso de detectar y responder a una interaccion del usuario)
        imagen.onclick = function(){
            mostrarImagen(i)
        }


        galeria.appendChild(imagen)
    }
}

function mostrarImagen(i){
    const imagen = document.createElement('PICTURE')
    imagen.innerHTML = `
        <source srcset="build/img/gallery/full/${i}.avif" type="image/avif">
        <source srcset="build/img/gallery/full/${i}.webp" type="image/webp">
        <img loading="lazy" width="200" height="300" src="build/img/gallery/full/${i}.jpg" alt="imagen galeria">
    `;

    //Generar Modal
    const modal = document.createElement('DIV')
    modal.classList.add('modal')
    modal.onclick = function(){
        cerrarModal()
    }

    // Boton cerrar modal
    const cerrarModalBtn = document.createElement('BUTTON')
    cerrarModalBtn.textContent = 'X'
    cerrarModalBtn.classList.add('btn-cerrar')
    cerrarModalBtn.onclick = cerrarModal

    modal.appendChild(imagen)
    modal.appendChild(cerrarModalBtn)

    //Agregar al HTML
    const body = document.querySelector('body')
    body.classList.add('overflow-hidden')
    body.appendChild(modal)
    
}

function cerrarModal(){
    const modal = document.querySelector('.modal')
    modal.classList.add('fadeOut')

    setTimeout(()=>{
        modal?.remove()

        const body = document.querySelector('body')
        body.classList.remove('overflow-hidden')
    }, 500);
}

function resaltarEnlace(){
    document.addEventListener('scroll', function(){
        const sections = document.querySelectorAll('section') //seleccionamos todas las etiquetas section
        const navLinks = document.querySelectorAll('.navegacion-principal a')//seleccionamos todos los hipervinculos de la navegacion principal

        let actual = '';
        sections.forEach( section => {
            const sectionTop = section.offsetTop
            const sectionHeight = section.clientHeight

            if(window.scrollY >= (sectionTop - sectionHeight / 3)){
                actual = section.id
            }
        })

        navLinks.forEach(link => {
            link.classList.remove('active')
            if(link.getAttribute('href') === ('#' + actual)){
                link.classList.add('active')
            }
        })
    })
}
function scrollNav(){
    const navLinks = document.querySelectorAll('.navegacion-principal a')

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault()
            const sectionScroll = e.target.getAttribute('href')
            const section = document.querySelector(sectionScroll)

            section.scrollIntoView({behavior:'smooth'})
        })
    })
}