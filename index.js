let titulos = "";
let pelicula = "";
let pagina = 1;
const btnSiguente = document.querySelector("#btnSiguente");
const btnAnterior = document.querySelector("#btnAnterior");
const modal = document.querySelector("#modal");
const cerrarModal = document.querySelector("#cerrar-modal");

btnSiguente.addEventListener("click", () => {
  if (pagina < 1000) {
    pagina += 1;
    peliculas();
    window.scroll(0, 0);
  }
});

btnAnterior.addEventListener("click", () => {
  if (pagina != 1) {
    pagina -= 1;
    peliculas();
    window.scroll(0, 0);
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No hay mas paginas anteriores",
      background: "rgb(31 41 55)",
      color: "#fff ",
    });
  }
});

cerrarModal.addEventListener("click", () => {
  hiddenModal();
});

function openModal(id) {
  pelicula = "";
  modal.classList.remove("hidden");
  axios
    .get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX`
    )
    .then((respuesta) => {
      console.log(respuesta);
      pelicula = `
<div class='text-white'>
 <div class="flex flex-row">
   <img class="rounded-xl  max-h-80 mr-4" src="https://image.tmdb.org/t/p/w500/${
     respuesta.data.poster_path
   }">
  <div class="flex flex-col gap-4">
   <p>${respuesta.data.overview}</p>
   <ul class="text-white flex flex-row gap-4">
   ${etiquetas(respuesta.data.genres)}
   </ul>
   <button onclick="favorito(${id})" class="w-10 rounded-full bg-zinc-900" >
   <img src="../assets/heart.png" class="w-10  p-2">
   </button>
  </div>
 </div>
</div>
`;
      document.getElementById("info-modal").innerHTML = pelicula;
    })
    .catch((res) => {
      console.log(res);
    });
}

function hiddenModal() {
  modal.classList.add("hidden");
}

function favorito(id) {
  let getLocal = localStorage.getItem("id");

  if (getLocal === null) {
    let array = [id];
    localStorage.setItem("id", JSON.stringify(array));
    console.log(localStorage.getItem("id"));
    Swal.fire({
      title:'Se agrego!',
      icon:'success',
      toast:true,
      background: "rgb(31 41 55)",
      color: "#fff ",
      timer:1300,
      position: 'bottom-end',
      showConfirmButton: false,
  })
  } else {
    const array = [];
    getLocal = JSON.parse(getLocal);
    for (const data of getLocal) {
        if (data == id) {
          Swal.fire({
            title:'Esta pelicula ya esta en favoritos',
            icon:'error',
            toast:true,
            timer:1300,
            background: "rgb(31 41 55)",
            color: "#fff ",
            position: 'bottom-end',
            showConfirmButton: false,
        })
            return
        }
      array.push(data);
    }
    array.push(id);
    localStorage.setItem("id", JSON.stringify(array));
    Swal.fire({
      title:'Se agrego!',
      icon:'success',
      toast:true,
      timer:1300,
      background: "rgb(31 41 55)",
      color: "#fff ",
      position: 'bottom-end',
      showConfirmButton: false,
  })

  }
}

function etiquetas(etiquetas) {
  let listado = "";
  etiquetas.forEach((data) => {
    listado += `
        <li class="bg-zinc-900 rounded-xl px-4 py-px">
        ${data.name}
        </li>
        `;
  });
  return listado;
}

function peliculas() {
  axios
    .get(
      `
https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`
    )
    .then((respuesta) => {
      console.log(respuesta);
      titulos = "";
      respuesta.data.results.forEach((results) => {
        titulos += `
        <div >
        <button onclick="openModal(${results.id})">
        <img class="rounded-xl " src="https://image.tmdb.org/t/p/w500/${results.poster_path}">
        </button>
        <h3 class="text-xl text-white">${results.title}<h3>
        </div>
        `;
      });
      document.getElementById("contenedorPeliculas").innerHTML = titulos;
    })
    .catch((error) => {
      console.log(error);
    });
}



peliculas();
