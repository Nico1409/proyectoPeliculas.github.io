
let titulos =""
let pagina = 1
const btnSiguente = document.getElementById('btnSiguente')
const btnAnterior = document.getElementById('btnAnterior')

btnSiguente.addEventListener('click' , () =>{
    if(pagina <1000){
        pagina += 1;
      peliculas();
    window.scroll(0,0)

    }
});

btnAnterior.addEventListener('click' , () =>{
    if(pagina != 1){
        pagina -= 1;
      peliculas();
       window.scroll(0,0)
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay mas paginas anteriores',
            background: 'rgb(31 41 55)',
            color:'#fff '
          })
    }
});


function  peliculas() { axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&page=${pagina}`)
.then((respuesta) => {
    titulos = ""
    respuesta.data.results.forEach(results => {
        titulos += `
        <div >
        <img class="rounded-xl " src="https://image.tmdb.org/t/p/w500/${results.poster_path}">
        <h3 class="text-xl text-white">${results.title}<h3>
        </div>
        `
    });
    document.getElementById('contenedor').innerHTML = titulos;
})
.catch((error) => {
    console.log(error)
})
}

peliculas()