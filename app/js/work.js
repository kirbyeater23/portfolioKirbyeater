function crearCardWork(proyecto) {
  const srcCard = proyecto.mediaCard || proyecto.media;
  const pos = proyecto.objectPosition || "center";
  const fit = proyecto.fitImagen || "cover";
  const contenidoMedia =
    proyecto.tipoMedia === "video"
      ? `<video src="${srcCard}" muted loop playsinline style="object-fit:${fit};object-position:${pos}"></video>`
      : `<img src="${srcCard}" alt="${proyecto.nombre}" style="object-fit:${fit};object-position:${pos}" />`;
  const imagenStyle = proyecto.alturaImagen
    ? `style="height:${proyecto.alturaImagen}"`
    : "";

  return `
    <article class="cardWork cardWork--${proyecto.tamano}" data-categoria="${proyecto.categoria}" data-id="${proyecto.id}" style="cursor:pointer">
      <div class="imagenWork placeholderRectangulo" ${imagenStyle}>
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

fetch("app/data/proyectos.json")
  .then((r) => r.json())
  .then((proyectos) => {
    function renderizarWork(filtro) {
      const grid = document.getElementById("gridWork");
      if (!grid) return;

      const filtrados =
        filtro === "all"
          ? proyectos
          : proyectos.filter((p) => p.categoria === filtro);

      grid.innerHTML = filtrados.map(crearCardWork).join("");
    }

    const botonesFiltro = document.querySelectorAll(".filtroBtn");

    botonesFiltro.forEach((boton) => {
      boton.addEventListener("click", () => {
        botonesFiltro.forEach((b) => b.classList.remove("filtroActivo"));
        boton.classList.add("filtroActivo");
        renderizarWork(boton.dataset.filtro);
      });
    });

    renderizarWork("all");

    const grid = document.getElementById("gridWork");
    if (grid) {
      grid.addEventListener("click", (e) => {
        const card = e.target.closest("[data-id]");
        if (!card) return;
        const proyecto = proyectos.find((p) => p.id === card.dataset.id);
        if (proyecto) window.abrirModal(proyecto);
      });
    }
  });

// ── Pensante hover ───────────────────────────────────────────────
const pensante = document.createElement("img");
pensante.src = "assets/images/pensante.png";
pensante.style.cssText = "position:fixed;top:0;left:0;width:160px;height:auto;pointer-events:none;opacity:0;z-index:50;";
document.body.appendChild(pensante);

gsap.set(pensante, { x: 0, y: 0, scale: 0.85 });

let cardActual = null;
let cursorX = 0;
let cursorY = 0;
let saltoId = null;

function saltar() {
  const ox = (Math.random() - 0.5) * 120 + 20;
  const oy = -(Math.random() * 100 + 30);
  gsap.to(pensante, { x: cursorX + ox, y: cursorY + oy, duration: 0.06, ease: "none" });
  saltoId = setTimeout(saltar, Math.random() * 220 + 80);
}

document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

document.addEventListener("mouseover", (e) => {
  const card = e.target.closest(".cardWork");
  if (card && card !== cardActual) {
    cardActual = card;
    gsap.to(pensante, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" });
    clearTimeout(saltoId);
    saltar();
  } else if (!card && cardActual) {
    cardActual = null;
    clearTimeout(saltoId);
    saltoId = null;
    gsap.to(pensante, { opacity: 0, scale: 0.85, duration: 0.2 });
  }
});

