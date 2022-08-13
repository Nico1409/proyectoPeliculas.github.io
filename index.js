//declaro variables y constantes
let titulos = "";
let peliculaModal = "";
let pagina = 1;
const btnSiguente = document.querySelector("#btnSiguente");
const btnAnterior = document.querySelector("#btnAnterior");
const modal = document.querySelector("#modal");
const cerrarModal = document.querySelector("#cerrar-modal");

//Cambia de pagina sumando (boton 'Siguente')
btnSiguente.addEventListener("click", () => {
  pagina < 1000
    ? ((pagina += 1), peliculas(), window.scroll(0, 0)) //Hago scroll up cuando cambia de pagina
    : console.log("fallo");
});

//Cambia de pagina restando (boton 'Anterior')
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
      background: "rgb(31 41 5)",
      color: "#fff ",
    });
  }
});

//Detecta cuando se toca afuera del modal
cerrarModal.addEventListener("click", () => {
  hiddenModal();
});

//Funcion que abre modal individual por pelicula
function openModal(id) {
  let heartImg = "heart.png";
  let getLocal = JSON.parse(localStorage.getItem("id"));
  if (getLocal != null) {
    for (const data of getLocal) {
      if (data == id) {
        heartImg = "heartFull.png";
      }
    }
  }
  peliculaModal = "";
  modal.classList.remove("hidden");
  axios
    .get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX`
    )
    .then((respuesta) => {
      peliculaModal = `
<div class='text-white'>
 <button onClick="hiddenModal()" class="w-full flex justify-end"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
 <div class="flex flex-col lg:flex-row">
   <img class="rounded-xl  max-h-80  mr-4" src="https://image.tmdb.org/t/p/w500/${
     respuesta.data.poster_path
   }">
  <div class="flex flex-col gap-4">
   <p>${respuesta.data.overview}</p>
   <ul class="text-white grid grid-cols-2 sm:flex sm:flex-row gap-4">
   ${etiquetas(respuesta.data.genres)}
   </ul>
   <button onclick="favorito(${id})" class="w-10 rounded-full bg-zinc-900" >
   <img id='${id}-0' src="./assets/${heartImg}" class="w-10  p-2">
   </button>
  </div>
 </div>
</div>
`;
      document.getElementById("info-modal").innerHTML = peliculaModal;
    })
    .catch(() => {
      Swal.fire({
        title: "Error en la base de datos",
        text: "Por favor intente mas tarde",
        icon: "warning",
        background: "rgb(31 41 55)",
        color: "#fff ",
      });
    });
}

//Funcion para cerrar modal
function hiddenModal() {
  modal.classList.add("hidden");
}

//Funcion para agregar a favoritos (con localStorage)
function favorito(id) {
  let getLocal = localStorage.getItem("id");
  if (getLocal === null) {
    let arrayIds = [id];
    localStorage.setItem("id", JSON.stringify(arrayIds));
    Swal.fire({
      title: "Se agrego!",
      icon: "success",
      toast: true,
      background: "rgb(31 41 55)",
      color: "#fff",
      timer: 1300,
      position: "bottom-end",
      showConfirmButton: false,
    });
  } else {
    const arrayIds = [];
    getLocal = JSON.parse(getLocal);
    for (const data of getLocal) {
      if (data == id) {
        Swal.fire({
          title: "Esta ya esta en favoritos",
          icon: "error",
          toast: true,
          timer: 1300,
          background: "rgb(31 41 55)",
          color: "#fff ",
          position: "bottom-end",
          showConfirmButton: false,
        });
        return;
      }
      arrayIds.push(data);
    }
    arrayIds.push(id);
    localStorage.setItem("id", JSON.stringify(arrayIds));
    Swal.fire({
      title: "Se agrego!",
      icon: "success",
      toast: true,
      timer: 1300,
      background: "rgb(31 41 55)",
      color: "#fff ",
      position: "bottom-end",
      showConfirmButton: false,
    });
  }
  heartImg = document.getElementById(`${id}-0`);
  heartFav = document.getElementById(`${id}-1`);
  heartImg.setAttribute("src", "./assets/heartFull.png");
  heartFav.classList.remove("hidden");
}

//Funcion para generar etiquetas del modal
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

//Funcion para cargar peliculas a mostrar
function peliculas() {
  axios
    .get(
      `
https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`
    )
    .then((respuesta) => {
      let getLocal = JSON.parse(localStorage.getItem("id"));
      titulos = "";
      respuesta.data.results.forEach((results) => {
        let heartFav = "hidden";
        if (getLocal != null) {
          for (const data of getLocal) {
            if (data == results.id) {
              heartFav = "";
            }
          }
        }
        titulos += `
        <div>
        <div id='${results.id}-1' class="w-7 ${heartFav} rounded-full bg-zinc-900 absolute " >
        <img src="./assets/heartFull.png" class="p-2">
        </div>
        <button onclick="openModal(${results.id})">
        <img class="rounded-xl " src="https://image.tmdb.org/t/p/w500/${results.poster_path}">
        </button>
        <h3 class="text-xl text-white">${results.title}<h3>
        </div>
        `;
      });
      document.getElementById("contenedorPeliculas").innerHTML = titulos;
    })
    .catch(() => {
      Swal.fire({
        title: "Error en la base de datos",
        text: "Por favor intente mas tarde",
        icon: "warning",
        background: "rgb(31 41 55)",
        color: "#fff ",
      });
    });
}

peliculas();
