function favoritos() {
  const array = [];
  let getLocal = JSON.parse(localStorage.getItem("id"));
  let titulosFav = "";

  if (getLocal == null || getLocal == []) {
    titulosFav =
      "<h1 class='text-2xl text-yellow-400 w-screen'>NO HAY PELICULAS EN FAVORITOS</h1>";
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
          console.log(res);
          titulosFav += `
                <div >
                <button onclick="borrarFav(${res.data.id})">
                <img class="rounded-xl " src="https://image.tmdb.org/t/p/w500/${res.data.poster_path}">
                </button>
                <h3 class="text-xl text-white">${res.data.title}<h3>
                </div>
                `;
          document.getElementById("contenedorFavoritos").innerHTML = titulosFav;
        });
    });
  }
}

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
    .catch((res) => {
      console.log(res);
    });
}
favoritos();
