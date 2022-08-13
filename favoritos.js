let flag = false
let deleteHidden ='hidden'
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
                <button class="flex w-full">
                <button  onclick="borrarFav(${res.data.id})" class="${deleteHidden} btnDeleteFav absolute bg-red-600 rounded-full p-1 "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                <img class="rounded-xl " src="https://image.tmdb.org/t/p/w500/${res.data.poster_path}">
                </button>
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
favoritos();
