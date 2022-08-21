//Declaro variables
let flag = false
let deleteHidden ='hidden'

//Esta funcion carga las peliculas marcadas como favoritas
function favoritos() {
  const array = [];
  let getLocal = JSON.parse(localStorage.getItem("id"));
  let titulosFav = "";

  if (getLocal == null || getLocal == []) {
    titulosFav =
      "<h1 class='text-xl text-yellow-400 w-screen'>Agrega peliculas a favoritos desde la pagina principal!!</h1>";
    document.getElementById("contenedorFavoritos").innerHTML = titulosFav;
    Swal.fire({
      icon: "error",
      title: "No hay peliculas en favoritos",
      text: "Por favor retornar a la pagina principal",
      background: "rgb(31 41 55)",
      color: "#fff ",
    });
  } else {
    for (const data of getLocal) {
      array.push(data);
    }

    array.forEach((id) => {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX`
        )
        .then((res) => {
          titulosFav += `
                <div >
                <div class="flex w-full ">
                <button  onclick="borrarFav(${res.data.id})" class="${deleteHidden} btnDeleteFav absolute bg-red-600 rounded-full p-1 "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                <div class="flex w-full items-end justify-end">
                <img class="rounded-xl " src="https://image.tmdb.org/t/p/w500/${res.data.poster_path}">
                <button  onclick="alquilar('${res.data.title}')" class=" absolute bg-green-600 rounded-full p-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
              </svg></button>
                </div>
                </div>
                <h3 class="text-xl text-white">${res.data.title}<h3>
                </div>
                `;
          document.getElementById("contenedorFavoritos").innerHTML = titulosFav;
        });
    });
  }
  if(flag){
    flag = false
    trash()
  } 

}


//Funcion para borrar peliculas de favoritos
function borrarFav(id) {
  Swal.fire({
    title: "Eliminar de favoritos",
    text: "Seguro quieres eliminar esta pelicula de favoritos?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!",
    background: "rgb(31 41 55)",
    color: "#fff ",
  })
    .then((result) => {
      if (result.isConfirmed) {
        let getLocal = JSON.parse(localStorage.getItem("id"));
        let array = [];
        for (const data of getLocal) {
          array.push(data);
        }
        array.splice(array.indexOf(id), 1);
        if (array.length == 0) {
          localStorage.removeItem("id");
          favoritos();
        } else {
          localStorage.setItem("id", JSON.stringify(array));
          Swal.fire({
            title:'Se elimino de favoritos!',
            icon:'success',
            toast:true,
            timer:1300,
            background: "rgb(31 41 55)",
            color: "#fff ",
            position: 'bottom-end',
            showConfirmButton: false,
        })
          favoritos();

        }

      }
    })
    .catch(() => {
      Swal.fire({
        title: "Error en la base de datos",
        text: "Por favor intente mas tarde",
        icon: "warning",
        background: "rgb(31 41 55)",
        color: "#fff ",
      })
    });

}

//funcion para ver boton para borrar peliculas
function trash() {
btnDeleteFav = document.getElementsByClassName('btnDeleteFav')
btnDeleteFav = [...btnDeleteFav]

if(flag == 0){
btnDeleteFav.forEach((btn)=>{
btn.classList.remove('hidden')
})
flag = true
deleteHidden= ''
}
else{
  btnDeleteFav.forEach((btn)=>{
    btn.classList.add('hidden')
    })
    flag = false
    deleteHidden= 'hidden'
}
}

//funcion para alquilar la pelicula
function alquilar(titulo) {
  Swal.fire({
    title: "Quieres alquilar la pelicula??",
    text: "Seguro quieres alquilar esta pelicula?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    background: "rgb(31 41 55)",
    color: "#fff ",
  }).then((result) => {
    if (result.isConfirmed) {
      nombre = localStorage.getItem('nombre')
      location.assign(`https://wa.me/?text=Hola%20soy%20${nombre},%20quiero%20alquilar%20la%20pelicula%20"${titulo}"`)
    }
  })

}
favoritos();
