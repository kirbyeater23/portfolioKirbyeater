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

function mediaHTML(src, alt) {
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
    .map((src) => `<div class="modalGaleriaItem">${mediaHTML(src, "")}</div>`)
    .join("");

  return `
    <div class="modalHero">
      <div class="modalHeroMedia ${p.media ? "" : "modalPlaceholder"}">
        ${mediaHTML(p.media, p.nombre)}
      </div>
      <div class="modalHeroInfo">
        <span class="modalTags">${tags}</span>
        <h1 class="modalTitulo">${p.nombre}</h1>
      </div>
    </div>

    <div class="modalMeta">
      <div class="modalMetaItem">
        <small class="modalMetaLabel">CLIENT</small>
        <span>${p.cliente || ""}</span>
      </div>
      <div class="modalMetaItem">
        <small class="modalMetaLabel">YEAR</small>
        <span>${p.anio || ""}</span>
      </div>
      <div class="modalMetaItem">
        <small class="modalMetaLabel">CATEGORY</small>
        <span>${p.categoria || ""}</span>
      </div>
      <div class="modalMetaItem">
        <small class="modalMetaLabel">DESCRIPTION</small>
        <span>${p.descripcionCorta || ""}</span>
      </div>
    </div>

    <div class="modalSeccion">
      <small class="modalLabel">01 — OVERVIEW</small>
      <div class="modalImagenFull ${p.imagen1 ? "" : "modalPlaceholder"}">
        ${mediaHTML(p.imagen1, "")}
      </div>
    </div>

    <div class="modalSeccion">
      <small class="modalLabel">02 — CONCEPT</small>
      <div class="modalConceptoGrid">
        <div class="modalConceptoImagen ${p.imagen2 ? "" : "modalPlaceholder"}">
          ${mediaHTML(p.imagen2, "")}
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
      <div class="modalProcesoImagen ${p.imagen3 ? "" : "modalPlaceholder"}">
        ${mediaHTML(p.imagen3, "")}
      </div>
    </div>

    <div class="modalSeccion">
      <small class="modalLabel">03 — GALLERY</small>
      <div class="modalGaleriaGrid">${galeria}</div>
    </div>

    ${
      p.siguienteProyecto
        ? (() => {
            const sig = todosProyectos.find(
              (x) => x.nombre === p.siguienteProyecto,
            );
            return `<div class="modalSiguiente" ${sig ? `onclick="window.irSiguienteProyecto('${sig.id}')" style="cursor:pointer"` : ""}>
        <small class="modalMetaLabel">NEXT PROJECT</small>
        <h2 class="modalSiguienteTitulo">→ ${p.siguienteProyecto}*</h2>
      </div>`;
          })()
        : ""
    }
  `;
}


const lightbox = document.createElement("div");
lightbox.className = "galeriaLightbox";
lightbox.innerHTML = '<img class="galeriaLightboxImg" src="" alt="" />';
document.body.appendChild(lightbox);

function cerrarLightbox() {
  lightbox.classList.remove("galeriaLightboxVisible");
}

lightbox.addEventListener("click", cerrarLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarLightbox();
});

function ModalProyecto() {
  this.clasesModal = "modalOverlay";
  this.htmlModal = "";

  window.abrirModal = (proyecto) => {
    this.htmlModal = crearModalHTML(proyecto);
    this.clasesModal = "modalOverlay modalVisible";
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const overlay = document.querySelector(".modalOverlay");
      if (overlay) overlay.scrollTop = 0;
    });
  };

  const cerrar = () => {
    this.clasesModal = "modalOverlay";
    document.documentElement.style.overflow = "";
  };

  const clicGaleria = (e) => {
    const img = e.target.closest(".modalGaleriaItem img");
    if (!img) return;
    e.stopPropagation();
    lightbox.querySelector(".galeriaLightboxImg").src = img.src;
    lightbox.classList.add("galeriaLightboxVisible");
  };

  return (render) => render`
    <div class="${this.clasesModal}" onclick="${clicGaleria}">
      <button class="modalCerrar" onclick="${cerrar}">✕</button>
      <div>${this.htmlModal}</div>
    </div>
  `;
}

const rootModal =
  document.getElementById("rootHome") || document.getElementById("rootModal");
lemonade.render(ModalProyecto, rootModal);

