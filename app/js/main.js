function crearCardProyecto(proyecto) {
  const srcCard = proyecto.mediaCard || proyecto.media;
  const pos = proyecto.objectPosition || "center";
  const contenidoMedia =
    proyecto.tipoMedia === "video"
      ? `<video src="${srcCard}" muted loop playsinline autoplay style="object-position:${pos}"></video>`
      : `<img src="${srcCard}" alt="${proyecto.nombre}" style="object-position:${pos}" />`;

  return `
    <article class="cardProyecto ${proyecto.alineacion}" data-id="${proyecto.id}">
      <div class="imagenProyecto placeholderRectangulo">
        ${contenidoMedia}
      </div>
      <div class="infoProyecto">
        <div class="nombreDescripcion">
          <div class="infoCardNombre">
            <h3>${proyecto.nombre}</h3>
          </div>
          <div class="infoCardDescripcion">
            <h4>${proyecto.descripcion}</h4>
          </div>
        </div>
        <div class="infoCardCliente">
          <h5>// ${proyecto.cliente}</h5>
        </div>
      </div>
    </article>
  `;
}

let todosProyectos = [];

fetch("app/data/proyectos.json")
  .then((r) => r.json())
  .then((proyectos) => {
    todosProyectos = proyectos;

    const gridProyectos = document.getElementById("gridProyectos");
    if (gridProyectos) {
      gridProyectos.innerHTML = proyectos
        .slice(0, 3)
        .map(crearCardProyecto)
        .join("");

      gridProyectos.addEventListener("click", (e) => {
        const card = e.target.closest("[data-id]");
        if (!card) return;
        const proyecto = proyectos.find((p) => p.id === card.dataset.id);
        if (proyecto) window.abrirModal(proyecto);
      });
    }
  });

window.irSiguienteProyecto = (id) => {
  const p = todosProyectos.find((x) => x.id === id);
  if (p) window.abrirModal(p);
};

function mediaHtml(src, alt) {
  if (!src) return "";
  return src.endsWith(".mp4")
    ? `<video src="${src}" muted loop playsinline autoplay></video>`
    : `<img src="${src}" alt="${alt || ""}" />`;
}

function crearModalHTML(p) {
  const tags = Array.isArray(p.tags) ? p.tags.join(" // ") : p.tags || "";

  const imagenesGaleria = [];
  let i = 4;
  while (p[`imagen${i}`] !== undefined) {
    imagenesGaleria.push(p[`imagen${i}`]);
    i++;
  }
  const galeria = imagenesGaleria
    .filter((src) => src)
    .map((src) => `<div class="modalGaleriaElemento">${mediaHtml(src, "")}</div>`)
    .join("");

  return `
    <div class="modalPortada">
      <div class="modalPortadaMedio ${p.media ? "" : "modalVacio"}">
        ${mediaHtml(p.media, p.nombre)}
      </div>
      <div class="modalPortadaInfo">
        <span class="modalEtiquetas">${tags}</span>
        <h1 class="modalTitulo">${p.nombre}</h1>
      </div>
    </div>

    <div class="modalInfoBasica">
      <div class="modalDato">
        <small class="modalEtiquetaDato">CLIENTE</small>
        <span>${p.cliente || ""}</span>
      </div>
      <div class="modalDato">
        <small class="modalEtiquetaDato">AÑO</small>
        <span>${p.anio || ""}</span>
      </div>
      <div class="modalDato">
        <small class="modalEtiquetaDato">CATEGORÍA</small>
        <span>${p.categoria || ""}</span>
      </div>
      <div class="modalDato">
        <small class="modalEtiquetaDato">DESCRIPCIÓN</small>
        <span>${p.descripcionCorta || ""}</span>
      </div>
    </div>

    <div class="modalSeccion">
      <small class="modalApartado">01 — PREVIEW</small>
      <div class="modalImagenCompleta ${p.imagen1 ? "" : "modalVacio"}">
        ${mediaHtml(p.imagen1, "")}
      </div>
    </div>

    <div class="modalSeccion">
      <small class="modalApartado">02 — CONCEPTO</small>
      <div class="modalConceptoRejilla">
        <div class="modalConceptoImagen ${p.imagen2 ? "" : "modalVacio"}">
          ${mediaHtml(p.imagen2, "")}
        </div>
        <div class="modalConceptoTexto">
          <h2>${p.concepto || ""}</h2>
          <p>${p.descripcionLarga || ""}</p>
          <span class="modalAsterisco">*</span>
        </div>
      </div>
    </div>

    ${
      p.cita
        ? `
    <div class="modalCita">
      <blockquote class="modalCitaTexto">${p.cita}</blockquote>
      <p class="modalCitaApoyo">${p.citaTexto || ""}</p>
    </div>
    `
        : ""
    }

    <div class="modalProceso">
      <div class="modalProcesoTexto">
        <h3>${p.procesoTitulo || ""}</h3>
        <p>${p.procesoTexto || ""}</p>
      </div>
      <div class="modalProcesoImagen ${p.imagen3 ? "" : "modalVacio"}">
        ${mediaHtml(p.imagen3, "")}
      </div>
    </div>

    <div class="modalSeccion">
      <small class="modalApartado">03 — GALERÍA</small>
      <div class="modalGaleriaRejilla">${galeria}</div>
    </div>

    ${
      p.siguienteProyecto
        ? (() => {
            const sig = todosProyectos.find(
              (x) => x.nombre === p.siguienteProyecto,
            );
            return `<div class="modalSiguiente" ${sig ? `onclick="window.irSiguienteProyecto('${sig.id}')" style="cursor:pointer"` : ""}>
        <small class="modalEtiquetaDato">SIGUIENTE TRABAJO</small>
        <h2 class="modalSiguienteTitulo">→ ${p.siguienteProyecto}*</h2>
      </div>`;
          })()
        : ""
    }
  `;
}


const lightbox = document.createElement("div");
lightbox.className = "visorGaleria";
lightbox.innerHTML = '<img class="visorGaleriaImg" src="" alt="" />';
document.body.appendChild(lightbox);

function cerrarLightbox() {
  lightbox.classList.remove("visorGaleriaVisible");
}

lightbox.addEventListener("click", cerrarLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarLightbox();
});

function ModalProyecto() {
  this.clasesModal = "modalSuperposicion";
  this.htmlModal = "";

  window.abrirModal = (proyecto) => {
    this.htmlModal = crearModalHTML(proyecto);
    this.clasesModal = "modalSuperposicion modalVisible";
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const overlay = document.querySelector(".modalSuperposicion");
      if (overlay) overlay.scrollTop = 0;
    });
  };

  const cerrar = () => {
    this.clasesModal = "modalSuperposicion";
    document.documentElement.style.overflow = "";
  };

  const clicGaleria = (e) => {
    const img = e.target.closest(".modalGaleriaElemento img");
    if (!img) return;
    e.stopPropagation();
    lightbox.querySelector(".visorGaleriaImg").src = img.src;
    lightbox.classList.add("visorGaleriaVisible");
  };

  return (render) => render`
    <div class="${this.clasesModal}" onclick="${clicGaleria}">
      <button class="modalCerrar" onclick="${cerrar}">×</button>
      <div>${this.htmlModal}</div>
    </div>
  `;
}

const rootModal =
  document.getElementById("rootHome") || document.getElementById("rootModal");
lemonade.render(ModalProyecto, rootModal);


